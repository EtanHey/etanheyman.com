'use client';

import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';

type CategoryBadgeProps = {
  value: string;
  options: string[];
  colors: Record<string, string>;
  onSave: (category: string) => Promise<void>;
  hasCorrected?: boolean;
};

export function CategoryBadge({ value, options, colors, onSave, hasCorrected }: CategoryBadgeProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const displayValue = value || options[0] || 'other';
  const colorClass = colors[displayValue] || colors.other || 'bg-white/10 text-white/60 border-white/10';

  const handleSave = async (nextValue: string) => {
    setSaving(true);
    try {
      await onSave(nextValue);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <select
          value={displayValue}
          onChange={(event) => handleSave(event.target.value)}
          autoFocus
          onBlur={() => !saving && setEditing(false)}
          disabled={saving}
          className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-xs text-white focus:outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 transition-all hover:border-white/40 ${colorClass}`}
    >
      {displayValue}
      {hasCorrected && <Check className="h-2.5 w-2.5 text-emerald-400" />}
      <Pencil className="h-2.5 w-2.5 opacity-40" />
    </button>
  );
}
