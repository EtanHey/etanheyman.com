'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';

type RelevanceButtonsProps = {
  value: boolean | null;
  onVote: (relevant: boolean) => Promise<void>;
  saving?: boolean;
};

export function RelevanceButtons({ value, onVote, saving = false }: RelevanceButtonsProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onVote(true)}
        disabled={saving}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
          value === true
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            : 'border-white/10 text-white/60 hover:bg-emerald-500/10 hover:border-emerald-500/30'
        }`}
      >
        <ThumbsUp className={`h-4 w-4 ${value === true ? 'fill-emerald-400' : ''}`} />
        Good Match
      </button>
      <button
        type="button"
        onClick={() => onVote(false)}
        disabled={saving}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
          value === false
            ? 'bg-red-500/20 border-red-500/50 text-red-400'
            : 'border-white/10 text-white/60 hover:bg-red-500/10 hover:border-red-500/30'
        }`}
      >
        <ThumbsDown className={`h-4 w-4 ${value === false ? 'fill-red-400' : ''}`} />
        Bad Match
      </button>
    </>
  );
}
