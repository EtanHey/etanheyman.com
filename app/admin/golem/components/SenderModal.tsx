'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Loader2, Mail, Ban, Check, ExternalLink, MailX } from 'lucide-react';
import { getSenderDetails, setSenderAction, type SenderDetails } from '../actions/data';
import { senderCategoryColors } from '../lib/constants';
import { formatRelativeTime } from '../lib/format';
import { scoreColor } from '../lib/constants';

interface SenderModalProps {
  emailAddress: string | null;
  onClose: () => void;
  onActionTaken?: (emailAddress: string, action: string) => void;
}

export function SenderModal({ emailAddress, onClose, onActionTaken }: SenderModalProps) {
  const [details, setDetails] = useState<SenderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!emailAddress) {
      setDetails(null);
      return;
    }
    setLoading(true);
    setError(null);
    getSenderDetails(emailAddress).then(({ data, error: err }) => {
      if (err) setError(err);
      else setDetails(data);
      setLoading(false);
    });
  }, [emailAddress]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (emailAddress) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [emailAddress, handleKeyDown]);

  if (!emailAddress) return null;

  const handleAction = async (action: 'keep' | 'unsubscribe' | 'block') => {
    setActionLoading(action);
    const { success } = await setSenderAction(emailAddress, action);
    setActionLoading(null);
    if (success) {
      if (details) {
        setDetails({
          ...details,
          sender: { ...details.sender, user_action: action },
        });
      }
      onActionTaken?.(emailAddress, action);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const sender = details?.sender;
  const catColor = senderCategoryColors[sender?.category || ''] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  const canUnsubscribe = sender?.category === 'promo' || sender?.category === 'newsletter';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Sender: ${emailAddress}`}
    >
      <div className="w-full max-w-lg mx-4 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between p-5 border-b border-white/10">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white truncate">
              {sender?.display_name || emailAddress}
            </h2>
            <p className="text-sm text-white/50 truncate">{emailAddress}</p>
            <div className="flex items-center gap-2 mt-2">
              {sender?.category && (
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${catColor}`}>
                  {sender.category}
                </span>
              )}
              {sender?.user_action && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  sender.user_action === 'keep' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  sender.user_action === 'unsubscribe' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {sender.user_action === 'keep' && <Check className="h-2.5 w-2.5" />}
                  {sender.user_action === 'unsubscribe' && <MailX className="h-2.5 w-2.5" />}
                  {sender.user_action === 'block' && <Ban className="h-2.5 w-2.5" />}
                  {sender.user_action}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors ml-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-400 py-4">{error}</p>
          ) : sender ? (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-white">{sender.total_emails}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">Emails</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <div className={`text-lg font-bold ${scoreColor(sender.avg_score)}`}>
                    {sender.avg_score != null ? sender.avg_score.toFixed(1) : '-'}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">Avg Score</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <div className="text-sm font-bold text-white">
                    {sender.last_email_at ? formatRelativeTime(sender.last_email_at) : '-'}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">Last Email</div>
                </div>
              </div>

              {/* Unsubscribe info */}
              {sender.unsubscribe_url && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <ExternalLink className="h-3 w-3" />
                  <span>Unsubscribe link available</span>
                  {sender.unsubscribe_status && (
                    <span className={`rounded-full px-2 py-0.5 ${
                      sender.unsubscribe_status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                      sender.unsubscribe_status === 'requested' ? 'bg-amber-500/20 text-amber-400' :
                      sender.unsubscribe_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {sender.unsubscribe_status}
                    </span>
                  )}
                </div>
              )}

              {/* Recent emails */}
              {details!.recentEmails.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Recent Emails
                  </h3>
                  <div className="space-y-1">
                    {details!.recentEmails.map((email) => (
                      <div
                        key={email.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Mail className="h-3 w-3 text-white/30 shrink-0" />
                        <span className="text-sm text-white/70 truncate flex-1">
                          {email.subject || '(no subject)'}
                        </span>
                        {email.score != null && (
                          <span className={`text-xs font-medium ${scoreColor(email.score)}`}>
                            {email.score}
                          </span>
                        )}
                        <span className="text-xs text-white/30 shrink-0">
                          {formatRelativeTime(email.received_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        {sender && (
          <div className="shrink-0 flex items-center gap-2 p-5 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleAction('keep')}
              disabled={actionLoading !== null || sender.user_action === 'keep'}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-30"
            >
              {actionLoading === 'keep' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Keep
            </button>
            {canUnsubscribe && (
              <button
                type="button"
                onClick={() => handleAction('unsubscribe')}
                disabled={actionLoading !== null || sender.user_action === 'unsubscribe'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-30"
              >
                {actionLoading === 'unsubscribe' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailX className="h-4 w-4" />}
                Unsubscribe
              </button>
            )}
            <button
              type="button"
              onClick={() => handleAction('block')}
              disabled={actionLoading !== null || sender.user_action === 'block'}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
            >
              {actionLoading === 'block' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
              Block
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
