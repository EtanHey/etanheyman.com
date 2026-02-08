'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getEmails, correctEmailScore, correctEmailCategory, type Email } from '../actions/data';
import { Mail, AlertTriangle, Check } from 'lucide-react';
import { formatRelativeTime } from '../lib/format';
import { categoryColors, scoreColor, EMAIL_CATEGORIES } from '../lib/constants';
import {
  ScoreEditor,
  CategoryBadge,
  CorrectionBanner,
  PageHeader,
  ListDetailLayout,
} from '../components';

function EmailDetail({
  email,
  onBack,
  onUpdate,
}: {
  email: Email;
  onBack: () => void;
  onUpdate: (updated: Email) => void;
}) {
  const effectiveScore = email.human_score ?? email.score;
  const effectiveCategory = email.human_category ?? email.category;

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
          <CategoryBadge
            value={effectiveCategory || 'other'}
            options={EMAIL_CATEGORIES}
            colors={categoryColors}
            onSave={async (cat) => {
              const { success } = await correctEmailCategory(email.id, cat);
              if (success) onUpdate({ ...email, human_category: cat, corrected_at: new Date().toISOString() });
            }}
            hasCorrected={email.human_category !== null}
          />
          <ScoreEditor
            value={effectiveScore}
            onSave={async (score) => {
              const { success } = await correctEmailScore(email.id, score);
              if (success) onUpdate({ ...email, human_score: score, corrected_at: new Date().toISOString() });
            }}
            hasCorrected={email.human_score !== null}
          />
          <span className="text-white/40">{formatRelativeTime(email.received_at)}</span>
          {email.notified && (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Notified
            </span>
          )}
        </div>
        <CorrectionBanner
          corrections={[
            { label: 'Score', aiValue: email.score, humanValue: email.human_score },
            { label: 'Category', aiValue: email.category, humanValue: email.human_category },
          ]}
        />
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

  const categories = ['all', ...EMAIL_CATEGORIES];

  const emailList = emails.length === 0 ? (
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
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-3 pb-4">
        <PageHeader
          icon={Mail}
          iconColor="text-blue-400"
          title="Email Triage"
          count={emails.length}
          onRefresh={fetchEmails}
          loading={loading}
        />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
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

      <ListDetailLayout
        hasSelection={!!selectedEmail}
        loading={loading}
        list={emailList}
        detail={
          selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onUpdate={(updated) => {
                setSelectedEmail(updated);
                setEmails(prev => prev.map(e => e.id === updated.id ? updated : e));
              }}
            />
          ) : null
        }
        emptyIcon={Mail}
        emptyText="Select an email"
      />
    </div>
  );
}
