'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getJobs, updateJobStatus as updateJobStatusAction, type Job } from './actions/jobs';
import {
  Search,
  Filter,
  ExternalLink,
  Star,
  Check,
  X,
  Archive,
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
  Languages,
  SlidersHorizontal,
  XCircle,
  Zap,
} from 'lucide-react';

type JobStatus = 'new' | 'viewed' | 'saved' | 'applied' | 'rejected' | 'archived';

// Job type imported from server actions

const statusConfig: Record<JobStatus, { label: string; color: string; cardBorder: string; icon: React.ElementType }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', cardBorder: 'border-l-blue-500', icon: Star },
  viewed: { label: 'Viewed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', cardBorder: 'border-l-gray-500', icon: Eye },
  saved: { label: 'Saved', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', cardBorder: 'border-l-amber-500', icon: Bookmark },
  applied: { label: 'Applied', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', cardBorder: 'border-l-emerald-500', icon: Send },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30', cardBorder: 'border-l-red-500', icon: X },
  archived: { label: 'Archived', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', cardBorder: 'border-l-zinc-500', icon: Archive },
};

// Status priority for sorting (lower = higher priority)
const statusPriority: Record<JobStatus, number> = {
  applied: 1,
  saved: 2,
  new: 3,
  viewed: 4,
  rejected: 5,
  archived: 6,
};

const sourceConfig: Record<string, { label: string; color: string }> = {
  secretTLV: { label: 'SecretTLV', color: 'text-purple-400' },
  indeed: { label: 'Indeed', color: 'text-blue-400' },
  drushim: { label: 'Drushim', color: 'text-orange-400' },
  goozali: { label: 'Goozali', color: 'text-green-400' },
};

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
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Track request version to prevent race conditions with stale responses
  const requestIdRef = useRef(0);

  const fetchJobs = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    const { jobs: data, error } = await getJobs({
      status: filterStatus !== 'all' ? filterStatus : undefined,
      source: filterSource !== 'all' ? filterSource : undefined,
      search: searchQuery || undefined,
    });

    // Ignore stale responses from earlier requests
    if (currentRequestId !== requestIdRef.current) {
      return;
    }

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs((data || []) as Job[]);
    }
    setLoading(false);
  }, [filterStatus, filterSource, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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

  const JobCard = ({ job }: { job: Job }) => {
    const source = sourceConfig[job.source] || { label: job.source, color: 'text-white/60' };
    const isSelected = selectedJob?.id === job.id;
    const statusStyle = statusConfig[job.status as JobStatus] || statusConfig.new;

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
          <h3 className="font-medium text-white line-clamp-2">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-sm text-white/70 mb-2">{job.company}</p>
        <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
          <span className={source.color}>{source.label}</span>
          {job.location && <span>{job.location}</span>}
          <span>{formatDate(job.scraped_at)}</span>
        </div>
        {job.match_score && (
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-amber-400">{job.match_score}/10</span>
          </div>
        )}
      </button>
    );
  };

  const JobDetail = ({ job }: { job: Job }) => {
    const source = sourceConfig[job.source] || { label: job.source, color: 'text-white/60' };
    const cleanedDescription = cleanDescription(job.description);
    const descIsHebrew = isHebrew(cleanedDescription);

    // Consistent LTR layout for header, only description uses RTL when Hebrew
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header - fixed, always LTR for consistency */}
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
            {job.match_score && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" />
                {job.match_score}/10
              </span>
            )}
          </div>
        </div>

        {/* Actions - fixed */}
        <div className="shrink-0 flex flex-wrap gap-2 mb-4">
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
          {job.status !== 'rejected' && (
            <button
              type="button"
              onClick={() => updateJobStatus(job.id, 'rejected')}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/50 text-red-400 px-4 py-2 text-sm font-medium hover:bg-red-500/10 transition-colors"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          )}
        </div>

        {/* AI Notes (match reason) - fixed */}
        {job.notes && (
          <div className="shrink-0 mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h3 className="text-xs font-medium text-emerald-400 mb-1">AI Match Reason</h3>
            <p className="text-sm text-white/80">{job.notes}</p>
          </div>
        )}

        {/* Tags - fixed */}
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

  // Extract unique locations from jobs
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    jobs.forEach(job => {
      if (job.location) {
        const loc = job.location.toLowerCase();
        if (loc.includes('remote') || loc.includes('מרחוק')) locations.add('remote');
        if (loc.includes('tel aviv') || loc.includes('תל אביב') || loc.includes('ramat gan')) locations.add('tel-aviv');
        if (loc.includes('jerusalem') || loc.includes('ירושלים')) locations.add('jerusalem');
        if (loc.includes('haifa') || loc.includes('חיפה')) locations.add('haifa');
        if (loc.includes('center') || loc.includes('מרכז') || loc.includes('rehovot') || loc.includes('ness ziona')) locations.add('center');
      }
    });
    return Array.from(locations);
  }, [jobs]);

  // Apply all client-side filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (!matchesTimeFilter(job, filterTime)) return false;
      if (!matchesScoreFilter(job, filterScore)) return false;
      if (!matchesLocationFilter(job, filterLocation)) return false;
      return true;
    });
  }, [jobs, filterTime, filterScore, filterLocation, matchesTimeFilter, matchesScoreFilter, matchesLocationFilter]);

  // Calculate status counts from filtered jobs
  const statusCounts = filteredJobs.reduce((acc, job) => {
    acc[job.status as JobStatus] = (acc[job.status as JobStatus] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const filteredCount = filteredJobs.length;
  const newCount = statusCounts.new || 0;
  const appliedCount = statusCounts.applied || 0;
  const savedCount = statusCounts.saved || 0;
  const viewedCount = statusCounts.viewed || 0;
  const rejectedCount = statusCounts.rejected || 0;

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
        default:
          const priorityA = statusPriority[a.status as JobStatus] || 99;
          const priorityB = statusPriority[b.status as JobStatus] || 99;
          if (priorityA !== priorityB) return priorityA - priorityB;
          return new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime();
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
                <label className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Building2 className="h-3 w-3" />
                  Source
                </label>
                <select
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
                <label className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Clock className="h-3 w-3" />
                  Posted
                </label>
                <select
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
                <label className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <Sparkles className="h-3 w-3" />
                  Match Score
                </label>
                <select
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
                <label className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                  <MapPin className="h-3 w-3" />
                  Location
                </label>
                <select
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
              <label className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                <TrendingUp className="h-3 w-3" />
                Sort by
              </label>
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
            count={filteredCount}
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
          {rejectedCount > 0 && (
            <FilterChip
              active={filterStatus === 'rejected'}
              onClick={() => setFilterStatus('rejected')}
              icon={X}
              label="Rejected"
              count={rejectedCount}
              activeClass="bg-red-500/30 text-red-300"
              colorClass="bg-red-500/10 text-red-400 hover:bg-red-500/20"
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
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No jobs found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              sortedJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
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
    </div>
  );
}
