'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { escapePostgrestSearch } from './utils';
import { REJECTION_TAGS, type JobStatus, type RejectionTag } from '../../lib/constants';

// Verify session before any operation
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  // Extra check: verify username is allowed
  const allowedUsernames = process.env.ALLOWED_GITHUB_USERNAMES?.split(',') || [];
  if (allowedUsernames.length > 0) {
    const username = (session.user as any)?.githubUsername;
    if (!username || !allowedUsernames.includes(username)) {
      throw new Error('Forbidden');
    }
  }

  return session;
}

export interface Job {
  id: string;
  external_id: string;
  title: string;
  company: string;
  location: string | null;
  experience: string | null;
  description: string | null;
  url: string;
  source: string;
  language: string;
  status: string;
  match_score: number | null;
  notes: string | null;
  tags: string[] | null;
  scraped_at: string;
  viewed_at: string | null;
  applied_at: string | null;
  created_at: string;
  human_match_score: number | null;
  human_relevant: boolean | null;
  corrected_at: string | null;
  rejection_tags: RejectionTag[] | null;
  rejection_note: string | null;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  statusCounts: Record<string, number>;
  error: string | null;
}

export async function getJobs(filters?: {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}): Promise<JobsResponse> {
  try {
    await requireAuth();

    const supabase = createAdminClient();
    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 100;
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const includeArchived = filters?.includeArchived ?? false;

    // Main query for paginated results
    let query = supabase
      .from('golem_jobs')
      .select('*', { count: 'exact' })
      .order('scraped_at', { ascending: false })
      .range(from, to);

    // Exclude archived by default unless explicitly requested
    if (!includeArchived && (!filters?.status || filters.status === 'all')) {
      query = query.neq('status', 'archived');
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.source && filters.source !== 'all') {
      query = query.eq('source', filters.source);
    }
    if (filters?.search) {
      const escaped = escapePostgrestSearch(filters.search);
      query = query.or(`title.ilike.%${escaped}%,company.ilike.%${escaped}%`);
    }

    // Separate query for global status counts (across ALL jobs, no pagination)
    const [mainResult, countResult] = await Promise.all([
      query,
      supabase.from('golem_jobs').select('status'),
    ]);

    if (mainResult.error) {
      console.error('Supabase error:', mainResult.error);
      return { jobs: [], total: 0, statusCounts: {}, error: mainResult.error.message };
    }

    // Aggregate status counts client-side
    const statusCounts: Record<string, number> = {};
    for (const row of (countResult.data || []) as { status: string | null }[]) {
      const status = row.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    return {
      jobs: mainResult.data || [],
      total: mainResult.count ?? 0,
      statusCounts,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { jobs: [], total: 0, statusCounts: {}, error: message };
  }
}

const VALID_STATUSES = ['new', 'viewed', 'saved', 'applied', 'archived'] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

export async function updateJobStatus(
  jobId: string,
  status: ValidStatus
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();

    if (!VALID_STATUSES.includes(status)) {
      return { success: false, error: `Invalid status: ${status}` };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('golem_jobs')
      .update({ status })
      .eq('id', jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function saveJobRejection(
  jobId: string,
  tags: RejectionTag[],
  note: string | null,
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();

    if (!jobId || typeof jobId !== 'string') {
      return { success: false, error: 'Invalid job ID' };
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      return { success: false, error: 'At least one rejection tag is required' };
    }
    const validTags = new Set<string>(REJECTION_TAGS);
    if (tags.some((t) => !validTags.has(t))) {
      return { success: false, error: 'Invalid rejection tag' };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('golem_jobs')
      .update({
        status: 'archived',
        rejection_tags: tags,
        rejection_note: note || null,
        human_relevant: false,
        corrected_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
