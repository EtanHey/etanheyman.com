'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const RAILWAY_HEALTH_URL = process.env.RAILWAY_HEALTH_URL || 'https://golems-production.up.railway.app/health';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  const allowedUsernames = process.env.ALLOWED_GITHUB_USERNAMES?.split(',') || [];
  if (allowedUsernames.length > 0) {
    const username = (session.user as any)?.githubUsername;
    if (!username || !allowedUsernames.includes(username)) throw new Error('Forbidden');
  }
  return session;
}

// ─── Types ───────────────────────────────────────────

export interface GolemEvent {
  id: string;
  actor: string;
  type: string;
  data: Record<string, unknown>;
  created_at: string;
}

export interface Email {
  id: string;
  gmail_id: string;
  subject: string | null;
  from_address: string | null;
  snippet: string | null;
  score: number | null;
  category: string | null;
  received_at: string | null;
  scored_at: string | null;
  notified: boolean | null;
  human_score: number | null;
  human_category: string | null;
  corrected_at: string | null;
}

export interface GolemState {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface OutreachContact {
  id: string;
  name: string;
  email: string | null;
  linkedin_url: string | null;
  company: string | null;
  role: string | null;
  source: string | null;
  created_at: string;
}

export interface OutreachMessage {
  id: string;
  job_id: string | null;
  contact_id: string | null;
  message_type: string;
  message_text: string | null;
  status: string;
  sent_at: string | null;
  created_at: string;
}

// ─── Overview Stats ──────────────────────────────────

export interface ServiceStatus {
  name: string;
  schedule: string;
  lastRun: string | null;
  status: 'ok' | 'stale' | 'unknown';
  staleThresholdHours: number;
}

export interface OverviewStats {
  totalEmails: number;
  totalJobs: number;
  totalEvents: number;
  totalContacts: number;
  recentEvents: GolemEvent[];
  emailsByCategory: { category: string; count: number; avg_score: number }[];
  jobsByStatus: { status: string; count: number }[];
  railwayHealth: { status: string; golemStatus?: string; uptime?: number } | null;
  serviceStatuses: ServiceStatus[];
}

export async function getOverviewStats(): Promise<{ data: OverviewStats | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const [emailsRes, jobsRes, eventsCountRes, eventsRes, contactsRes, emailCatsRes, jobStatusRes, stateRes] = await Promise.all([
      supabase.from('emails').select('id', { count: 'exact', head: true }),
      supabase.from('golem_jobs').select('id', { count: 'exact', head: true }),
      supabase.from('golem_events').select('id', { count: 'exact', head: true }),
      supabase.from('golem_events').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('outreach_contacts').select('id', { count: 'exact', head: true }),
      supabase.rpc('get_email_category_stats'),
      supabase.rpc('get_job_status_counts'),
      supabase.from('golem_state').select('key, value, updated_at'),
    ]);

    // SQL-aggregated email categories
    const emailsByCategory: { category: string; count: number; avg_score: number }[] =
      (emailCatsRes.data || []).map((r: { category: string; count: number; avg_score: number }) => ({
        category: r.category,
        count: Number(r.count),
        avg_score: Number(r.avg_score),
      }));

    // SQL-aggregated job statuses
    const jobsByStatus: { status: string; count: number }[] =
      (jobStatusRes.data || []).map((r: { status: string; count: number }) => ({
        status: r.status,
        count: Number(r.count),
      }));

    // Railway health check
    let railwayHealth: OverviewStats['railwayHealth'] = null;
    try {
      const res = await fetch(RAILWAY_HEALTH_URL, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        railwayHealth = await res.json();
      } else {
        railwayHealth = { status: 'down' };
      }
    } catch {
      railwayHealth = { status: 'unreachable' };
    }

    // Build service statuses from golem_state
    const stateMap = new Map<string, { value: unknown; updated_at: string }>();
    if (stateRes.data) {
      for (const row of stateRes.data) {
        stateMap.set(row.key, { value: row.value, updated_at: row.updated_at });
      }
    }

    function getServiceStatus(
      name: string,
      schedule: string,
      stateKey: string,
      staleThresholdHours: number,
    ): ServiceStatus {
      const entry = stateMap.get(stateKey);
      if (!entry || !entry.value) {
        return { name, schedule, lastRun: null, status: 'unknown', staleThresholdHours };
      }
      const lastRun = typeof entry.value === 'string' ? entry.value : entry.updated_at;
      const hoursSince = (Date.now() - new Date(lastRun).getTime()) / (1000 * 60 * 60);
      return {
        name,
        schedule,
        lastRun,
        status: hoursSince <= staleThresholdHours ? 'ok' : 'stale',
        staleThresholdHours,
      };
    }

    const serviceStatuses: ServiceStatus[] = [
      getServiceStatus('Email Golem', 'Hourly 6am-7pm, 10pm check', 'lastEmailCheck', 3),
      getServiceStatus('Job Golem', '6am, 9am, 1pm Sun-Thu', 'lastJobRun', 24),
      getServiceStatus('Night Shift', '4am daily (local)', 'lastNightShift', 36),
      getServiceStatus('Morning Briefing', '8am daily', 'lastBriefing', 36),
    ];

    return {
      data: {
        totalEmails: emailsRes.count || 0,
        totalJobs: jobsRes.count || 0,
        totalEvents: eventsCountRes.count || 0,
        totalContacts: contactsRes.count || 0,
        recentEvents: (eventsRes.data || []) as GolemEvent[],
        emailsByCategory,
        jobsByStatus,
        railwayHealth,
        serviceStatuses,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Events / Alerts ─────────────────────────────────

export async function getEvents(limit = 50): Promise<{ events: GolemEvent[]; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('golem_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { events: [], error: error.message };
    return { events: (data || []) as GolemEvent[], error: null };
  } catch (err) {
    return { events: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Emails ──────────────────────────────────────────

export async function getEmails(filters?: {
  category?: string;
  minScore?: number;
  search?: string;
  limit?: number;
}): Promise<{ emails: Email[]; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    let query = supabase
      .from('emails')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(filters?.limit || 100);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.minScore) query = query.gte('score', filters.minScore);
    if (filters?.search) {
      // Strip characters that could break PostgREST .or() parsing
      const sanitized = filters.search.replace(/[^a-zA-Z0-9@.\-_ ]/g, '');
      if (sanitized) {
        query = query.or(`subject.ilike.%${sanitized}%,from_address.ilike.%${sanitized}%`);
      }
    }

    const { data, error } = await query;
    if (error) return { emails: [], error: error.message };
    return { emails: (data || []) as Email[], error: null };
  } catch (err) {
    return { emails: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── State (Night Shift, etc) ────────────────────────

export async function getGolemState(): Promise<{ state: GolemState[]; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('golem_state')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) return { state: [], error: error.message };
    return { state: (data || []) as GolemState[], error: null };
  } catch (err) {
    return { state: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Outreach ────────────────────────────────────────

export async function getOutreachData(): Promise<{
  contacts: OutreachContact[];
  messages: OutreachMessage[];
  error: string | null;
}> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const [contactsRes, messagesRes] = await Promise.all([
      supabase.from('outreach_contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('outreach_messages').select('*').order('created_at', { ascending: false }),
    ]);

    return {
      contacts: (contactsRes.data || []) as OutreachContact[],
      messages: (messagesRes.data || []) as OutreachMessage[],
      error: [contactsRes.error?.message, messagesRes.error?.message].filter(Boolean).join('; ') || null,
    };
  } catch (err) {
    return { contacts: [], messages: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Email Corrections (Feedback Loop) ──────────────

export async function correctEmailScore(
  emailId: string,
  humanScore: number,
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    if (humanScore < 1 || humanScore > 10) return { success: false, error: 'Score must be 1-10' };
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('emails')
      .update({ human_score: humanScore, corrected_at: new Date().toISOString() })
      .eq('id', emailId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function correctEmailCategory(
  emailId: string,
  humanCategory: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('emails')
      .update({ human_category: humanCategory, corrected_at: new Date().toISOString() })
      .eq('id', emailId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Job Corrections (Feedback Loop) ────────────────

export async function correctJobRelevance(
  jobId: string,
  relevant: boolean,
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('golem_jobs')
      .update({ human_relevant: relevant, corrected_at: new Date().toISOString() })
      .eq('id', jobId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function correctJobScore(
  jobId: string,
  humanScore: number,
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    if (humanScore < 1 || humanScore > 10) return { success: false, error: 'Score must be 1-10' };
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('golem_jobs')
      .update({ human_match_score: humanScore, corrected_at: new Date().toISOString() })
      .eq('id', jobId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Correction Stats ───────────────────────────────

export async function getCorrectionStats(): Promise<{
  data: {
    emails_total: number;
    emails_corrected: number;
    emails_disagreements: number;
    jobs_total: number;
    jobs_corrected: number;
    jobs_thumbs_up: number;
    jobs_thumbs_down: number;
  } | null;
  error: string | null;
}> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('get_correction_stats');
    if (error) return { data: null, error: error.message };
    return { data: data as any, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
