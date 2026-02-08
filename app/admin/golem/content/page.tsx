'use client';

import { useEffect, useState } from 'react';
import { getGolemState, getEvents, type GolemState, type GolemEvent } from '../actions/data';
import { FileText, RefreshCw, PenTool, ThumbsUp, ThumbsDown, BarChart3, Hash } from 'lucide-react';
import { formatRelativeTime } from '../lib/format';
import { PageHeader } from '../components';

const contentEventTypes = new Set([
  'soltome_post', 'draft_approved', 'draft_rejected',
  'draft_scored', 'pattern_extracted',
]);

const eventIcons: Record<string, { icon: typeof FileText; color: string }> = {
  soltome_post: { icon: PenTool, color: 'text-emerald-400' },
  draft_approved: { icon: ThumbsUp, color: 'text-green-400' },
  draft_rejected: { icon: ThumbsDown, color: 'text-red-400' },
  draft_scored: { icon: BarChart3, color: 'text-amber-400' },
  pattern_extracted: { icon: Hash, color: 'text-violet-400' },
};

export default function ContentPage() {
  const [state, setState] = useState<GolemState[]>([]);
  const [contentEvents, setContentEvents] = useState<GolemEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const [stateRes, eventsRes] = await Promise.all([
      getGolemState(),
      getEvents(100),
    ]);
    if (!stateRes.error) setState(stateRes.state);
    if (!eventsRes.error) setContentEvents(eventsRes.events.filter((e) => contentEventTypes.has(e.type)));
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const getStateValue = (key: string): unknown => {
    const item = state.find((s) => s.key === key);
    return item?.value;
  };

  const pendingDrafts = (getStateValue('pendingDraftIds') as string[]) || [];
  const topics = (getStateValue('topics') as Record<string, unknown>) || {};
  const topicKeys = Object.keys(topics);

  const postsCount = contentEvents.filter((e) => e.type === 'soltome_post' || e.type === 'content_post').length;
  const approvedCount = contentEvents.filter((e) => e.type === 'draft_approved').length;
  const rejectedCount = contentEvents.filter((e) => e.type === 'draft_rejected').length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        icon={FileText}
        iconColor="text-violet-400"
        title="Content Pipeline"
        onRefresh={refresh}
        loading={loading}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="text-xs text-white/50 mb-1">Posts Published</div>
              <div className="text-2xl font-bold text-emerald-400">{postsCount}</div>
            </div>
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="text-xs text-white/50 mb-1">Drafts Approved</div>
              <div className="text-2xl font-bold text-green-400">{approvedCount}</div>
            </div>
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="text-xs text-white/50 mb-1">Drafts Rejected</div>
              <div className="text-2xl font-bold text-red-400">{rejectedCount}</div>
            </div>
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="text-xs text-white/50 mb-1">Pending Drafts</div>
              <div className="text-2xl font-bold text-amber-400">{pendingDrafts.length}</div>
            </div>
          </div>

          {/* Topics */}
          {topicKeys.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Content Topics ({topicKeys.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {topicKeys.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-full px-3 py-1"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content Activity */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white/60 mb-3">
              Content Activity ({contentEvents.length})
            </h3>
            {contentEvents.length === 0 ? (
              <p className="text-sm text-white/40 py-4">No content activity recorded</p>
            ) : (
              <div className="space-y-2">
                {contentEvents.map((event) => {
                  const config = eventIcons[event.type] || { icon: FileText, color: 'text-white/60' };
                  const Icon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/80">
                            {event.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">
                            {event.actor}
                          </span>
                        </div>
                        {'title' in event.data && event.data.title != null && (
                          <p className="text-xs text-white/50 mt-0.5 truncate">
                            {String(event.data.title)}
                          </p>
                        )}
                        {'count' in event.data && event.data.count != null && (
                          <p className="text-xs text-white/50 mt-0.5">
                            {String(event.data.count)} items
                          </p>
                        )}
                        {'reason' in event.data && event.data.reason != null && (
                          <p className="text-xs text-red-400/60 mt-0.5 truncate">
                            {String(event.data.reason)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-white/30 shrink-0">
                        {formatRelativeTime(event.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
