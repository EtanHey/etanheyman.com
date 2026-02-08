'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getEmails, correctEmailScore, correctEmailCategory, type Email } from '../actions/data';
import { Mail, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../lib/format';
import { categoryColors, scoreColor, EMAIL_CATEGORIES } from '../lib/constants';
import {
  ScoreEditor,
  CategoryBadge,
  CorrectionBanner,
  PageHeader,
  ListDetailLayout,
  SearchFilterBar,
} from '../components';

function EmailDetail({
  email,
  onUpdate,
}: {
  email: Email;
  onUpdate: (updated: Email) => void;
}) {
  const effectiveScore = email.human_score ?? email.score;
  const effectiveCategory = email.human_category ?? email.category ?? 'other';
  const hasCorrectedScore = email.human_score !== null;
  const hasCorrectedCategory = email.human_category !== null;

  const saveCategory = async (category: string) => {
    const { success } = await correctEmailCategory(email.id, category);
    if (success) {
      onUpdate({ ...email, human_category: category, corrected_at: new Date().toISOString() });
    }
  };

  const saveScore = async (score: number) => {
    const { success } = await correctEmailScore(email.id, score);
    if (success) {
      onUpdate({ ...email, human_score: score, corrected_at: new Date().toISOString() });
    }
  };

  const corrections = [
    hasCorrectedScore ? { label: 'Score', aiValue: email.score, humanValue: email.human_score } : null,
    hasCorrectedCategory ? { label: 'Category', aiValue: email.category, humanValue: email.human_category } : null,
  ].filter(Boolean) as Array<{ label: string; aiValue: string | number | null; humanValue: string | number | null }>;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/10 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white mb-1">{email.subject || '(no subject)'}</h2>
        <p className="text-sm text-white/60 mb-2">{email.from_address}</p>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <CategoryBadge
            value={effectiveCategory}
            options={EMAIL_CATEGORIES}
            colors={categoryColors}
            onSave={saveCategory}
            hasCorrected={hasCorrectedCategory}
          />
          <ScoreEditor
            value={effectiveScore}
            onSave={saveScore}
            label="Score"
            hasCorrected={hasCorrectedScore}
          />
          <span className="text-white/40">{formatRelativeTime(email.received_at)}</span>
          {email.notified && (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Notified
            </span>
          )}
        </div>
        <CorrectionBanner corrections={corrections} />
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

  const emailList = loading ? (
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
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search emails..."
          filters={[
            {
              value: filterCategory,
              onChange: setFilterCategory,
              options: categories.map((category) => ({
                value: category,
                label: category === 'all' ? 'All Categories' : category,
              })),
            },
            {
              value: filterMinScore,
              onChange: (value) => setFilterMinScore(Number(value)),
              options: [
                { value: 0, label: 'Any Score' },
                { value: 7, label: '7+ (Important)' },
                { value: 9, label: '9+ (Urgent)' },
              ],
            },
          ]}
        />
      </div>

      <ListDetailLayout
        hasSelection={Boolean(selectedEmail)}
        loading={loading}
        list={<div className="flex-1 overflow-y-auto space-y-2">{emailList}</div>}
        detail={
          selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onUpdate={(updated) => {
                setSelectedEmail(updated);
                setEmails(prev => prev.map(e => e.id === updated.id ? updated : e));
              }}
            />
          ) : null
        }
        emptyIcon={Mail}
        emptyText="Select an email"
        onBack={() => setSelectedEmail(null)}
      />
    </div>
  );
}
