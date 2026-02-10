'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const RAILWAY_BASE_URL = process.env.RAILWAY_BASE_URL || 'https://golems-production.up.railway.app';
const RAILWAY_HEALTH_URL = process.env.RAILWAY_HEALTH_URL || `${RAILWAY_BASE_URL}/health`;

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

export interface UsageBySource {
  calls: number;
  inputTokens: number;
  outputTokens: number;
}

export interface UsageStats {
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCostUSD: number;
  bySource: Record<string, UsageBySource>;
}

export interface OverviewStats {
  totalEmails: number;
  totalJobs: number;
  totalEvents: number;
  totalContacts: number;
  totalConnections: number;
  recentEvents: GolemEvent[];
  emailsByCategory: { category: string; count: number; avg_score: number }[];
  jobsByStatus: { status: string; count: number }[];
  railwayHealth: { status: string; golemStatus?: string; uptime?: number } | null;
  serviceStatuses: ServiceStatus[];
  usageStats: UsageStats | null;
}

export interface GolemOverviewStats {
  recruiter: {
    newJobs: number;
    appliedJobs: number;
  };
  teller: {
    monthlyTotal: number;
    paymentAlerts: number;
  };
  monitor: {
    servicesGreen: number;
    totalServices: number;
    llmSpend: number;
  };
}

function monthlyMultiplier(frequency: string | null): number {
  if (!frequency) return 1;
  const freq = frequency.toLowerCase();
  if (freq.includes('year') || freq.includes('annual')) return 1 / 12;
  if (freq.includes('quarter')) return 1 / 3;
  if (freq.includes('week')) return 52 / 12;
  if (freq.includes('day')) return 30;
  if (freq.includes('month')) return 1;
  return 1;
}

function isGreenServiceStatus(status: string | null): boolean {
  if (!status) return false;
  const normalized = status.toLowerCase();
  if (normalized.includes('fail') || normalized.includes('error')) return false;
  return (
    normalized.includes('ok') ||
    normalized.includes('success') ||
    normalized.includes('complete') ||
    normalized.includes('healthy') ||
    normalized.includes('running')
  );
}

