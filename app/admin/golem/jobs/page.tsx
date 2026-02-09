'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getJobs, updateJobStatus as updateJobStatusAction, saveJobRejection, type Job } from './actions/jobs';
import { correctJobRelevance, correctJobScore } from '../actions/data';
import type { RejectionTag } from '../lib/constants';
import {
  Search,
  Filter,
  ExternalLink,
  Star,
  Check,
  X,
  Eye,
  Bookmark,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  Briefcase,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  Calendar,
  Building2,
  SlidersHorizontal,
  XCircle,
  Zap,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Archive,
} from 'lucide-react';
import { ScoreEditor, RelevanceButtons, CorrectionBanner, BadMatchModal } from '../components';
import { type JobStatus, statusConfig, statusPriority, sourceConfig } from '../lib/constants';


// Strip HTML tags and decode entities
function cleanDescription(html: string | null): string {
  if (!html) return '';
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');
  // Decode common HTML entities
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
  // Collapse multiple spaces/newlines
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// Detect if text is Hebrew (for RTL)
function isHebrew(text: string): boolean {
  const hebrewPattern = /[\u0590-\u05FF]/;
  return hebrewPattern.test(text);
}

// Time filter options
type TimeFilter = 'all' | 'today' | 'week' | 'month';
// Score filter options
type ScoreFilter = 'all' | 'high' | 'medium' | 'low';
// Sort options
type SortOption = 'priority' | 'date' | 'score' | 'company';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<TimeFilter>('all');
  const [filterScore, setFilterScore] = useState<ScoreFilter>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [serverStatusCounts, setServerStatusCounts] = useState<Record<string, number>>({});
  const [badMatchJob, setBadMatchJob] = useState<Job | null>(null);
  const pageSize = 100;

  // Track request version to prevent race conditions with stale responses
  const requestIdRef = useRef(0);

  const fetchJobs = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    const { jobs: data, total, statusCounts: counts, error } = await getJobs({
      status: filterStatus !== 'all' ? filterStatus : undefined,
      source: filterSource !== 'all' ? filterSource : undefined,
      search: searchQuery || undefined,
      page,
      pageSize,
      includeArchived: filterStatus === 'archived',
    });

    // Ignore stale responses from earlier requests
    if (currentRequestId !== requestIdRef.current) {
      return;
    }

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs((data || []) as Job[]);
      setTotalJobs(total);
      setServerStatusCounts(counts);
    }
    setLoading(false);
  }, [filterStatus, filterSource, searchQuery, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filterStatus, filterSource, searchQuery]);

  const totalPages = Math.ceil(totalJobs / pageSize);

  const updateJobStatus = async (jobId: string, status: JobStatus) => {
    const { success, error } = await updateJobStatusAction(jobId, status);

    if (error || !success) {
      console.error('Error updating job:', error);
      return;
    }

    // Update local state
    const updates = { status };
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j))
    );
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const StatusBadge = ({ status }: { status: string }) => {
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
  };

  const hasWeakData = (job: Job): boolean =>
    !job.description || job.description.trim() === '' || /^Job #\d+/.test(job.title);

  const JobCard = ({ job }: { job: Job }) => {
    const source = sourceConfig[job.source] || { label: job.source, color: 'text-white/60' };
    const isSelected = selectedJob?.id === job.id;
    const statusStyle = statusConfig[job.status as JobStatus] || statusConfig.new;
    const weak = hasWeakData(job);

    // All cards use consistent LTR layout for visual uniformity
    return (
      <button
        type="button"
        onClick={() => {
          setSelectedJob(job);
          if (job.status === 'new') {
            updateJobStatus(job.id, 'viewed');
          }
        }}
        className={`w-full text-left p-4 rounded-lg border-l-4 border transition-all ${statusStyle.cardBorder} ${
          isSelected
            ? 'bg-white/10 border-white/30'
            : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {weak && <span title="Missing data"><AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" /></span>}
            <h3 className="font-medium text-white line-clamp-2">{job.title}</h3>
          </div>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-sm text-white/70 mb-2">{job.company}</p>
        <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
          <span className={source.color}>{source.label}</span>
          {job.location && <span>{job.location}</span>}
          <span>{formatDate(job.scraped_at)}</span>
        </div>
        {(job.match_score != null || job.human_match_score != null) && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-amber-400">{job.human_match_score ?? job.match_score}/10</span>
              {job.human_match_score !== null && <Check className="h-2.5 w-2.5 text-emerald-400" />}
            </div>
            {job.human_relevant !== null && (
              job.human_relevant
                ? <ThumbsUp className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                : <ThumbsDown className="h-3 w-3 text-red-400 fill-red-400" />
            )}
          </div>
        )}
      </button>
    );
  };

  const JobDetail = ({ job }: { job: Job }) => {
    const source = sourceConfig[job.source] || { label: job.source, color: 'text-white/60' };
    const cleanedDescription = cleanDescription(job.description);
    const descIsHebrew = isHebrew(cleanedDescription);
    const [saving, setSaving] = useState(false);

    const effectiveScore = job.human_match_score ?? job.match_score;

    const handleRelevance = async (relevant: boolean) => {
      setSaving(true);
      try {
        const { success } = await correctJobRelevance(job.id, relevant);
        if (success) {
          const updated = { ...job, human_relevant: relevant, corrected_at: new Date().toISOString() };
          setJobs(prev => prev.map(j => j.id === job.id ? updated : j));
          setSelectedJob(updated);
        }
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="shrink-0 border-b border-white/10 pb-4 mb-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-xl font-semibold text-white">{job.title}</h2>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-lg text-white/80 mb-2">{job.company}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className={source.color}>{source.label}</span>
            {job.location && <span>{job.location}</span>}
            {job.experience && <span>{job.experience}</span>}
            <span>{formatDate(job.scraped_at)}</span>
            <ScoreEditor
              value={effectiveScore}
              label="Match"
              onSave={async (score) => {
                const { success } = await correctJobScore(job.id, score);
                if (success) {
                  const updated = { ...job, human_match_score: score, corrected_at: new Date().toISOString() };
                  setJobs(prev => prev.map(j => j.id === job.id ? updated : j));
                  setSelectedJob(updated);
                }
              }}
              hasCorrected={job.human_match_score !== null}
            />
          </div>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2 mb-4">
          <RelevanceButtons
            value={job.human_relevant}
            onVote={handleRelevance}
            saving={saving}
          />

          <div className="border-l border-white/10 mx-1" />

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-900 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Listing
          </a>
          {job.status !== 'saved' && job.status !== 'applied' && (
            <button
              type="button"
              onClick={() => updateJobStatus(job.id, 'saved')}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/50 text-amber-400 px-4 py-2 text-sm font-medium hover:bg-amber-500/10 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              Save
            </button>
          )}
          {job.status !== 'applied' && (
            <button
              type="button"
              onClick={() => updateJobStatus(job.id, 'applied')}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/50 text-emerald-400 px-4 py-2 text-sm font-medium hover:bg-emerald-500/10 transition-colors"
            >
              <Check className="h-4 w-4" />
              Applied
            </button>
          )}
          {job.status !== 'archived' && (
            <button
              type="button"
              onClick={() => setBadMatchJob(job)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/50 text-red-400 px-4 py-2 text-sm font-medium hover:bg-red-500/10 transition-colors"
            >
              <ThumbsDown className="h-4 w-4" />
              Bad Match
            </button>
          )}
        </div>

        <CorrectionBanner
          corrections={[
            { label: 'Score', aiValue: job.match_score, humanValue: job.human_match_score },
            { label: 'Relevance', aiValue: null, humanValue: job.human_relevant !== null ? (job.human_relevant ? 'Good' : 'Bad') : null },
          ]}
        />

        {/* AI Notes (match reason) */}
        {job.notes && (
          <div className="shrink-0 mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h3 className="text-xs font-medium text-emerald-400 mb-1">AI Match Reason</h3>
            <p className="text-sm text-white/80">{job.notes}</p>
          </div>
        )}

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="shrink-0 mb-4">
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description - scrollable */}
        {cleanedDescription && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <h3 className="text-sm font-medium text-white/80 mb-2">Description</h3>
            <div
              className="text-sm text-white/60 leading-relaxed"
              dir={descIsHebrew ? 'rtl' : 'ltr'}
            >
              {cleanedDescription}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper: Check if job matches time filter
  const matchesTimeFilter = useCallback((job: Job, filter: TimeFilter): boolean => {
    if (filter === 'all') return true;
    const jobDate = new Date(job.scraped_at);
    const now = new Date();
    const diffMs = now.getTime() - jobDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    switch (filter) {
      case 'today': return diffDays < 1;
      case 'week': return diffDays < 7;
      case 'month': return diffDays < 30;
      default: return true;
    }
  }, []);

  // Helper: Check if job matches score filter
  const matchesScoreFilter = useCallback((job: Job, filter: ScoreFilter): boolean => {
    if (filter === 'all') return true;
    const score = job.match_score || 0;
    switch (filter) {
      case 'high': return score >= 8;
      case 'medium': return score >= 6 && score < 8;
      case 'low': return score < 6;
      default: return true;
    }
  }, []);

  // Helper: Check if job matches location filter
  const matchesLocationFilter = useCallback((job: Job, filter: string): boolean => {
    if (filter === 'all') return true;
    const location = (job.location || '').toLowerCase();
    if (filter === 'remote') return location.includes('remote') || location.includes('מרחוק');
    if (filter === 'tel-aviv') return location.includes('tel aviv') || location.includes('תל אביב') || location.includes('ramat gan') || location.includes('רמת גן');
    if (filter === 'jerusalem') return location.includes('jerusalem') || location.includes('ירושלים');
    if (filter === 'haifa') return location.includes('haifa') || location.includes('חיפה');
    if (filter === 'center') return location.includes('center') || location.includes('מרכז') || location.includes('rehovot') || location.includes('רחובות') || location.includes('ness ziona') || location.includes('נס ציונה');
    return true;
  }, []);

  // Apply all client-side filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (!matchesTimeFilter(job, filterTime)) return false;
      if (!matchesScoreFilter(job, filterScore)) return false;
      if (!matchesLocationFilter(job, filterLocation)) return false;
      return true;
    });
  }, [jobs, filterTime, filterScore, filterLocation, matchesTimeFilter, matchesScoreFilter, matchesLocationFilter]);

  const filteredCount = filteredJobs.length;
  // Use server-side counts for accurate totals across all pages
  const newCount = serverStatusCounts.new || 0;
  const appliedCount = serverStatusCounts.applied || 0;
  const savedCount = serverStatusCounts.saved || 0;
  const viewedCount = serverStatusCounts.viewed || 0;
  const archivedCount = serverStatusCounts.archived || 0;

  // Count active filters
  const activeFilterCount = [
    filterStatus !== 'all',
    filterSource !== 'all',
    filterTime !== 'all',
    filterScore !== 'all',
    filterLocation !== 'all',
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setFilterStatus('all');
    setFilterSource('all');
    setFilterTime('all');
    setFilterScore('all');
    setFilterLocation('all');
    setSearchQuery('');
  };

  // Sort jobs based on selected sort option
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime();
        case 'score':
          return (b.match_score || 0) - (a.match_score || 0);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'priority':
        default: {
          const priorityA = statusPriority[a.status as JobStatus] || 99;
          const priorityB = statusPriority[b.status as JobStatus] || 99;
          if (priorityA !== priorityB) return priorityA - priorityB;
          return new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime();
        }
      }
    });
  }, [filteredJobs, sortBy]);

  // Filter chip component for reusability
  const FilterChip = ({
    active,
    onClick,
    icon: Icon,
    label,
    count,
    colorClass = 'bg-white/5 text-white/60 hover:bg-white/10',
    activeClass = 'bg-white/20 text-white'
  }: {
    active: boolean;
    onClick: () => void;
    icon?: React.ElementType;
    label: string;
    count?: number;
    colorClass?: string;
    activeClass?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
        active ? activeClass : colorClass
      }`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
      {count !== undefined && <span className="opacity-70">({count})</span>}
    </button>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Search & Filters - fixed */}
      <div className="shrink-0 space-y-3 pb-4">
        {/* Search bar row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies..."
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
              showFilters || activeFilterCount > 0
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10 text-white/60 hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-blue-500 text-[10px] font-bold flex items-center justify-center text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="button"
            onClick={fetchJobs}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Expanded filters panel */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Filter header with clear all */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter Jobs
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <XCircle className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>

            {/* Filter grid - responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Source filter */}
              <div>
                <label htmlFor="filter-source" className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Building2 className="h-3 w-3" />
                  Source
                </label>
                <select
                  id="filter-source"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="all">All Sources</option>
                  <option value="secretTLV">SecretTLV</option>
                  <option value="indeed">Indeed</option>
                  <option value="drushim">Drushim</option>
                  <option value="goozali">Goozali</option>
                </select>
              </div>

              {/* Time filter */}
              <div>
                <label htmlFor="filter-time" className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Clock className="h-3 w-3" />
                  Posted
                </label>
                <select
                  id="filter-time"
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value as TimeFilter)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="all">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
              </div>

              {/* Score filter */}
              <div>
                <label htmlFor="filter-score" className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Sparkles className="h-3 w-3" />
                  Match Score
                </label>
                <select
                  id="filter-score"
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value as ScoreFilter)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="all">Any score</option>
                  <option value="high">High (8+)</option>
                  <option value="medium">Medium (6-7)</option>
                  <option value="low">Low (&lt;6)</option>
                </select>
              </div>

              {/* Location filter */}
              <div>
                <label htmlFor="filter-location" className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <MapPin className="h-3 w-3" />
                  Location
                </label>
                <select
                  id="filter-location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="all">Any location</option>
                  <option value="remote">Remote</option>
                  <option value="tel-aviv">Tel Aviv / Ramat Gan</option>
                  <option value="center">Center (Rehovot, Ness Ziona)</option>
                  <option value="jerusalem">Jerusalem</option>
                  <option value="haifa">Haifa</option>
                </select>
              </div>
            </div>

            {/* Sort options */}
            <div className="pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                <TrendingUp className="h-3 w-3" />
                Sort by
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={sortBy === 'priority'}
                  onClick={() => setSortBy('priority')}
                  icon={Zap}
                  label="Priority"
                  activeClass="bg-violet-500/30 text-violet-300"
                  colorClass="bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
                />
                <FilterChip
                  active={sortBy === 'date'}
                  onClick={() => setSortBy('date')}
                  icon={Calendar}
                  label="Newest"
                  activeClass="bg-cyan-500/30 text-cyan-300"
                  colorClass="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                />
                <FilterChip
                  active={sortBy === 'score'}
                  onClick={() => setSortBy('score')}
                  icon={Star}
                  label="Best Match"
                  activeClass="bg-amber-500/30 text-amber-300"
                  colorClass="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                />
                <FilterChip
                  active={sortBy === 'company'}
                  onClick={() => setSortBy('company')}
                  icon={Building2}
                  label="Company A-Z"
                  activeClass="bg-rose-500/30 text-rose-300"
                  colorClass="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick status filter chips - always visible */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
            label="All"
            count={totalJobs}
          />
          {newCount > 0 && (
            <FilterChip
              active={filterStatus === 'new'}
              onClick={() => setFilterStatus('new')}
              icon={Star}
              label="New"
              count={newCount}
              activeClass="bg-blue-500/30 text-blue-300"
              colorClass="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            />
          )}
          {appliedCount > 0 && (
            <FilterChip
              active={filterStatus === 'applied'}
              onClick={() => setFilterStatus('applied')}
              icon={Send}
              label="Applied"
              count={appliedCount}
              activeClass="bg-emerald-500/30 text-emerald-300"
              colorClass="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            />
          )}
          {savedCount > 0 && (
            <FilterChip
              active={filterStatus === 'saved'}
              onClick={() => setFilterStatus('saved')}
              icon={Bookmark}
              label="Saved"
              count={savedCount}
              activeClass="bg-amber-500/30 text-amber-300"
              colorClass="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            />
          )}
          {viewedCount > 0 && (
            <FilterChip
              active={filterStatus === 'viewed'}
              onClick={() => setFilterStatus('viewed')}
              icon={Eye}
              label="Viewed"
              count={viewedCount}
              activeClass="bg-gray-500/30 text-gray-300"
              colorClass="bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
            />
          )}
          {archivedCount > 0 && (
            <FilterChip
              active={filterStatus === 'archived'}
              onClick={() => setFilterStatus('archived')}
              icon={Archive}
              label="Archive"
              count={archivedCount}
              activeClass="bg-zinc-500/30 text-zinc-300"
              colorClass="bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20"
            />
          )}
        </div>

        {/* Active filters summary bar */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-2">
            <Filter className="h-3 w-3" />
            <span>Showing {filteredCount} jobs</span>
            {filterSource !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                {sourceConfig[filterSource]?.label || filterSource}
              </span>
            )}
            {filterTime !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                {filterTime === 'today' ? 'Today' : filterTime === 'week' ? 'This week' : 'This month'}
              </span>
            )}
            {filterScore !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {filterScore === 'high' ? '8+ score' : filterScore === 'medium' ? '6-7 score' : '<6 score'}
              </span>
            )}
            {filterLocation !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                {filterLocation === 'remote' ? 'Remote' :
                 filterLocation === 'tel-aviv' ? 'Tel Aviv' :
                 filterLocation === 'center' ? 'Center' :
                 filterLocation === 'jerusalem' ? 'Jerusalem' : 'Haifa'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main content - split view, fills remaining height */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Job list - mobile: full/hidden, desktop: always visible sidebar */}
        <div className={`${selectedJob ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] md:shrink-0 flex-col min-h-0 md:border-r md:border-white/10 md:pr-4`}>
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No jobs found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              sortedJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-white/50">
                Page {page + 1} of {totalPages} ({totalJobs} total)
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Job detail - desktop: always visible, mobile: replaces list */}
        <div className={`${selectedJob ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
          {selectedJob ? (
            <div className="h-full flex flex-col bg-white/5 rounded-lg border border-white/10 p-4 md:p-6 overflow-hidden">
              {/* Mobile back button */}
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="md:hidden shrink-0 flex items-center gap-2 text-white/60 mb-4 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to list
              </button>
              <JobDetail job={selectedJob} />
            </div>
          ) : (
            /* Desktop empty state */
            <div className="h-full flex flex-col items-center justify-center text-white/40 bg-white/[0.02] rounded-lg border border-white/5">
              <Briefcase className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">Select a job to view details</p>
              <p className="text-sm mt-1">Click on any job from the list</p>
            </div>
          )}
        </div>
      </div>

      {/* Bad Match Modal */}
      <BadMatchModal
        open={badMatchJob !== null}
        onClose={() => setBadMatchJob(null)}
        jobTitle={badMatchJob?.title || ''}
        onConfirm={async (tags: RejectionTag[], note: string | null) => {
          if (!badMatchJob) return;
          const { success } = await saveJobRejection(badMatchJob.id, tags, note);
          if (!success) return;
          setJobs((prev) => prev.filter((j) => j.id !== badMatchJob.id));
          if (selectedJob?.id === badMatchJob.id) {
            setSelectedJob(null);
          }
          setBadMatchJob(null);
        }}
      />
    </div>
  );
}
