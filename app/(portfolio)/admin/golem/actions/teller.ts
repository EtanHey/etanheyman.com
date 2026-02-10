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

export interface TellerDashboard {
  subscriptions: Array<{
    id: string;
    service_name: string;
    amount: number | null;
    currency: string | null;
    frequency: string | null;
    status: string | null;
    last_payment: string | null;
  }>;
  monthlyTotal: number;
  recentSubscriptionEmails: Array<{
    id: string;
    subject: string | null;
    from_address: string | null;
    received_at: string | null;
    score: number | null;
  }>;
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

export async function getTellerDashboard(): Promise<{ data: TellerDashboard | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [subscriptionsRes, emailsRes] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('id, service_name, amount, currency, frequency, status, last_payment')
        .order('service_name', { ascending: true }),
      supabase
        .from('emails')
        .select('id, subject, from_address, received_at, score')
        .eq('category', 'subscription')
        .gte('received_at', thirtyDaysAgo)
        .order('received_at', { ascending: false }),
    ]);

    const errors = [subscriptionsRes.error, emailsRes.error]
      .filter(Boolean)
      .map((err) => err!.message);
    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    const subscriptions = (subscriptionsRes.data || []) as TellerDashboard['subscriptions'];
    const monthlyTotal = subscriptions.reduce((total, sub) => {
      if (sub.status?.toLowerCase() !== 'active') return total;
      if (sub.amount == null) return total;
      return total + sub.amount * monthlyMultiplier(sub.frequency);
    }, 0);

    return {
      data: {
        subscriptions,
        monthlyTotal,
        recentSubscriptionEmails: (emailsRes.data || []) as TellerDashboard['recentSubscriptionEmails'],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
