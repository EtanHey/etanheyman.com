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

export interface MonitorDashboard {
  serviceStatuses: Array<{
    service: string;
    lastRun: string | null;
    duration_ms: number | null;
    status: string;
  }>;
  recentEvents: Array<{
    id: string;
    actor: string;
    type: string;
    data: Record<string, unknown>;
    created_at: string;
  }>;
  eventsByActor: Array<{ actor: string; count: number }>;
  llmUsage: {
    totalCalls: number;
    totalCost: number;
    byModel: Array<{ model: string; calls: number; cost: number }>;
    last7dCost: number;
  };
}

function isRecent(date: string | null, hours: number): boolean {
  if (!date) return false;
  const diffMs = Date.now() - new Date(date).getTime();
  return diffMs <= hours * 60 * 60 * 1000;
}

export async function getMonitorDashboard(): Promise<{ data: MonitorDashboard | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const [runsRes, eventsRes, usageRes] = await Promise.all([
      supabase
        .from('service_runs')
        .select('service, started_at, ended_at, duration_ms, status')
        .order('started_at', { ascending: false })
        .limit(200),
      supabase
        .from('golem_events')
        .select('id, actor, type, data, created_at')
        .gte('created_at', fortyEightHoursAgo)
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('llm_usage')
        .select('model, cost_usd, created_at')
        .order('created_at', { ascending: false })
        .limit(1000),
    ]);

    const errors = [runsRes.error, eventsRes.error, usageRes.error]
      .filter(Boolean)
      .map((err) => err!.message);
    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    const latestByService = new Map<string, {
      service: string;
      lastRun: string | null;
      duration_ms: number | null;
      status: string;
    }>();
    for (const row of (runsRes.data || []) as any[]) {
      const service = row.service as string;
      if (latestByService.has(service)) continue;
      latestByService.set(service, {
        service,
        lastRun: row.ended_at || row.started_at || null,
        duration_ms: row.duration_ms ?? null,
        status: row.status || 'unknown',
      });
    }

    const recentEvents = (eventsRes.data || []) as MonitorDashboard['recentEvents'];
    const actorCountMap = new Map<string, number>();
    for (const event of recentEvents) {
      actorCountMap.set(event.actor, (actorCountMap.get(event.actor) || 0) + 1);
    }
    const eventsByActor = Array.from(actorCountMap.entries())
      .map(([actor, count]) => ({ actor, count }))
      .sort((a, b) => b.count - a.count);

    const usageRows = (usageRes.data || []) as Array<{
      model: string | null;
      cost_usd: number | null;
      created_at: string | null;
    }>;
    const byModelMap = new Map<string, { calls: number; cost: number }>();
    let totalCalls = 0;
    let totalCost = 0;
    let last7dCost = 0;
    for (const row of usageRows) {
      totalCalls += 1;
      const cost = row.cost_usd || 0;
      totalCost += cost;
      if (isRecent(row.created_at, 24 * 7)) {
        last7dCost += cost;
      }
      const model = row.model || 'unknown';
      const entry = byModelMap.get(model) || { calls: 0, cost: 0 };
      entry.calls += 1;
      entry.cost += cost;
      byModelMap.set(model, entry);
    }
    const byModel = Array.from(byModelMap.entries())
      .map(([model, values]) => ({ model, calls: values.calls, cost: values.cost }))
      .sort((a, b) => b.cost - a.cost);

    return {
      data: {
        serviceStatuses: Array.from(latestByService.values()),
        recentEvents,
        eventsByActor,
        llmUsage: {
          totalCalls,
          totalCost,
          byModel,
          last7dCost,
        },
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
