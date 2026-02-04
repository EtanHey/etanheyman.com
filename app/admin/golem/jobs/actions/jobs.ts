'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@/lib/supabase/server';

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
}

export async function getJobs(filters?: {
  status?: string;
  source?: string;
  search?: string;
}): Promise<{ jobs: Job[]; error: string | null }> {
  try {
    await requireAuth();
    
    const supabase = await createClient();
    
    let query = supabase
      .from('golem_jobs')
      .select('*')
      .order('scraped_at', { ascending: false })
      .limit(100);

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.source && filters.source !== 'all') {
      query = query.eq('source', filters.source);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return { jobs: [], error: error.message };
    }

    return { jobs: data || [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { jobs: [], error: message };
  }
}

export async function updateJobStatus(
  jobId: string,
  status: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await requireAuth();
    
    const supabase = await createClient();
    
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
