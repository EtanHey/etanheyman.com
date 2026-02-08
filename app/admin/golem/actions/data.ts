'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createClient } from '@/lib/supabase/server';

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

export interface OverviewStats {
  totalEmails: number;
  totalJobs: number;
  totalEvents: number;
  totalContacts: number;
  recentEvents: GolemEvent[];
  emailsByCategory: { category: string; count: number; avg_score: number }[];
  jobsByStatus: { status: string; count: number }[];
  railwayHealth: { status: string; golemStatus?: string; uptime?: number } | null;
}

export async function getOverviewStats(): Promise<{ data: OverviewStats | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = await createClient();

    const [emailsRes, jobsRes, eventsCountRes, eventsRes, contactsRes, allEmailsRes, allJobsRes] = await Promise.all([
      supabase.from('emails').select('id', { count: 'exact', head: true }),
      supabase.from('golem_jobs').select('id', { count: 'exact', head: true }),
      supabase.from('golem_events').select('id', { count: 'exact', head: true }),
      supabase.from('golem_events').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('outreach_contacts').select('id', { count: 'exact', head: true }),
      supabase.from('emails').select('category, score'),
      supabase.from('golem_jobs').select('status'),
    ]);

    // Aggregate email categories
    let emailsByCategory: { category: string; count: number; avg_score: number }[] = [];
    if (allEmailsRes.data) {
      const cats = new Map<string, { count: number; totalScore: number }>();
      for (const e of allEmailsRes.data) {
        const cat = e.category || 'unknown';
        const existing = cats.get(cat) || { count: 0, totalScore: 0 };
        existing.count++;
        existing.totalScore += e.score || 0;
        cats.set(cat, existing);
      }
      emailsByCategory = Array.from(cats.entries())
        .map(([category, { count, totalScore }]) => ({
          category,
          count,
          avg_score: Math.round((totalScore / count) * 10) / 10,
        }))
        .sort((a, b) => b.count - a.count);
    }

    // Aggregate job statuses
    let jobsByStatus: { status: string; count: number }[] = [];
    if (allJobsRes.data) {
      const stats = new Map<string, number>();
      for (const j of allJobsRes.data) {
        stats.set(j.status, (stats.get(j.status) || 0) + 1);
      }
      jobsByStatus = Array.from(stats.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);
    }

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
    const supabase = await createClient();
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
    const supabase = await createClient();

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
    const supabase = await createClient();
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
    const supabase = await createClient();

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
