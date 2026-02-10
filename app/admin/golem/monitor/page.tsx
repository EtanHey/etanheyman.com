'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Cpu, Loader2 } from 'lucide-react';
import { getMonitorDashboard, type MonitorDashboard } from '../actions/monitor';
import { PageHeader, ServiceStatus } from '../components';
import { actorColors, eventTypeLabels } from '../lib/constants';
import { formatRelativeTime } from '../lib/format';

const serviceConfig = [
  { key: 'email-golem', label: 'email-golem', expectedIntervalHours: 1 },
  { key: 'job-golem', label: 'job-golem', expectedIntervalHours: 8 },
  { key: 'briefing', label: 'briefing', expectedIntervalHours: 24 },
  { key: 'nightshift', label: 'nightshift', expectedIntervalHours: 24 },
  { key: 'telegram', label: 'telegram', expectedIntervalHours: 24 },
  { key: 'bedtime-guardian', label: 'bedtime-guardian', expectedIntervalHours: 24 },
];

function normalizeService(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function getEventDetail(event: MonitorDashboard['recentEvents'][number]): string {
  const data = event.data;
  if (data.subject) return String(data.subject);
  if (data.company && data.role) return `${data.company} — ${data.role}`;
  if (data.company) return String(data.company);
  if (data.reason) return String(data.reason);
  if (data.title) return String(data.title);
  if (data.count) return `${data.count} items`;
  return '';
}

export default function MonitorPage() {
  const [dashboard, setDashboard] = useState<MonitorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorFilter, setActorFilter] = useState<string>('all');

  const refresh = async () => {
    setLoading(true);
    const { data, error: err } = await getMonitorDashboard();
    if (err) {
      setError(err);
    } else {
      setError(null);
      setDashboard(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const serviceMap = useMemo(() => {
    const map = new Map<string, MonitorDashboard['serviceStatuses'][number]>();
    dashboard?.serviceStatuses.forEach((svc) => {
      map.set(normalizeService(svc.service), svc);
    });
    return map;
  }, [dashboard?.serviceStatuses]);

  const actorGroups = useMemo(() => {
    const grouped = new Map<string, MonitorDashboard['recentEvents']>();
    dashboard?.recentEvents.forEach((event) => {
      const list = grouped.get(event.actor) || [];
      list.push(event);
      grouped.set(event.actor, list);
    });
    return grouped;
  }, [dashboard?.recentEvents]);

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>Failed to load monitor dashboard: {error}</p>
      </div>
    );
  }

  if (!dashboard) return null;

  const orderedActors = dashboard.eventsByActor.length > 0
    ? dashboard.eventsByActor.map((item) => item.actor)
    : Array.from(actorGroups.keys());

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        icon={Activity}
        iconColor="text-violet-400"
        title="MonitorGolem"
        onRefresh={refresh}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto space-y-6 pb-8">
        {/* Section A: Service Status */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceConfig.map((config) => {
              const svc = serviceMap.get(normalizeService(config.key));
              return (
                <ServiceStatus
                  key={config.key}
                  name={config.label}
                  lastRun={svc?.lastRun ?? null}
                  duration={svc?.duration_ms ?? null}
                  status={svc?.status || 'unknown'}
                  expectedIntervalHours={config.expectedIntervalHours}
                />
              );
            })}
          </div>
        </div>

        {/* Section B: Recent Activity */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80">Recent Activity (48h)</h2>

          {/* Actor filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActorFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                actorFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              All ({dashboard.recentEvents.length})
            </button>
            {orderedActors.map((actor) => {
              const count = (actorGroups.get(actor) || []).length;
              if (count === 0) return null;
              return (
                <button
                  key={actor}
                  type="button"
                  onClick={() => setActorFilter(actor)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    actorFilter === actor
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {actor} ({count})
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
            {dashboard.recentEvents.length === 0 ? (
              <p className="text-sm text-white/50 text-center py-6">No recent events</p>
            ) : (
              (actorFilter === 'all' ? dashboard.recentEvents : (actorGroups.get(actorFilter) || [])).map((event) => (
                <div key={event.id} className="flex items-start gap-3 text-xs text-white/60">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/20" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold uppercase tracking-wider text-[10px] ${actorColors[event.actor] || 'text-white/60'}`}>
                        {event.actor}
                      </span>
                      <span className="text-white/70">
                        {eventTypeLabels[event.type] || event.type}
                      </span>
                      <span className="text-white/30 truncate">
                        {getEventDetail(event)}
                      </span>
                    </div>
                  </div>
                  <span className="text-white/30 whitespace-nowrap">
                    {formatRelativeTime(event.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section C: LLM Usage */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            LLM Usage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-xl font-bold text-white">${dashboard.llmUsage.totalCost.toFixed(4)}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">Total Cost</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-xl font-bold text-white">{dashboard.llmUsage.totalCalls}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">Total Calls</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-xl font-bold text-white">${dashboard.llmUsage.last7dCost.toFixed(4)}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">Last 7 Days</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Model</th>
                  <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Calls</th>
                  <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.llmUsage.byModel.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-white/50">
                      No LLM usage data
                    </td>
                  </tr>
                ) : (
                  dashboard.llmUsage.byModel.map((row) => (
                    <tr key={row.model} className="border-b border-white/5">
                      <td className="py-2 px-3 text-white/70">{row.model}</td>
                      <td className="py-2 px-3 text-right text-white/60 tabular-nums">{row.calls}</td>
                      <td className="py-2 px-3 text-right text-white/60 tabular-nums">${row.cost.toFixed(4)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
