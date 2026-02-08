'use client';

import { useEffect, useState } from 'react';
import { getEvents, type GolemEvent } from '../actions/data';
import { Activity, RefreshCw, Filter } from 'lucide-react';

const actorColors: Record<string, { bg: string; text: string }> = {
  emailgolem: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  jobgolem: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  claudegolem: { bg: 'bg-violet-500/20', text: 'text-violet-400' },
  recruitergolem: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  ollamagolem: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  nightshift: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
};

const eventLabels: Record<string, string> = {
  email_routed: 'Routed email',
  job_match: 'Found job match',
  soltome_post: 'Content post',
  draft_approved: 'Approved draft',
  draft_rejected: 'Rejected draft',
  draft_scored: 'Scored drafts',
  pattern_extracted: 'Extracted patterns',
  email_alert: 'Email alert',
  nightshift_pr: 'Created PR',
  outreach_draft: 'Drafted outreach',
  contact_found: 'Found contact',
};

function formatTime(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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

export default function AlertsPage() {
  const [events, setEvents] = useState<GolemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActor, setFilterActor] = useState<string>('all');

  const refresh = async () => {
    setLoading(true);
    const { events: data, error } = await getEvents(100);
    if (!error) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const actors = ['all', ...new Set(events.map((e) => e.actor))];
  const filtered = filterActor === 'all' ? events : events.filter((e) => e.actor === filterActor);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-4">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-violet-400" />
          Activity Log
          <span className="text-sm font-normal text-white/40">({filtered.length})</span>
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            aria-label="Filter by actor"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            {actors.map((a) => (
              <option key={a} value={a}>{a === 'all' ? 'All Golems' : a}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No events recorded yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((event) => {
              const colors = actorColors[event.actor] || { bg: 'bg-white/10', text: 'text-white/60' };
              const detail = getEventDetail(event);

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 rounded-lg p-3 hover:bg-white/5 transition-colors group"
                >
                  {/* Actor badge */}
                  <div className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                    {event.actor.replace('golem', '')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80">
                        {eventLabels[event.type] || event.type}
                      </span>
                      {'score' in event.data && event.data.score != null && (
                        <span className={`text-xs font-medium ${
                          Number(event.data.score) >= 8 ? 'text-red-400' :
                          Number(event.data.score) >= 6 ? 'text-amber-400' :
                          'text-white/40'
                        }`}>
                          {String(event.data.score)}/10
                        </span>
                      )}
                    </div>
                    {detail && (
                      <p className="text-xs text-white/50 mt-0.5 truncate">{detail}</p>
                    )}
                    {'targetGolem' in event.data && event.data.targetGolem != null && (
                      <span className="inline-flex mt-1 text-[10px] text-white/40 bg-white/5 rounded px-1.5 py-0.5">
                        → {String(event.data.targetGolem)}
                      </span>
                    )}
                  </div>

                  {/* Time */}
                  <span className="shrink-0 text-xs text-white/30 whitespace-nowrap">
                    {formatTime(event.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
