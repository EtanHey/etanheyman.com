'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  ExternalLink,
  Sparkles,
  Clock,
  Users,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { getRecruiterDashboard, getRecruiterJobs, type RecruiterDashboard, type RecruiterJob } from '../actions/recruiter';
import { correctJobScore, updateJobStatus } from '../actions/data';
import { ActionItem, PageHeader, ScoreEditor } from '../components';
import { formatRelativeTime } from '../lib/format';
import { sourceConfig, statusConfig, type JobStatus } from '../lib/constants';

const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'archived', label: 'Archived' },
];

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
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
  return text.replace(/\s+/g, ' ').trim();
}

function isHebrew(text: string): boolean {
  const hebrewPattern = /[\u0590-\u05FF]/;
  return hebrewPattern.test(text);
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

export default function RecruiterPage() {
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<JobStatus | 'all'>('all');
  const [highScoreOnly, setHighScoreOnly] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(false);

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

  const statusCounts = dashboard?.jobsByStatus.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = item.count;
    return acc;
  }, {}) ?? {};

  const filteredJobs = useMemo(() => {
    let result = activeStatus === 'all' ? jobs : jobs.filter((job) => job.status === activeStatus);
    if (highScoreOnly) {
      result = result.filter((job) => {
        const score = job.human_match_score ?? job.match_score;
        return score !== null && score >= 8;
      });
    }
    return result;
  }, [jobs, activeStatus, highScoreOnly]);

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
    ? `${firstConnection.connectionName} at ${firstConnection.company || 'their company'} — applied to ${firstConnection.jobTitle || 'a role'}${dashboard.connectionMatches.length > 1 ? ` (+${dashboard.connectionMatches.length - 1} more)` : ''}`
    : 'No connection matches found yet.';

  const actionItems = [
    {
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
      title: `${dashboard.connectionMatches.length} connection matches`,
      description: connectionDesc,
      priority: 'info',
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
        {/* Section A: Action Items */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80">Action Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {actionItems.map((item) => (
              <ActionItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                priority={item.priority as 'urgent' | 'soon' | 'info'}
                actionLabel={item.actionLabel}
                onAction={item.onAction}
              />
            ))}
          </div>
        </div>

        {/* Section B: Jobs Pipeline */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80">Jobs Pipeline</h2>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'all', label: 'All', count: dashboard.totalJobs },
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
                const isExpanded = expandedJobId === job.id;
                const descIsHebrew = isHebrew(cleanedDescription);

                return (
                  <div
                    key={job.id}
                    className={`rounded-lg border border-white/10 bg-white/5 p-4 border-l-4 ${statusStyle.cardBorder}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                        <p className="text-xs text-white/60">{job.company}</p>
                      </div>
                      <select
                        value={job.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const { success } = await updateJobStatus(job.id, newStatus);
                          if (success) {
                            setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
                          }
                        }}
                        className="text-xs rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/70 focus:outline-none focus:ring-1 focus:ring-white/20"
                      >
                        {JOB_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#00003f] text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mb-2">
                      <span className={source.color}>{source.label}</span>
                      <span>{formatRelativeTime(job.scraped_at)}</span>
                      <ScoreEditor
                        value={effectiveScore}
                        label="Match"
                        hasCorrected={job.human_match_score !== null}
                        onSave={async (score) => {
                          const { success } = await correctJobScore(job.id, score);
                          if (success) {
                            setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, human_match_score: score } : j)));
                          }
                        }}
                      />
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </div>
                    {cleanedDescription && (
                      <p className="text-xs text-white/40 line-clamp-2">{cleanedDescription}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="mt-2 flex items-center gap-1 text-xs text-white/50 hover:text-white/70"
                    >
                      <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      {isExpanded ? 'Hide details' : 'Show details'}
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-3 text-xs text-white/60">
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-white/70 mb-1">Description</p>
                          <p dir={descIsHebrew ? 'rtl' : 'ltr'}>
                            {cleanedDescription || 'No description provided.'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/70 mb-1">Match Reasons</p>
                          {job.match_reasons && job.match_reasons.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {job.match_reasons.map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-white/40">No match reasons provided.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
            Network Matches
            <ChevronDown className={`h-4 w-4 transition-transform ${showConnections ? 'rotate-180' : ''}`} />
          </button>
          {showConnections && (
            <div className="mt-4 space-y-3">
              {dashboard.connectionMatches.length === 0 ? (
                <p className="text-xs text-white/50">No connection matches yet.</p>
              ) : (
                dashboard.connectionMatches.map((match, index) => (
                  <div key={`${match.connectionName}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <div>
                      <p className="text-sm text-white">{match.connectionName}</p>
                      <p className="text-xs text-white/50">
                        {match.position || 'Unknown role'} · {match.company || 'Unknown company'}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Applied: {match.jobTitle} at {match.jobCompany}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium rounded-lg border border-white/10 px-3 py-1.5 text-white/60 hover:bg-white/5"
                      disabled
                    >
                      Draft message
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
