'use client';

import { useEffect, useState } from 'react';
import { getGolemOverviewStats, getOverviewStats, type GolemOverviewStats, type OverviewStats } from './actions/data';
import {
  Activity,
  Mail,
  Briefcase,
  Server,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
  Zap,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { actorColors, eventTypeLabels, golemCardBorders } from './lib/constants';
import { formatRelativeTime } from './lib/format';
import { GolemCard } from './components';

export default function GolemOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [golemStats, setGolemStats] = useState<GolemOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    const [overviewRes, golemRes] = await Promise.all([getOverviewStats(), getGolemOverviewStats()]);
    const errorMessage = [overviewRes.error, golemRes.error].filter(Boolean).join('; ');
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError(null);
      setStats(overviewRes.data);
      setGolemStats(golemRes.data);
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  if (loading && (!stats || !golemStats)) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error && (!stats || !golemStats)) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>Failed to load dashboard: {error}</p>
      </div>
    );
  }

  if (!stats || !golemStats) return null;

  const railwayUp = stats.railwayHealth?.status === 'ok';
  const maxEmailCategoryCount = Math.max(...stats.emailsByCategory.map(c => c.count), 1);

  return (
    <div className="h-full overflow-y-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Search Command Center</h1>
          <p className="text-sm text-white/50 mt-1">AI-powered job search pipeline</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Railway Status Banner */}
      <div className={`flex items-center gap-3 rounded-xl border p-4 ${
        railwayUp
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-red-500/30 bg-red-500/10'
      }`}>
        {railwayUp ? (
          <Wifi className="h-5 w-5 text-emerald-400 shrink-0" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-400 shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${railwayUp ? 'text-emerald-300' : 'text-red-300'}`}>
              Railway Cloud Worker
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              railwayUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {railwayUp ? 'Online' : 'Offline'}
            </span>
          </div>
          {railwayUp && stats.railwayHealth && (
            <p className="text-xs text-white/50 mt-0.5">
              Uptime: {Math.round((stats.railwayHealth.uptime || 0) / 60)}m
              {stats.railwayHealth.golemStatus && ` | Golems: ${stats.railwayHealth.golemStatus}`}
            </p>
          )}
        </div>
        <Server className="h-4 w-4 text-white/30" />
      </div>

      {/* Golem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GolemCard
          icon={Briefcase}
          title="RecruiterGolem"
          href="/admin/golem/recruiter"
          borderColor={golemCardBorders.recruiter}
          metrics={[
            { label: 'new jobs to review', value: golemStats.recruiter.newJobs },
            { label: 'applications out', value: golemStats.recruiter.appliedJobs },
          ]}
        />
        <GolemCard
          icon={DollarSign}
          title="TellerGolem"
          href="/admin/golem/teller"
          borderColor={golemCardBorders.teller}
          metrics={[
            { label: 'subscriptions / mo', value: `$${golemStats.teller.monthlyTotal.toFixed(2)}` },
            { label: 'payment alerts', value: golemStats.teller.paymentAlerts },
          ]}
        />
        <GolemCard
          icon={Activity}
          title="MonitorGolem"
          href="/admin/golem/monitor"
          borderColor={golemCardBorders.monitor}
          metrics={[
            { label: 'services green', value: `${golemStats.monitor.servicesGreen}/${golemStats.monitor.totalServices}` },
            { label: 'LLM spent', value: `$${golemStats.monitor.llmSpend.toFixed(2)}` },
          ]}
        />
      </div>

      {/* Two Column: Activity Feed + Email Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-400" />
              Recent Activity
            </h2>
            <Link href="/admin/golem/alerts" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentEvents.length === 0 ? (
              <p className="text-sm text-white/40 py-4 text-center">No events yet</p>
            ) : (
              stats.recentEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 group">
                  <div className="mt-1 h-2 w-2 rounded-full bg-white/20 group-hover:bg-white/40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${actorColors[event.actor] || 'text-white/60'}`}>
                        {event.actor}
                      </span>
                      <span className="text-xs text-white/30">
                        {eventTypeLabels[event.type] || event.type}
                      </span>
                    </div>
                    {event.data && (
                      <p className="text-xs text-white/50 mt-0.5 truncate">
                        {event.data.subject
                          ? String(event.data.subject).slice(0, 80)
                          : event.data.company
                            ? `${event.data.company} — ${event.data.role || 'role'}`
                            : event.data.reason
                              ? String(event.data.reason).slice(0, 80)
                              : JSON.stringify(event.data).slice(0, 80)}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-white/30 whitespace-nowrap shrink-0">
                    {formatRelativeTime(event.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Category Breakdown */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              Email Categories
            </h2>
            <Link href="/admin/golem/emails" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {stats.emailsByCategory.map((cat) => {
              const pct = (cat.count / maxEmailCategoryCount) * 100;
              return (
                <div key={cat.category} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/70 capitalize">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 tabular-nums">{cat.count} emails</span>
                      <span className={`font-medium tabular-nums ${
                        cat.avg_score >= 7 ? 'text-emerald-400' :
                        cat.avg_score >= 4 ? 'text-amber-400' :
                        'text-white/40'
                      }`}>
                        {cat.avg_score}
                        <span className="text-white/20">/10</span>
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cat.avg_score >= 7 ? 'bg-emerald-500/60' :
                        cat.avg_score >= 4 ? 'bg-amber-500/60' :
                        'bg-white/20'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
