'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getEmails, correctEmailScore, correctEmailCategory, type Email } from '../actions/data';
import {
  Mail,
  Search,
  RefreshCw,
  AlertTriangle,
  Star,
  Filter,
  ChevronDown,
  Check,
  Pencil,
  X,
} from 'lucide-react';

const categoryColors: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
  'tech-update': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  job: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  newsletter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  promo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  subscription: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  other: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

import { formatRelativeTime } from '../lib/format';

function scoreColor(score: number | null): string {
  if (score === null || score === undefined) return 'text-white/30';
  if (score >= 8) return 'text-red-400';
  if (score >= 6) return 'text-amber-400';
  if (score >= 4) return 'text-white/60';
  return 'text-white/30';
}

const EMAIL_CATEGORIES = ['urgent', 'tech-update', 'job', 'interview', 'newsletter', 'promo', 'subscription', 'social', 'other'];

function EmailDetail({
  email,
  onBack,
  onUpdate,
}: {
  email: Email;
  onBack: () => void;
  onUpdate: (updated: Email) => void;
}) {
  const [editingScore, setEditingScore] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [pendingScore, setPendingScore] = useState(email.human_score ?? email.score ?? 5);
  const [saving, setSaving] = useState(false);

  const effectiveScore = email.human_score ?? email.score;
  const effectiveCategory = email.human_category ?? email.category;
  const hasCorrectedScore = email.human_score !== null;
  const hasCorrectedCategory = email.human_category !== null;

  const saveScore = async (score: number) => {
    setSaving(true);
    const { success } = await correctEmailScore(email.id, score);
    if (success) {
      onUpdate({ ...email, human_score: score, corrected_at: new Date().toISOString() });
    }
    setSaving(false);
    setEditingScore(false);
  };

  const saveCategory = async (category: string) => {
    setSaving(true);
    const { success } = await correctEmailCategory(email.id, category);
    if (success) {
      onUpdate({ ...email, human_category: category, corrected_at: new Date().toISOString() });
    }
    setSaving(false);
    setEditingCategory(false);
  };

  return (
    <div className="h-full flex flex-col bg-white/5 rounded-lg border border-white/10 p-5 overflow-hidden">
      <button
        type="button"
        onClick={onBack}
        className="md:hidden shrink-0 text-white/60 mb-3 text-sm"
      >
        &larr; Back
      </button>
      <div className="shrink-0 border-b border-white/10 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white mb-1">{email.subject || '(no subject)'}</h2>
        <p className="text-sm text-white/60 mb-2">{email.from_address}</p>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {/* Category - editable */}
          {editingCategory ? (
            <div className="flex items-center gap-1">
              <select
                value={effectiveCategory || 'other'}
                onChange={(e) => saveCategory(e.target.value)}
                autoFocus
                onBlur={() => setEditingCategory(false)}
                className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-xs text-white focus:outline-none"
              >
                {EMAIL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingCategory(true)}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 transition-all hover:border-white/40 ${
                categoryColors[effectiveCategory || 'other'] || categoryColors.other
              }`}
            >
              {effectiveCategory}
              {hasCorrectedCategory && <Check className="h-2.5 w-2.5 text-emerald-400" />}
              <Pencil className="h-2.5 w-2.5 opacity-40" />
            </button>
          )}

          {/* Score - editable */}
          {editingScore ? (
            <div className="flex items-center gap-1">
              {[1,2,3,4,5,6,7,8,9,10].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => saveScore(s)}
                  className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                    s === pendingScore
                      ? 'bg-white/20 text-white border border-white/40'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
              <button type="button" onClick={() => setEditingScore(false)} className="text-white/40 ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingScore(true)}
              className={`font-bold flex items-center gap-1 transition-all hover:opacity-80 ${scoreColor(effectiveScore)}`}
            >
              Score: {effectiveScore ?? '-'}/10
              {hasCorrectedScore && <Check className="h-2.5 w-2.5 text-emerald-400" />}
              <Pencil className="h-2.5 w-2.5 opacity-40" />
            </button>
          )}

          <span className="text-white/40">{formatRelativeTime(email.received_at)}</span>
          {email.notified && (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Notified
            </span>
          )}
        </div>

        {/* Show AI vs Human comparison when corrected */}
        {(hasCorrectedScore || hasCorrectedCategory) && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-emerald-400 font-medium">Corrected</span>
            <span className="text-white/50 ml-2">
              {hasCorrectedScore && `AI: ${email.score} → You: ${email.human_score}`}
              {hasCorrectedScore && hasCorrectedCategory && ' | '}
              {hasCorrectedCategory && `AI: ${email.category} → You: ${email.human_category}`}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
          {email.snippet || 'No preview available.'}
        </p>
      </div>
    </div>
  );
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMinScore, setFilterMinScore] = useState<number>(0);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const requestIdRef = useRef(0);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchEmails = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    const { emails: data, error } = await getEmails({
      category: filterCategory !== 'all' ? filterCategory : undefined,
      minScore: filterMinScore > 0 ? filterMinScore : undefined,
      search: debouncedSearch || undefined,
    });
    if (currentRequestId !== requestIdRef.current) return;
    if (!error) setEmails(data);
    setLoading(false);
  }, [filterCategory, filterMinScore, debouncedSearch]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  const categories = ['all', 'urgent', 'tech-update', 'job', 'newsletter', 'promo', 'subscription', 'social', 'other'];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            Email Triage
            <span className="text-sm font-normal text-white/40">({emails.length})</span>
          </h1>
          <button
            type="button"
            onClick={fetchEmails}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              aria-label="Search emails"
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter by category"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
          <select
            value={filterMinScore}
            onChange={(e) => setFilterMinScore(Number(e.target.value))}
            aria-label="Filter by minimum score"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value={0}>Any Score</option>
            <option value={7}>7+ (Important)</option>
            <option value={9}>9+ (Urgent)</option>
          </select>
        </div>
      </div>

      {/* Email List + Detail */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* List */}
        <div className={`${selectedEmail ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] md:shrink-0 flex-col min-h-0 md:border-r md:border-white/10 md:pr-4`}>
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No emails found</p>
              </div>
            ) : (
              emails.map((email) => {
                const displayCategory = email.human_category ?? email.category ?? 'other';
                const displayScore = email.human_score ?? email.score;
                const isCorrected = email.human_score !== null || email.human_category !== null;
                const catColor = categoryColors[displayCategory] || categoryColors.other;
                return (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedEmail?.id === email.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-white line-clamp-1 flex-1">{email.subject || '(no subject)'}</p>
                      <span className={`text-xs font-bold flex items-center gap-1 ${scoreColor(displayScore)}`}>
                        {displayScore ?? '-'}
                        {isCorrected && <Check className="h-2.5 w-2.5 text-emerald-400" />}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span className="truncate max-w-[180px]">{email.from_address}</span>
                      <span className={`inline-flex rounded-full border px-1.5 py-0.5 text-[10px] ${catColor}`}>
                        {displayCategory}
                      </span>
                      <span className="ml-auto whitespace-nowrap">{formatRelativeTime(email.received_at)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail */}
        <div className={`${selectedEmail ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onUpdate={(updated) => {
                setSelectedEmail(updated);
                setEmails(prev => prev.map(e => e.id === updated.id ? updated : e));
              }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40 bg-white/[0.02] rounded-lg border border-white/5">
              <Mail className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">Select an email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
