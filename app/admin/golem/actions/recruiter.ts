'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

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

export interface RecruiterDashboard {
  jobsByStatus: { status: string; count: number }[];
  totalJobs: number;
  newHighScoreJobs: number;
  staleApplications: number;
  hotJobs: Array<{
    id: string;
    title: string;
    company: string;
    match_score: number | null;
    source: string;
    url: string;
    created_at: string;
    match_reasons: string[];
  }>;
  connectionMatches: Array<{
    connectionName: string;
    position: string | null;
    company: string | null;
    jobTitle: string;
    jobCompany: string;
  }>;
}

export interface RecruiterJob {
  id: string;
  title: string;
  company: string;
  description: string | null;
  match_reasons: string[] | null;
  match_score: number | null;
  human_match_score: number | null;
  status: string;
  source: string;
  url: string;
  scraped_at: string;
  created_at: string;
}

export async function getRecruiterDashboard(): Promise<{ data: RecruiterDashboard | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const [allJobsRes, hotJobsRes, appliedJobsRes, connectionsRes] = await Promise.all([
      supabase.from('golem_jobs').select('status'),
      supabase.from('golem_jobs')
        .select('id, title, company, match_score, source, url, created_at, match_reasons')
        .eq('status', 'new')
        .gte('match_score', 8)
        .order('match_score', { ascending: false })
        .limit(10),
      supabase.from('golem_jobs')
        .select('id, title, company, status, applied_at')
        .in('status', ['applied', 'saved', 'new'])
        .order('created_at', { ascending: false }),
      supabase.from('linkedin_connections')
        .select('full_name, position, company, company_normalized'),
    ]);

    const errors = [allJobsRes.error, hotJobsRes.error, appliedJobsRes.error, connectionsRes.error]
      .filter(Boolean)
      .map((err) => err!.message);
    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    const statusMap = new Map<string, number>();
    for (const row of (allJobsRes.data || []) as { status: string | null }[]) {
      const status = row.status || 'unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    }
    const jobsByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const appliedJobs = (appliedJobsRes.data || []) as any[];
    const staleApplications = appliedJobs.filter(
      (job) => job.status === 'applied' && job.applied_at && job.applied_at < threeDaysAgo
    ).length;

    const matchableJobs = appliedJobs.map((job: any) => ({
      company: (job.company || '').toLowerCase(),
      title: job.title,
      status: job.status,
    }));
    const connectionMatches: RecruiterDashboard['connectionMatches'] = [];
    for (const conn of (connectionsRes.data || []) as any[]) {
      const normalized = (conn.company_normalized || conn.company || '').toLowerCase();
      if (!normalized) continue;
      for (const job of matchableJobs) {
        if (!job.company) continue;
        if (normalized.includes(job.company) || job.company.includes(normalized)) {
          connectionMatches.push({
            connectionName: conn.full_name || 'Unknown',
            position: conn.position,
            company: conn.company,
            jobTitle: job.title,
            jobCompany: job.company,
          });
        }
      }
    }

    return {
      data: {
        jobsByStatus,
        totalJobs: allJobsRes.data?.length || 0,
        newHighScoreJobs: hotJobsRes.data?.length || 0,
        staleApplications,
        hotJobs: (hotJobsRes.data || []) as any,
        connectionMatches: connectionMatches.slice(0, 10),
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function getRecruiterJobs(): Promise<{ data: RecruiterJob[]; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('golem_jobs')
      .select('id, title, company, description, match_reasons, match_score, human_match_score, status, source, url, scraped_at, created_at')
      .order('scraped_at', { ascending: false })
      .limit(500);

    if (error) return { data: [], error: error.message };
    return { data: (data || []) as RecruiterJob[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
