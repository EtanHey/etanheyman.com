'use client';

import { useEffect, useState } from 'react';
import { getGolemState, getEvents, type GolemState, type GolemEvent } from '../actions/data';
import { Moon, RefreshCw, GitPullRequest, Clock, Target, Calendar } from 'lucide-react';

function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

const rotationDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const defaultRotation = [
  { day: 'Mon', repo: 'songscript' },
  { day: 'Tue', repo: 'zikaron' },
  { day: 'Wed', repo: 'claude-golem' },
  { day: 'Thu', repo: 'songscript' },
  { day: 'Fri', repo: 'zikaron' },
  { day: 'Sat', repo: 'claude-golem' },
  { day: 'Sun', repo: 'claude-golem' },
];

export default function NightShiftPage() {
  const [state, setState] = useState<GolemState[]>([]);
  const [nightEvents, setNightEvents] = useState<GolemEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const [stateRes, eventsRes] = await Promise.all([
      getGolemState(),
      getEvents(100),
    ]);
    setState(stateRes.state);
    setNightEvents(eventsRes.events.filter((e) => e.actor === 'nightshift'));
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const getStateValue = (key: string): unknown => {
    const item = state.find((s) => s.key === key);
    return item?.value;
  };

  const target = getStateValue('nightShiftTarget') as string | undefined;
  const lastRun = getStateValue('lastNightShift') as string | undefined;
  const prs = (getStateValue('nightShiftPRs') as Array<{ url: string; repo: string; createdAt: string }>) || [];
  const rotation = (getStateValue('rotation') as string[]) || ['songscript', 'zikaron', 'claude-golem'];

  const todayIdx = new Date().getDay();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-4">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-400" />
          Night Shift
        </h1>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Target */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <Target className="h-3.5 w-3.5" />
                Current Target
              </div>
              <p className="text-lg font-semibold text-white">
                {target || 'Not set'}
              </p>
            </div>

            {/* Last Run */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <Clock className="h-3.5 w-3.5" />
                Last Run
              </div>
              <p className="text-lg font-semibold text-white">
                {lastRun ? formatDate(lastRun as string) : 'Never'}
              </p>
            </div>

            {/* PRs Created */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <GitPullRequest className="h-3.5 w-3.5" />
                Pending PRs
              </div>
              <p className="text-lg font-semibold text-white">
                {prs.length}
              </p>
            </div>
          </div>

          {/* Rotation Schedule */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white/60 flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4" />
              Weekly Rotation
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {defaultRotation.map((item, idx) => {
                const dayIdx = rotationDays.indexOf(item.day);
                const isToday = dayIdx === todayIdx;
                return (
                  <div
                    key={item.day}
                    className={`text-center rounded-lg p-2 border ${
                      isToday
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                        : 'bg-white/[0.02] border-white/5 text-white/40'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
                      {item.day}
                    </div>
                    <div className={`text-xs ${isToday ? 'text-white' : 'text-white/60'}`}>
                      {item.repo}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending PRs */}
          {prs.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-sm font-medium text-white/60 flex items-center gap-2 mb-3">
                <GitPullRequest className="h-4 w-4" />
                Night Shift PRs
              </h3>
              <div className="space-y-2">
                {prs.map((pr, idx) => (
                  <a
                    key={idx}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-white">{pr.repo}</span>
                    </div>
                    <span className="text-xs text-white/30">
                      {pr.createdAt ? formatDate(pr.createdAt) : ''}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Night Shift Activity */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white/60 flex items-center gap-2 mb-3">
              <Moon className="h-4 w-4" />
              Recent Activity ({nightEvents.length})
            </h3>
            {nightEvents.length === 0 ? (
              <p className="text-sm text-white/40 py-4">No night shift activity recorded</p>
            ) : (
              <div className="space-y-2">
                {nightEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                  >
                    <div>
                      <span className="text-sm text-white/80">{event.type.replace(/_/g, ' ')}</span>
                      {'repo' in event.data && event.data.repo != null && (
                        <span className="text-xs text-white/40 ml-2">{String(event.data.repo)}</span>
                      )}
                      {'prNumber' in event.data && event.data.prNumber != null && (
                        <span className="text-xs text-emerald-400 ml-2">#{String(event.data.prNumber)}</span>
                      )}
                    </div>
                    <span className="text-xs text-white/30">{formatDate(event.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Golem State Keys */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white/60 mb-3">All State Keys</h3>
            <div className="space-y-1">
              {state.map((s) => (
                <div
                  key={s.key}
                  className="flex items-start justify-between gap-4 p-2 rounded hover:bg-white/5 text-xs"
                >
                  <code className="text-white/70 font-mono shrink-0">{s.key}</code>
                  <span className="text-white/40 truncate max-w-[300px] text-right">
                    {typeof s.value === 'string'
                      ? s.value
                      : JSON.stringify(s.value).slice(0, 80)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
