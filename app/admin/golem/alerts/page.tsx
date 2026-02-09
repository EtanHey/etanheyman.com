'use client';

import { useEffect, useState } from 'react';
import {
  getEvents,
  getScrapeActivity,
  getQualityStats,
  type GolemEvent,
  type ScrapeActivity,
  type QualityStats,
} from '../actions/data';
import {
  Activity,
  RefreshCw,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Building2,
} from 'lucide-react';
import { actorBgColors, eventTypeLabels, sourceConfig } from '../lib/constants';
import { formatRelativeTime } from '../lib/format';
import { PageHeader } from '../components';

type Tab = 'scrapes' | 'events' | 'quality';

function getEventDetail(event: GolemEvent): string {
  const d = event.data;
  if (d.subject) return String(d.subject);
  if (d.company && d.role) return `${d.company} — ${d.role}`;
  if (d.company) return String(d.company);
  if (d.reason) return String(d.reason);
  if (d.title) return String(d.title);
  if (d.count) return `${d.count} items`;
  return '';
}

// ─── Scrape Activity Tab ────────────────────────────

function ScrapeActivityTab() {
  const [runs, setRuns] = useState<ScrapeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSource, setFilterSource] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    getScrapeActivity(100).then(({ data }) => {
      setRuns(data);
      setLoading(false);
    });
  }, []);

  const sources = ['all', ...new Set(runs.map((r) => r.source))];
  const filtered = filterSource === 'all' ? runs : runs.filter((r) => r.source === filterSource);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No scrape runs recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Source filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">Source:</span>
        {sources.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterSource(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterSource === s
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {s === 'all' ? 'All' : (sourceConfig[s]?.label || s)}
          </button>
        ))}
      </div>

      {/* Scrape run cards */}
      {filtered.map((run) => {
        const srcCfg = sourceConfig[run.source];
        const hasErrors = run.errors > 0;
        const successRate = run.total_found > 0
          ? Math.round(((run.new_saved + run.duplicates_skipped) / run.total_found) * 100)
          : 0;

        return (
          <div
            key={run.id}
            className={`rounded-xl border p-4 transition-all ${
              hasErrors
                ? 'border-red-500/20 bg-red-500/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${srcCfg?.color || 'text-white/70'}`}>
                  {srcCfg?.label || run.source}
                </span>
                {hasErrors && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                {run.duration_ms != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(run.duration_ms / 1000).toFixed(1)}s
                  </span>
                )}
                <span>{formatRelativeTime(run.run_at)}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-white/30" />
                <div>
                  <div className="text-sm font-bold text-white">{run.total_found}</div>
                  <div className="text-[10px] text-white/40">Found</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <div>
                  <div className="text-sm font-bold text-emerald-400">{run.new_saved}</div>
                  <div className="text-[10px] text-white/40">New Saved</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-white/30" />
                <div>
                  <div className="text-sm font-bold text-white/60">{run.duplicates_skipped}</div>
                  <div className="text-[10px] text-white/40">Duplicates</div>
                </div>
              </div>
              {hasErrors && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-400" />
                  <div>
                    <div className="text-sm font-bold text-red-400">{run.errors}</div>
                    <div className="text-[10px] text-white/40">Errors</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quality indicators */}
            <div className="flex items-center gap-3 text-xs text-white/40 pt-2 border-t border-white/5">
              {run.no_description_count > 0 && (
                <span className="text-amber-400">{run.no_description_count} missing desc</span>
              )}
              {run.id_like_title_count > 0 && (
                <span className="text-amber-400">{run.id_like_title_count} ID-like titles</span>
              )}
              {run.no_company_count > 0 && (
                <span className="text-amber-400">{run.no_company_count} no company</span>
              )}
              {run.avg_description_length != null && (
                <span>avg desc: {Math.round(run.avg_description_length)} chars</span>
              )}
              <span className="ml-auto">{successRate}% processed</span>
            </div>

            {run.notes && (
              <p className="text-xs text-white/40 mt-2 italic">{run.notes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Event Log Tab ──────────────────────────────────

function EventLogTab() {
  const [events, setEvents] = useState<GolemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActor, setFilterActor] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    getEvents(100).then(({ events: data }) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const actors = ['all', ...new Set(events.map((e) => e.actor))];
  const filtered = filterActor === 'all' ? events : events.filter((e) => e.actor === filterActor);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Actor filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">Actor:</span>
        <select
          value={filterActor}
          onChange={(e) => setFilterActor(e.target.value)}
          aria-label="Filter by actor"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:outline-none"
        >
          {actors.map((a) => (
            <option key={a} value={a}>{a === 'all' ? 'All Golems' : a}</option>
          ))}
        </select>
        <span className="text-xs text-white/40 ml-auto">{filtered.length} events</span>
      </div>

      {/* Event table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No events recorded yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Actor</th>
                <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Details</th>
                <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const colors = actorBgColors[event.actor] || { bg: 'bg-white/10', text: 'text-white/60' };
                const detail = getEventDetail(event);
                return (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3">
                      <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                        {event.actor.replace('golem', '')}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-white/70">
                      {eventTypeLabels[event.type] || event.type}
                      {'score' in event.data && event.data.score != null && (
                        <span className={`ml-2 text-xs font-medium ${
                          Number(event.data.score) >= 8 ? 'text-red-400' :
                          Number(event.data.score) >= 6 ? 'text-amber-400' :
                          'text-white/40'
                        }`}>
                          {String(event.data.score)}/10
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-white/50 max-w-[300px] truncate">
                      {detail}
                    </td>
                    <td className="py-2 px-3 text-right text-white/30 whitespace-nowrap">
                      {formatRelativeTime(event.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Quality Dashboard Tab ──────────────────────────

function QualityDashboardTab() {
  const [stats, setStats] = useState<QualityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getQualityStats().then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-white/50">
        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Could not load quality stats</p>
      </div>
    );
  }

  const completenessRate = stats.totalJobs > 0
    ? Math.round((stats.withDescription / stats.totalJobs) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <div className="text-lg font-bold text-white">{stats.totalJobs}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">Total Jobs</div>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">{completenessRate}%</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">Have Description</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
          <div className="text-lg font-bold text-white">{stats.avgDescriptionLength}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">Avg Desc Length</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{stats.withoutDescription}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">No Description</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{stats.idLikeTitleCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">ID-like Titles</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{stats.noCompanyCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">Missing Company</div>
        </div>
      </div>

      {/* Source comparison table */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-4">
          <Building2 className="h-4 w-4 text-violet-400" />
          Source Quality Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Source</th>
                <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Jobs</th>
                <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">With Desc</th>
                <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Desc %</th>
                <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Avg Desc Len</th>
                <th className="text-right py-2 px-3 text-xs text-white/50 uppercase tracking-wider">No Company</th>
              </tr>
            </thead>
            <tbody>
              {stats.bySource.map((s) => {
                const pct = s.total > 0 ? Math.round((s.withDescription / s.total) * 100) : 0;
                const srcCfg = sourceConfig[s.source];
                return (
                  <tr key={s.source} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3">
                      <span className={srcCfg?.color || 'text-white/70'}>
                        {srcCfg?.label || s.source}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-white/60 tabular-nums">{s.total}</td>
                    <td className="py-2 px-3 text-right text-white/60 tabular-nums">{s.withDescription}</td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      <span className={pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}>
                        {pct}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-white/60 tabular-nums">{s.avgDescLength}</td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      <span className={s.noCompanyCount > 0 ? 'text-amber-400' : 'text-white/60'}>
                        {s.noCompanyCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('scrapes');

  const tabs: { key: Tab; label: string; icon: typeof Activity }[] = [
    { key: 'scrapes', label: 'Scrape Activity', icon: Database },
    { key: 'events', label: 'Event Log', icon: Activity },
    { key: 'quality', label: 'Quality', icon: BarChart3 },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        icon={Activity}
        iconColor="text-violet-400"
        title="Activity Log"
      />

      {/* Tabs */}
      <div className="shrink-0 flex items-center gap-1 pb-4 border-b border-white/10 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'scrapes' && <ScrapeActivityTab />}
        {activeTab === 'events' && <EventLogTab />}
        {activeTab === 'quality' && <QualityDashboardTab />}
      </div>
    </div>
  );
}
