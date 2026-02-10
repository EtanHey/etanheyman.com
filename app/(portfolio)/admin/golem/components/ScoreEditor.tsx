'use client';

import { useState } from 'react';
import { Check, Pencil, Star, X } from 'lucide-react';
import { scoreColor } from '../lib/constants';

type ScoreEditorProps = {
  value: number | null;
  onSave: (score: number) => Promise<void>;
  label?: string;
  hasCorrected?: boolean;
};

export function ScoreEditor({ value, onSave, label, hasCorrected }: ScoreEditorProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeScore = value ?? 5;
  const displayValue = value ?? '-';
  const colorClass = scoreColor(value);

  const handleSave = async (score: number) => {
    setSaving(true);
    try {
      await onSave(score);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => handleSave(score)}
            disabled={saving}
            className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
              score === activeScore
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {score}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-white/40 ml-1"
          disabled={saving}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`font-bold flex items-center gap-1 transition-all hover:opacity-80 ${colorClass}`}
    >
      {label ? (
        <span>{label}: {displayValue}/10</span>
      ) : (
        <>
          <Star className={`h-3 w-3 ${colorClass} ${value ? 'fill-current' : ''}`} />
          <span>{displayValue}/10</span>
        </>
      )}
      {hasCorrected && <Check className="h-2.5 w-2.5 text-emerald-400" />}
      <Pencil className="h-2.5 w-2.5 opacity-40" />
    </button>
  );
}
