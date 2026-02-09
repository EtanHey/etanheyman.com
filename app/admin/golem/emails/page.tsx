'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getEmails, correctEmailScore, correctEmailCategory, bulkSetSenderAction, type Email } from '../actions/data';
import { Mail, AlertTriangle, Check, RefreshCw, ChevronLeft, ChevronRight, MailX, CheckSquare, Square } from 'lucide-react';
import { formatRelativeTime } from '../lib/format';
import { categoryColors, scoreColor, EMAIL_CATEGORIES, type EmailCategory } from '../lib/constants';
import {
  ScoreEditor,
  CategoryBadge,
  CorrectionBanner,
  PageHeader,
  ListDetailLayout,
  SearchFilterBar,
  SenderModal,
} from '../components';

function EmailDetail({
  email,
  onUpdate,
}: {
  email: Email;
  onUpdate: (updated: Email) => void;
}) {
  const effectiveScore = email.human_score ?? email.score;
  const effectiveCategory = (email.human_category ?? email.category ?? 'other') as EmailCategory;
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
  const [page, setPage] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  const [senderModalAddress, setSenderModalAddress] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedSenders, setSelectedSenders] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const pageSize = 100;
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchEmails = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    const { emails: data, total, error } = await getEmails({
      category: filterCategory !== 'all' ? filterCategory : undefined,
      minScore: filterMinScore > 0 ? filterMinScore : undefined,
      search: debouncedSearch || undefined,
      page,
      pageSize,
    });
    if (currentRequestId !== requestIdRef.current) return;
    if (!error) {
      setEmails(data);
      setTotalEmails(total);
    }
    setLoading(false);
  }, [filterCategory, filterMinScore, debouncedSearch, page]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filterCategory, filterMinScore, debouncedSearch]);

  const totalPages = Math.ceil(totalEmails / pageSize);
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
    <>
      {emails.map((email) => {
        const displayCategory = (email.human_category ?? email.category ?? 'other') as EmailCategory;
        const displayScore = email.human_score ?? email.score;
        const isCorrected = email.human_score !== null || email.human_category !== null;
        const catColor = categoryColors[displayCategory] || categoryColors.other;
        return (
          <div
            key={email.id}
            className={`flex items-start gap-2 w-full text-left p-3 rounded-lg border transition-all ${
              selectedEmail?.id === email.id
                ? 'bg-white/10 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
            }`}
          >
            {bulkMode && (
              <button
                type="button"
                onClick={() => {
                  const addr = email.from_address;
                  if (!addr) return;
                  setSelectedSenders(prev => {
                    const next = new Set(prev);
                    if (next.has(addr)) next.delete(addr); else next.add(addr);
                    return next;
                  });
                }}
                className="shrink-0 mt-0.5 text-white/40 hover:text-white transition-colors"
              >
                {selectedSenders.has(email.from_address || '') ? (
                  <CheckSquare className="h-4 w-4 text-blue-400" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedEmail(email)}
              className="flex-1 min-w-0 text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (email.from_address) setSenderModalAddress(email.from_address);
                  }}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 truncate max-w-[240px] transition-colors"
                  title="View sender details"
                >
                  {email.from_address}
                </button>
                <span className={`inline-flex rounded-full border px-1.5 py-0.5 text-[10px] shrink-0 ${catColor}`}>
                  {displayCategory}
                </span>
                <span className="ml-auto flex items-center gap-1 shrink-0">
                  <span className={`text-xs font-bold ${scoreColor(displayScore)}`}>
                    {displayScore ?? '-'}
                  </span>
                  {isCorrected && <Check className="h-2.5 w-2.5 text-emerald-400" />}
                </span>
              </div>
              <p className="text-sm text-white line-clamp-1 mb-1">{email.subject || '(no subject)'}</p>
              {email.snippet && (
                <p className="text-xs text-white/40 line-clamp-1">{email.snippet}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                <span className="whitespace-nowrap">{formatRelativeTime(email.received_at)}</span>
              </div>
            </button>
          </div>
        );
      })}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-3 w-3" />
            Prev
          </button>
          <span className="text-xs text-white/50">
            Page {page + 1} of {totalPages} ({totalEmails} total)
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-3 pb-4">
        <PageHeader
          icon={Mail}
          iconColor="text-blue-400"
          title="Email Triage"
          count={totalEmails}
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

      {/* Bulk mode toolbar */}
      <div className="shrink-0 flex items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => {
            setBulkMode(!bulkMode);
            setSelectedSenders(new Set());
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            bulkMode
              ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
              : 'border-white/10 text-white/50 hover:bg-white/5'
          }`}
        >
          {bulkMode ? 'Cancel Bulk' : 'Bulk Mode'}
        </button>
        {bulkMode && selectedSenders.size > 0 && (
          <>
            <span className="text-xs text-white/40">{selectedSenders.size} sender{selectedSenders.size > 1 ? 's' : ''} selected</span>
            <button
              type="button"
              onClick={async () => {
                setBulkLoading(true);
                await bulkSetSenderAction(Array.from(selectedSenders), 'unsubscribe');
                setBulkLoading(false);
                setSelectedSenders(new Set());
                setBulkMode(false);
              }}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-30"
            >
              <MailX className="h-3 w-3" />
              {bulkLoading ? 'Processing...' : 'Unsubscribe Selected'}
            </button>
          </>
        )}
      </div>

      <ListDetailLayout
        hasSelection={Boolean(selectedEmail)}
        loading={loading}
        list={emailList}
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

      {/* Sender Modal */}
      <SenderModal
        emailAddress={senderModalAddress}
        onClose={() => setSenderModalAddress(null)}
      />
    </div>
  );
}
