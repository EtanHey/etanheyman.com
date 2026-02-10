'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  ExternalLink,
  Sparkles,
  Clock,
  Users,
  ChevronDown,
  Loader2,
  X,
  Bookmark,
  Send,
  Archive,
  RotateCcw,
  Check,
} from 'lucide-react';
import { getRecruiterDashboard, getRecruiterJobs, type RecruiterDashboard, type RecruiterJob } from '../actions/recruiter';
import { correctJobScore, updateJobStatus } from '../actions/data';
import { ActionItem, PageHeader, ScoreEditor } from '../components';
import { formatRelativeTime } from '../lib/format';
import { sourceConfig, statusConfig, type JobStatus } from '../lib/constants';

function cleanDescription(html: string | null): string {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013');
  return text.replace(/\s+/g, ' ').trim();
}

function isHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as JobStatus] || {
    label: status,
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: Briefcase,
  };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// --- Action Buttons by Status ---
function getStatusActions(status: string): Array<{ targetStatus: JobStatus; label: string; icon: typeof Bookmark; color: string }> {
  switch (status) {
    case 'new':
    case 'viewed':
      return [
        { targetStatus: 'saved', label: 'Save', icon: Bookmark, color: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' },
        { targetStatus: 'applied', label: 'Applied', icon: Send, color: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' },
        { targetStatus: 'archived', label: 'Not a fit', icon: Archive, color: 'border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/10' },
      ];
    case 'saved':
      return [
        { targetStatus: 'applied', label: 'Applied', icon: Send, color: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' },
        { targetStatus: 'archived', label: 'Not a fit', icon: Archive, color: 'border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/10' },
      ];
    case 'applied':
      return [
        { targetStatus: 'archived', label: 'Archive', icon: Archive, color: 'border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/10' },
      ];
    case 'archived':
      return [
        { targetStatus: 'new', label: 'Restore', icon: RotateCcw, color: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' },
      ];
    default:
      return [];
  }
}

// --- Dismissed action items (daily reset) ---
function getDismissedItems(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem('recruiter-action-items-dismissed');
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (parsed.date !== today) return new Set();
    return new Set(parsed.items || []);
  } catch {
    return new Set();
  }
}

function setDismissedItems(items: Set<string>) {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('recruiter-action-items-dismissed', JSON.stringify({ date: today, items: Array.from(items) }));
}

export default function RecruiterPage() {
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<JobStatus | 'all'>('all');
  const [highScoreOnly, setHighScoreOnly] = useState(false);
  const [modalJobId, setModalJobId] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Load dismissed state from localStorage on mount
  useEffect(() => {
    setDismissed(getDismissedItems());
  }, []);

  const refresh = async () => {
    setLoading(true);
    const [dashboardRes, jobsRes] = await Promise.all([
      getRecruiterDashboard(),
      getRecruiterJobs(),
    ]);
    const errorMessage = [dashboardRes.error, jobsRes.error].filter(Boolean).join('; ');
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError(null);
      setDashboard(dashboardRes.data);
      setJobs(jobsRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleStatusChange = useCallback(async (jobId: string, newStatus: string) => {
    const { success } = await updateJobStatus(jobId, newStatus);
    if (success) {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));
    }
  }, []);

  const openModal = useCallback(async (jobId: string) => {
    setModalJobId(jobId);
    // Auto-mark as viewed if currently "new"
    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status === 'new') {
      handleStatusChange(jobId, 'viewed');
    }
  }, [jobs, handleStatusChange]);

  const toggleDismiss = useCallback((key: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      setDismissedItems(next);
      return next;
    });
  }, []);

  const statusCounts = dashboard?.jobsByStatus.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = item.count;
    return acc;
  }, {}) ?? {};

  // "All" excludes applied + archived
  const activeCount = (dashboard?.totalJobs || 0) - (statusCounts.applied || 0) - (statusCounts.archived || 0);

  const filteredJobs = useMemo(() => {
    let result: RecruiterJob[];
    if (activeStatus === 'all') {
      result = jobs.filter((job) => job.status !== 'applied' && job.status !== 'archived');
    } else {
      result = jobs.filter((job) => job.status === activeStatus);
    }
    if (highScoreOnly) {
      result = result.filter((job) => {
        const score = job.human_match_score ?? job.match_score;
        return score !== null && score >= 8;
      });
    }
    return result;
  }, [jobs, activeStatus, highScoreOnly]);

  const modalJob = modalJobId ? jobs.find((j) => j.id === modalJobId) : null;

  // Connections matching the modal job's company
  const modalConnections = useMemo(() => {
    if (!modalJob || !dashboard) return [];
    const jobCompany = (modalJob.company || '').toLowerCase();
    if (!jobCompany) return [];
    return dashboard.connectionMatches.filter((conn) => {
      const connCompany = (conn.company || '').toLowerCase();
      return connCompany && (connCompany.includes(jobCompany) || jobCompany.includes(connCompany));
    });
  }, [modalJob, dashboard]);

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
        <p>Failed to load recruiter dashboard: {error}</p>
      </div>
    );
  }

  if (!dashboard) return null;

  const firstConnection = dashboard.connectionMatches[0];
  const connectionDesc = firstConnection
    ? `${firstConnection.connectionName} at ${firstConnection.company || 'their company'}${dashboard.connectionMatches.length > 1 ? ` (+${dashboard.connectionMatches.length - 1} more)` : ''}`
    : 'No connection matches found yet.';

  const actionItems = [
    {
      key: 'high-score',
      title: `Review ${dashboard.newHighScoreJobs} high-score jobs`,
      description: dashboard.newHighScoreJobs > 0
        ? 'New jobs scored 8+ are waiting for review.'
        : 'No new high-score jobs right now.',
      priority: dashboard.newHighScoreJobs > 0 ? 'urgent' : 'info',
      icon: <Sparkles className="h-4 w-4" />,
      actionLabel: dashboard.newHighScoreJobs > 0 ? 'Show high-score jobs' : undefined,
      onAction: dashboard.newHighScoreJobs > 0 ? () => { setActiveStatus('new'); setHighScoreOnly(true); } : undefined,
    },
    {
      key: 'stale-apps',
      title: `Follow up on ${dashboard.staleApplications} stale applications`,
      description: dashboard.staleApplications > 0
        ? 'Applications older than 3 days with no update.'
        : 'No stale applications at the moment.',
      priority: dashboard.staleApplications > 0 ? 'soon' : 'info',
      icon: <Clock className="h-4 w-4" />,
      actionLabel: dashboard.staleApplications > 0 ? 'Show applied jobs' : undefined,
      onAction: dashboard.staleApplications > 0 ? () => setActiveStatus('applied') : undefined,
    },
    {
      key: 'connections',
      title: `${dashboard.connectionMatches.length} connection matches`,
      description: connectionDesc,
      priority: 'info' as const,
      icon: <Users className="h-4 w-4" />,
      actionLabel: dashboard.connectionMatches.length > 0 ? 'View connections' : undefined,
      onAction: dashboard.connectionMatches.length > 0 ? () => setShowConnections(true) : undefined,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        icon={Briefcase}
        iconColor="text-emerald-400"
        title="RecruiterGolem"
        onRefresh={refresh}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto space-y-6 pb-8">
        {/* Section A: Action Items (checkable) */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80">Action Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {actionItems.map((item) => (
              <ActionItem
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                priority={item.priority as 'urgent' | 'soon' | 'info'}
                actionLabel={item.actionLabel}
                onAction={item.onAction}
                checked={dismissed.has(item.key)}
                onCheck={() => toggleDismiss(item.key)}
              />
            ))}
          </div>
        </div>

        {/* Section B: Jobs Pipeline */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80">Jobs Pipeline</h2>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'all', label: 'All', count: activeCount },
              { key: 'new', label: 'New', count: statusCounts.new || 0 },
              { key: 'viewed', label: 'Viewed', count: statusCounts.viewed || 0 },
              { key: 'saved', label: 'Saved', count: statusCounts.saved || 0 },
              { key: 'applied', label: 'Applied', count: statusCounts.applied || 0 },
              { key: 'archived', label: 'Archived', count: statusCounts.archived || 0 },
            ] as Array<{ key: JobStatus | 'all'; label: string; count: number }>).map((tab) => {
              const isActive = activeStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => { setActiveStatus(tab.key); setHighScoreOnly(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive && !highScoreOnly
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setHighScoreOnly((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                highScoreOnly
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <Sparkles className="h-3 w-3 inline mr-1" />
              Score 8+
            </button>
          </div>

          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No jobs in this pipeline stage</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const statusStyle = statusConfig[job.status as JobStatus] || statusConfig.new;
                const source = sourceConfig[job.source] || { label: job.source, color: 'text-white/60' };
                const effectiveScore = job.human_match_score ?? job.match_score;
                const cleanedDescription = cleanDescription(job.description);

                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => openModal(job.id)}
                    className={`w-full text-left rounded-lg border border-white/10 bg-white/5 p-4 border-l-4 ${statusStyle.cardBorder} hover:bg-white/8 transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                        <p className="text-xs text-white/60">{job.company}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mb-2">
                      <span className={source.color}>{source.label}</span>
                      <span>{formatRelativeTime(job.scraped_at)}</span>
                      {effectiveScore !== null && (
                        <span className={effectiveScore >= 8 ? 'text-red-400 font-semibold' : effectiveScore >= 6 ? 'text-amber-400' : 'text-white/40'}>
                          Score: {effectiveScore}
                        </span>
                      )}
                    </div>
                    {cleanedDescription && (
                      <p className="text-xs text-white/40 line-clamp-2">{cleanedDescription}</p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Section C: Network */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <button
            type="button"
            onClick={() => setShowConnections((prev) => !prev)}
            className="w-full flex items-center justify-between text-sm font-semibold text-white/80"
          >
            Network Matches ({dashboard.connectionMatches.length})
            <ChevronDown className={`h-4 w-4 transition-transform ${showConnections ? 'rotate-180' : ''}`} />
          </button>
          {showConnections && (
            <div className="mt-4 space-y-3">
              {dashboard.connectionMatches.length === 0 ? (
                <p className="text-xs text-white/50">No connection matches yet.</p>
              ) : (
                dashboard.connectionMatches.map((match, index) => (
                  <div key={`${match.connectionName}-${index}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-white">{match.connectionName}</p>
                        <p className="text-xs text-white/50">
                          {match.position || 'Unknown role'} · {match.company || 'Unknown company'}
                        </p>
                      </div>
                    </div>
                    {match.matchingJobs.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {match.matchingJobs.map((mj, i) => (
                          <p key={i} className="text-xs text-white/40 flex items-center gap-1">
                            <StatusBadge status={mj.status} />
                            <span>{mj.title} at {mj.company}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {modalJob && (() => {
        const cleanedDescription = cleanDescription(modalJob.description);
        const descIsHebrew = isHebrew(cleanedDescription);
        const effectiveScore = modalJob.human_match_score ?? modalJob.match_score;
        const source = sourceConfig[modalJob.source] || { label: modalJob.source, color: 'text-white/60' };
        const actions = getStatusActions(modalJob.status);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setModalJobId(null); }}
          >
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-white/10 bg-[#00003f] p-6 shadow-2xl">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setModalJobId(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white/70"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white pr-8">{modalJob.title}</h2>
                <p className="text-sm text-white/60">{modalJob.company}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/50">
                  <StatusBadge status={modalJob.status} />
                  <span className={source.color}>{source.label}</span>
                  <span>{formatRelativeTime(modalJob.scraped_at)}</span>
                  <a
                    href={modalJob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open listing
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.targetStatus}
                      type="button"
                      onClick={async () => {
                        await handleStatusChange(modalJob.id, action.targetStatus);
                        if (action.targetStatus === 'archived') {
                          setModalJobId(null);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${action.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {action.label}
                    </button>
                  );
                })}
                <div className="ml-auto">
                  <ScoreEditor
                    value={effectiveScore}
                    label="Match"
                    hasCorrected={modalJob.human_match_score !== null}
                    onSave={async (score) => {
                      const { success } = await correctJobScore(modalJob.id, score);
                      if (success) {
                        setJobs((prev) => prev.map((j) => (j.id === modalJob.id ? { ...j, human_match_score: score } : j)));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              {cleanedDescription && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-white/70 mb-2">Description</h3>
                  <p className="text-xs text-white/60 leading-relaxed" dir={descIsHebrew ? 'rtl' : 'ltr'}>
                    {cleanedDescription}
                  </p>
                </div>
              )}

              {/* Match Reasons */}
              {modalJob.match_reasons && modalJob.match_reasons.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-white/70 mb-2">Match Reasons</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-white/60">
                    {modalJob.match_reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Connections at this company */}
              {modalConnections.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-xs font-semibold text-white/70 mb-2">
                    <Users className="h-3 w-3 inline mr-1" />
                    Connections at {modalJob.company} ({modalConnections.length})
                  </h3>
                  <div className="space-y-2">
                    {modalConnections.map((conn, i) => (
                      <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-2">
                        <p className="text-sm text-white">{conn.connectionName}</p>
                        <p className="text-xs text-white/50">
                          {conn.position || 'Unknown role'} · {conn.company || 'Unknown company'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