export async function getGolemOverviewStats(): Promise<{ data: GolemOverviewStats | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [jobsRes, subsRes, emailsRes, runsRes, usageRes] = await Promise.all([
      supabase.from('golem_jobs').select('status'),
      supabase.from('subscriptions').select('amount, frequency, status'),
      supabase
        .from('emails')
        .select('id')
        .eq('category', 'subscription')
        .gte('received_at', thirtyDaysAgo),
      supabase
        .from('service_runs')
        .select('service, started_at, ended_at, status')
        .order('started_at', { ascending: false })
        .limit(200),
      supabase
        .from('llm_usage')
        .select('cost_usd, created_at')
        .gte('created_at', sevenDaysAgo),
    ]);

    const errors = [jobsRes.error, subsRes.error, emailsRes.error, runsRes.error, usageRes.error]
      .filter(Boolean)
      .map((err) => err!.message);
    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    let newJobs = 0;
    let appliedJobs = 0;
    for (const row of (jobsRes.data || []) as { status: string | null }[]) {
      if (row.status === 'new') newJobs += 1;
      if (row.status === 'applied') appliedJobs += 1;
    }

    const subscriptions = (subsRes.data || []) as Array<{
      amount: number | null;
      frequency: string | null;
      status: string | null;
    }>;
    const monthlyTotal = subscriptions.reduce((total, sub) => {
      if (sub.status?.toLowerCase() !== 'active') return total;
      if (sub.amount == null) return total;
      return total + sub.amount * monthlyMultiplier(sub.frequency);
    }, 0);

    const paymentAlerts = (emailsRes.data || []).length;

    const latestByService = new Map<string, { status: string | null }>();
    for (const row of (runsRes.data || []) as any[]) {
      if (!latestByService.has(row.service)) {
        latestByService.set(row.service, { status: row.status || null });
      }
    }
    const totalServices = latestByService.size;
    let servicesGreen = 0;
    for (const entry of latestByService.values()) {
      if (isGreenServiceStatus(entry.status)) servicesGreen += 1;
    }

    let llmSpend = 0;
    for (const row of (usageRes.data || []) as { cost_usd: number | null }[]) {
      llmSpend += row.cost_usd || 0;
    }

    return {
      data: {
        recruiter: {
          newJobs,
          appliedJobs,
        },
        teller: {
          monthlyTotal,
          paymentAlerts,
        },
        monitor: {
          servicesGreen,
          totalServices,
          llmSpend,
        },
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getOverviewStats(): Promise<{ data: OverviewStats | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const [emailsRes, jobsRes, eventsCountRes, eventsRes, contactsRes, connectionsRes, allEmailsRes, allJobsRes, stateRes] = await Promise.all([
      supabase.from('emails').select('id', { count: 'exact', head: true }),
      supabase.from('golem_jobs').select('id', { count: 'exact', head: true }),
      supabase.from('golem_events').select('id', { count: 'exact', head: true }),
      supabase.from('golem_events').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('outreach_contacts').select('id', { count: 'exact', head: true }),
      supabase.from('linkedin_connections').select('id', { count: 'exact', head: true }),
      supabase.from('emails').select('category, score'),
      supabase.from('golem_jobs').select('status'),
      supabase.from('golem_state').select('key, value, updated_at'),
    ]);

    // Client-side aggregation: email categories
    const catMap = new Map<string, { count: number; totalScore: number }>();
    for (const row of (allEmailsRes.data || []) as { category: string | null; score: number | null }[]) {
      const cat = row.category || 'other';
      const entry = catMap.get(cat) || { count: 0, totalScore: 0 };
      entry.count++;
      if (row.score != null) entry.totalScore += row.score;
      catMap.set(cat, entry);
    }
    const emailsByCategory = Array.from(catMap.entries())
      .map(([category, { count, totalScore }]) => ({
        category,
        count,
        avg_score: count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Client-side aggregation: job statuses
    const statusMap = new Map<string, number>();
    for (const row of (allJobsRes.data || []) as { status: string | null }[]) {
      const status = row.status || 'unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    }
    const jobsByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

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

    // Fetch usage stats from cloud worker
    let usageStats: UsageStats | null = null;
    try {
      const usageRes = await fetch(`${RAILWAY_BASE_URL}/usage?period=all`, {
        signal: AbortSignal.timeout(5000),
      });
      if (usageRes.ok) {
        const raw = await usageRes.json();
        // Map nested response (paid.totalCalls, etc.) to flat UsageStats
        const paid = raw.paid || {};
        const rawBySource = paid.bySource || {};
        const bySource: Record<string, UsageBySource> = {};
        for (const [src, data] of Object.entries(rawBySource)) {
          const d = data as Record<string, number>;
          bySource[src] = {
            calls: d.totalCalls ?? 0,
            inputTokens: d.totalInputTokens ?? 0,
            outputTokens: d.totalOutputTokens ?? 0,
          };
        }
        usageStats = {
          totalCalls: paid.totalCalls ?? raw.combined?.totalCalls ?? 0,
          totalInputTokens: paid.totalInputTokens ?? 0,
          totalOutputTokens: paid.totalOutputTokens ?? 0,
          estimatedCostUSD: paid.totalCost ?? 0,
          bySource,
        };
      }
    } catch {
      // Usage stats are non-critical, silently fail
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
        totalConnections: connectionsRes.count || 0,
        recentEvents: (eventsRes.data || []) as GolemEvent[],
        emailsByCategory,
        jobsByStatus,
        railwayHealth,
        serviceStatuses,
        usageStats,
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
  page?: number;
  pageSize?: number;
}): Promise<{ emails: Email[]; total: number; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 100;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('emails')
      .select('*', { count: 'exact' })
      .order('received_at', { ascending: false })
      .range(from, to);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.minScore) query = query.gte('score', filters.minScore);
    if (filters?.search) {
      // Strip characters that could break PostgREST .or() parsing
      const sanitized = filters.search.replace(/[^a-zA-Z0-9@.\-_ ]/g, '');
      if (sanitized) {
        query = query.or(`subject.ilike.%${sanitized}%,from_address.ilike.%${sanitized}%`);
      }
    }

    const { data, count, error } = await query;
    if (error) return { emails: [], total: 0, error: error.message };
    return { emails: (data || []) as Email[], total: count ?? 0, error: null };
  } catch (err) {
    return { emails: [], total: 0, error: err instanceof Error ? err.message : 'Unknown error' };
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

// ─── Outreach (Legacy) ───────────────────────────────

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

// ─── LinkedIn Connections ────────────────────────────

export interface LinkedInConnection {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  linkedin_url: string | null;
  email: string | null;
  company: string | null;
  company_normalized: string | null;
  position: string | null;
  connected_on: string | null;
  has_messages: boolean;
  relationship_strength: string | null;
  created_at: string;
}

export interface ConnectionMatch {
  id: string;
  job_id: string;
  connection_id: string;
  company_match_type: string;
  match_confidence: number;
  job: {
    id: string;
    title: string;
    company: string;
    url: string;
    status: string;
    match_score: number | null;
  } | null;
  connection: {
    id: string;
    full_name: string;
    company: string | null;
    position: string | null;
    linkedin_url: string | null;
  } | null;
}

export async function getLinkedInConnections(filters?: {
  search?: string;
  hasMessages?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{
  connections: LinkedInConnection[];
  total: number;
  error: string | null;
}> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('linkedin_connections')
      .select('*', { count: 'exact' })
      .order('connected_on', { ascending: false })
      .range(from, to);

    if (filters?.search) {
      const escaped = filters.search.replace(/[^a-zA-Z0-9@.\-_ ]/g, '');
      if (escaped) {
        query = query.or(
          `full_name.ilike.%${escaped}%,company.ilike.%${escaped}%,position.ilike.%${escaped}%`
        );
      }
    }

    if (filters?.hasMessages) {
      query = query.eq('has_messages', true);
    }

    const { data, count, error } = await query;
    if (error) return { connections: [], total: 0, error: error.message };
    return {
      connections: (data || []) as LinkedInConnection[],
      total: count ?? 0,
      error: null,
    };
  } catch (err) {
    return {
      connections: [],
      total: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function getConnectionMatches(): Promise<{
  matches: ConnectionMatch[];
  error: string | null;
}> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    // Get matches with joined job and connection data
    const { data, error } = await supabase
      .from('job_connections')
      .select(`
        id,
        job_id,
        connection_id,
        company_match_type,
        match_confidence,
        golem_jobs!job_connections_job_id_fkey (id, title, company, url, status, match_score),
        linkedin_connections!job_connections_connection_id_fkey (id, full_name, company, position, linkedin_url)
      `)
      .order('match_confidence', { ascending: false })
      .limit(100);

    if (error) return { matches: [], error: error.message };

    const matches = (data || []).map((row: any) => ({
      id: row.id,
      job_id: row.job_id,
      connection_id: row.connection_id,
      company_match_type: row.company_match_type,
      match_confidence: row.match_confidence,
      job: row.golem_jobs,
      connection: row.linkedin_connections,
    }));

    return { matches, error: null };
  } catch (err) {
    return {
      matches: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
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

// ─── Email Senders ──────────────────────────────────

export interface EmailSender {
  email_address: string;
  display_name: string | null;
  domain: string | null;
  category: string | null;
  total_emails: number;
  last_email_at: string | null;
  avg_score: number | null;
  unsubscribe_url: string | null;
  unsubscribe_email: string | null;
  unsubscribe_status: string | null;
  user_action: string | null;
}

export interface SenderDetails {
  sender: EmailSender;
  recentEmails: Array<{
    id: string;
    subject: string | null;
    received_at: string | null;
    score: number | null;
  }>;
}

export async function getSenderDetails(
  emailAddress: string,
): Promise<{ data: SenderDetails | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const [senderRes, emailsRes] = await Promise.all([
      supabase
        .from('email_senders')
        .select('*')
        .eq('email_address', emailAddress)
        .single(),
      supabase
        .from('emails')
        .select('id, subject, received_at, score')
        .eq('from_address', emailAddress)
        .order('received_at', { ascending: false })
        .limit(10),
    ]);

    if (senderRes.error) {
      return { data: null, error: senderRes.error.message };
    }

    return {
      data: {
        sender: senderRes.data as EmailSender,
        recentEmails: (emailsRes.data || []) as SenderDetails['recentEmails'],
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function setSenderAction(
  emailAddress: string,
  action: 'keep' | 'unsubscribe' | 'block',
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('email_senders')
      .update({ user_action: action })
      .eq('email_address', emailAddress);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function bulkSetSenderAction(
  emailAddresses: string[],
  action: 'keep' | 'unsubscribe' | 'block',
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    if (emailAddresses.length === 0)
      return { success: false, error: 'No addresses provided' };
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('email_senders')
      .update({ user_action: action })
      .in('email_address', emailAddresses);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ─── Scrape Activity ────────────────────────────────

export interface ScrapeActivity {
  id: string;
  source: string;
  run_at: string;
  total_found: number;
  new_saved: number;
  duplicates_skipped: number;
  errors: number;
  avg_description_length: number | null;
  no_description_count: number;
  id_like_title_count: number;
  no_company_count: number;
  duration_ms: number | null;
  notes: string | null;
}

export async function getScrapeActivity(
  limit = 50,
): Promise<{ data: ScrapeActivity[]; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('scrape_activity')
      .select('*')
      .order('run_at', { ascending: false })
      .limit(limit);

    if (error) return { data: [], error: error.message };
    return { data: (data || []) as ScrapeActivity[], error: null };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ─── Quality Stats ──────────────────────────────────

export interface QualityStats {
  totalJobs: number;
  withDescription: number;
  withoutDescription: number;
  avgDescriptionLength: number;
  idLikeTitleCount: number;
  noCompanyCount: number;
  bySource: Array<{
    source: string;
    total: number;
    withDescription: number;
    avgDescLength: number;
    noCompanyCount: number;
  }>;
}

export async function getQualityStats(): Promise<{
  data: QualityStats | null;
  error: string | null;
}> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('golem_jobs')
      .select('source, description, title, company');

    if (error) return { data: null, error: error.message };

    const jobs = (data || []) as Array<{
      source: string;
      description: string | null;
      title: string;
      company: string | null;
    }>;

    const totalJobs = jobs.length;
    let withDescription = 0;
    let totalDescLength = 0;
    let idLikeTitleCount = 0;
    let noCompanyCount = 0;

    const sourceMap = new Map<
      string,
      { total: number; withDesc: number; totalDescLen: number; noCompany: number }
    >();

    for (const job of jobs) {
      const hasDesc = !!job.description && job.description.trim().length > 0;
      const descLen = hasDesc ? job.description!.length : 0;
      if (hasDesc) {
        withDescription++;
        totalDescLength += descLen;
      }
      if (/^Job #\d+/.test(job.title)) idLikeTitleCount++;
      if (!job.company || job.company.trim() === '') noCompanyCount++;

      const src = job.source || 'unknown';
      const entry = sourceMap.get(src) || {
        total: 0,
        withDesc: 0,
        totalDescLen: 0,
        noCompany: 0,
      };
      entry.total++;
      if (hasDesc) {
        entry.withDesc++;
        entry.totalDescLen += descLen;
      }
      if (!job.company || job.company.trim() === '') entry.noCompany++;
      sourceMap.set(src, entry);
    }

    const bySource = Array.from(sourceMap.entries())
      .map(([source, s]) => ({
        source,
        total: s.total,
        withDescription: s.withDesc,
        avgDescLength:
          s.withDesc > 0 ? Math.round(s.totalDescLen / s.withDesc) : 0,
        noCompanyCount: s.noCompany,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      data: {
        totalJobs,
        withDescription,
        withoutDescription: totalJobs - withDescription,
        avgDescriptionLength:
          withDescription > 0
            ? Math.round(totalDescLength / withDescription)
            : 0,
        idLikeTitleCount,
        noCompanyCount,
        bySource,
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
