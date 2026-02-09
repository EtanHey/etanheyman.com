'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { REJECTION_TAGS, type RejectionTag, rejectionTagLabels } from '../lib/constants';

interface BadMatchModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (tags: RejectionTag[], note: string | null) => Promise<void>;
  jobTitle: string;
}

export function BadMatchModal({ open, onClose, onConfirm, jobTitle }: BadMatchModalProps) {
  const [selectedTags, setSelectedTags] = useState<Set<RejectionTag>>(new Set());
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset state when modal opens for a new job
  useEffect(() => {
    if (open) {
      setSelectedTags(new Set());
      setNote('');
    }
  }, [open, jobTitle]);

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !saving) {
      onClose();
    }
  }, [onClose, saving]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  const toggleTag = (tag: RejectionTag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm(
        Array.from(selectedTags),
        note.trim() || null,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Bad match: ${jobTitle}`}
    >
      <div className="w-full max-w-md mx-4 rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">Bad Match</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-white/40 hover:text-white transition-colors disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-white/60 mb-4 line-clamp-2">{jobTitle}</p>

        {/* Tag chips */}
        <div className="mb-4">
          <label className="text-xs text-white/50 mb-2 block">Why is this a bad match?</label>
          <div className="flex flex-wrap gap-2">
            {REJECTION_TAGS.map((tag) => {
              const isSelected = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  disabled={saving}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {rejectionTagLabels[tag]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional note */}
        <div className="mb-6">
          <label htmlFor="rejection-note" className="text-xs text-white/50 mb-2 block">
            Additional notes (optional)
          </label>
          <textarea
            id="rejection-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={saving}
            placeholder="e.g., requires 10+ years of Go experience..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-colors resize-none disabled:opacity-50"
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving || selectedTags.size === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-30 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Mark Bad Match'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
