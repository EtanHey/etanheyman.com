'use client';

import { useEffect, useState, useCallback } from 'react';
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
} from 'lucide-react';

type JobStatus = 'new' | 'viewed' | 'saved' | 'applied' | 'rejected' | 'archived';

// Job type imported from server actions

const statusConfig: Record<JobStatus, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Star },
  viewed: { label: 'Viewed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Eye },
  saved: { label: 'Saved', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Bookmark },
  applied: { label: 'Applied', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Send },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: X },
  archived: { label: 'Archived', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', icon: Archive },
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('new');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const { jobs: data, error } = await getJobs({
      status: filterStatus !== 'all' ? filterStatus : undefined,
      source: filterSource !== 'all' ? filterSource : undefined,
      search: searchQuery || undefined,
    });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data as any[] || []);
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

  const StatusBadge = ({ status }: { status: JobStatus }) => {
    const config = statusConfig[status];
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

    // All cards use consistent LTR layout for visual uniformity
    return (
      <button
        onClick={() => {
          setSelectedJob(job);
          if (job.status === 'new') {
            updateJobStatus(job.id, 'viewed');
          }
        }}
        className={`w-full text-left p-4 rounded-lg border transition-all ${
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
              onClick={() => updateJobStatus(job.id, 'saved')}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/50 text-amber-400 px-4 py-2 text-sm font-medium hover:bg-amber-500/10 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              Save
            </button>
          )}
          {job.status !== 'applied' && (
            <button
              onClick={() => updateJobStatus(job.id, 'applied')}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/50 text-emerald-400 px-4 py-2 text-sm font-medium hover:bg-emerald-500/10 transition-colors"
            >
              <Check className="h-4 w-4" />
              Applied
            </button>
          )}
          {job.status !== 'rejected' && (
            <button
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

  const filteredCount = jobs.length;
  const newCount = jobs.filter((j) => j.status === 'new').length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Search & Filters - fixed */}
      <div className="shrink-0 space-y-3 pb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
              showFilters || filterStatus !== 'new' || filterSource !== 'all'
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10 text-white/60 hover:bg-white/5'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={fetchJobs}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <div>
              <label className="block text-xs text-white/50 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'all')}
                className="rounded-lg border border-white/10 bg-blue-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="viewed">Viewed</option>
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="rounded-lg border border-white/10 bg-blue-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30"
              >
                <option value="all">All Sources</option>
                <option value="secretTLV">SecretTLV</option>
                <option value="indeed">Indeed</option>
                <option value="drushim">Drushim</option>
                <option value="goozali">Goozali</option>
              </select>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>{filteredCount} jobs</span>
          {newCount > 0 && filterStatus === 'all' && (
            <span className="text-blue-400">{newCount} new</span>
          )}
        </div>
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
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>

        {/* Job detail - desktop: always visible, mobile: replaces list */}
        <div className={`${selectedJob ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
          {selectedJob ? (
            <div className="h-full flex flex-col bg-white/5 rounded-lg border border-white/10 p-4 md:p-6 overflow-hidden">
              {/* Mobile back button */}
              <button
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
