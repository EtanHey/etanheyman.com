import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

import { getServerSession } from 'next-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  correctEmailCategory,
  correctEmailScore,
  correctJobRelevance,
  correctJobScore,
  getCorrectionStats,
  getEmails,
  getEvents,
} from '../data';

const mockSession = { user: { githubUsername: 'test-user' } };

function createQueryBuilder(result: { data?: unknown; count?: number; error?: { message: string } | null }) {
  const builder: any = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    range: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    gte: vi.fn(() => builder),
    or: vi.fn(() => builder),
    data: result.data ?? null,
    count: result.count ?? 0,
    error: result.error ?? null,
  };

  return builder;
}

beforeEach(() => {
  vi.resetAllMocks();
  delete process.env.ALLOWED_GITHUB_USERNAMES;
});

describe('correctEmailScore', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await correctEmailScore('email-1', 7);

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('validates score range', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const result = await correctEmailScore('email-1', 11);

    expect(result).toEqual({ success: false, error: 'Score must be 1-10' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('updates the email score', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: null }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctEmailScore('email-1', 7);

    expect(fromMock).toHaveBeenCalledWith('emails');
    expect(updateMock).toHaveBeenCalledWith({
      human_score: 7,
      corrected_at: expect.any(String),
    });
    expect(eqMock).toHaveBeenCalledWith('id', 'email-1');
    expect(result).toEqual({ success: true, error: null });
  });

  it('returns supabase errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: { message: 'Update failed' } }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctEmailScore('email-1', 7);

    expect(result).toEqual({ success: false, error: 'Update failed' });
  });
});

describe('correctEmailCategory', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await correctEmailCategory('email-1', 'work');

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('updates the email category', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: null }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctEmailCategory('email-1', 'work');

    expect(fromMock).toHaveBeenCalledWith('emails');
    expect(updateMock).toHaveBeenCalledWith({
      human_category: 'work',
      corrected_at: expect.any(String),
    });
    expect(eqMock).toHaveBeenCalledWith('id', 'email-1');
    expect(result).toEqual({ success: true, error: null });
  });

  it('returns supabase errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: { message: 'Update failed' } }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctEmailCategory('email-1', 'work');

    expect(result).toEqual({ success: false, error: 'Update failed' });
  });
});

describe('correctJobRelevance', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await correctJobRelevance('job-1', true);

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('updates job relevance', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: null }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctJobRelevance('job-1', true);

    expect(fromMock).toHaveBeenCalledWith('golem_jobs');
    expect(updateMock).toHaveBeenCalledWith({
      human_relevant: true,
      corrected_at: expect.any(String),
    });
    expect(eqMock).toHaveBeenCalledWith('id', 'job-1');
    expect(result).toEqual({ success: true, error: null });
  });

  it('returns supabase errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: { message: 'Update failed' } }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctJobRelevance('job-1', false);

    expect(result).toEqual({ success: false, error: 'Update failed' });
  });
});

describe('correctJobScore', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await correctJobScore('job-1', 8);

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('validates score range', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const result = await correctJobScore('job-1', 0);

    expect(result).toEqual({ success: false, error: 'Score must be 1-10' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('updates the job score', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: null }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctJobScore('job-1', 8);

    expect(fromMock).toHaveBeenCalledWith('golem_jobs');
    expect(updateMock).toHaveBeenCalledWith({
      human_match_score: 8,
      corrected_at: expect.any(String),
    });
    expect(eqMock).toHaveBeenCalledWith('id', 'job-1');
    expect(result).toEqual({ success: true, error: null });
  });

  it('returns supabase errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const eqMock = vi.fn(() => ({ error: { message: 'Update failed' } }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await correctJobScore('job-1', 8);

    expect(result).toEqual({ success: false, error: 'Update failed' });
  });
});

describe('getCorrectionStats', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await getCorrectionStats();

    expect(result).toEqual({ data: null, error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('calls the correction stats RPC', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const rpcMock = vi.fn(() => ({
      data: {
        emails_total: 1,
        emails_corrected: 1,
        emails_disagreements: 0,
        jobs_total: 1,
        jobs_corrected: 1,
        jobs_thumbs_up: 1,
        jobs_thumbs_down: 0,
      },
      error: null,
    }));
    vi.mocked(createAdminClient).mockReturnValue({ rpc: rpcMock } as any);

    const result = await getCorrectionStats();

    expect(rpcMock).toHaveBeenCalledWith('get_correction_stats');
    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({ emails_total: 1, jobs_total: 1 });
  });

  it('returns RPC errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const rpcMock = vi.fn(() => ({ data: null, error: { message: 'RPC failed' } }));
    vi.mocked(createAdminClient).mockReturnValue({ rpc: rpcMock } as any);

    const result = await getCorrectionStats();

    expect(result).toEqual({ data: null, error: 'RPC failed' });
  });
});

describe('getEmails', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await getEmails();

    expect(result).toEqual({ emails: [], total: 0, error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('applies filters and returns emails with pagination', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const query = createQueryBuilder({ data: [{ id: 'email-1' }], count: 42, error: null });
    const fromMock = vi.fn(() => query);
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await getEmails({
      category: 'work',
      minScore: 7,
      search: 'dev,ops%test',
      page: 0,
      pageSize: 50,
    });

    expect(fromMock).toHaveBeenCalledWith('emails');
    expect(query.select).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(query.range).toHaveBeenCalledWith(0, 49);
    expect(query.eq).toHaveBeenCalledWith('category', 'work');
    expect(query.gte).toHaveBeenCalledWith('score', 7);
    expect(query.or).toHaveBeenCalledWith(
      'subject.ilike.%devopstest%,from_address.ilike.%devopstest%'
    );
    expect(result).toEqual({ emails: [{ id: 'email-1' }], total: 42, error: null });
  });

  it('returns query errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const query = createQueryBuilder({ data: null, error: { message: 'Query failed' } });
    const fromMock = vi.fn(() => query);
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await getEmails();

    expect(result).toEqual({ emails: [], total: 0, error: 'Query failed' });
  });
});

describe('getEvents', () => {
  it('rejects unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await getEvents();

    expect(result).toEqual({ events: [], error: 'Unauthorized' });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('uses the provided limit', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const query = createQueryBuilder({ data: [{ id: 'event-1' }], error: null });
    const fromMock = vi.fn(() => query);
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await getEvents(10);

    expect(fromMock).toHaveBeenCalledWith('golem_events');
    expect(query.limit).toHaveBeenCalledWith(10);
    expect(result).toEqual({ events: [{ id: 'event-1' }], error: null });
  });

  it('returns query errors', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any);

    const query = createQueryBuilder({ data: null, error: { message: 'Query failed' } });
    const fromMock = vi.fn(() => query);
    vi.mocked(createAdminClient).mockReturnValue({ from: fromMock } as any);

    const result = await getEvents();

    expect(result).toEqual({ events: [], error: 'Query failed' });
  });
});
