'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

type ActionPriority = 'urgent' | 'soon' | 'info';

type ActionItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  priority: ActionPriority;
  href?: string;
  actionLabel?: string;
  onAction?: () => void;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
};

const priorityStyles: Record<ActionPriority, { container: string; icon: string; badge: string }> = {
  urgent: {
    container: 'border-red-500/30 bg-red-500/10',
    icon: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  soon: {
    container: 'border-amber-500/30 bg-amber-500/10',
    icon: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  info: {
    container: 'border-blue-500/30 bg-blue-500/10',
    icon: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
};

export function ActionItem({
  icon,
  title,
  description,
  priority,
  href,
  actionLabel,
  onAction,
  checked = false,
  onCheck,
}: ActionItemProps) {
  const styles = priorityStyles[priority];
  const isChecked = Boolean(checked);
  const content = (
    <div className={`rounded-xl border p-4 transition-colors hover:bg-white/5 ${styles.container} ${isChecked ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${styles.icon}`}>{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-sm font-semibold ${isChecked ? 'text-white/60 line-through' : 'text-white'}`}>
              {title}
            </h3>
            <div className="flex items-center gap-2">
              {onCheck && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onCheck(!isChecked);
                  }}
                  aria-pressed={isChecked}
                  aria-label={isChecked ? 'Mark action item as not done' : 'Mark action item as done'}
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                    isChecked
                      ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </button>
              )}
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>
                {priority}
              </span>
            </div>
          </div>
          <p className={`text-xs mt-1 ${isChecked ? 'text-white/40' : 'text-white/60'}`}>{description}</p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAction(); }}
              className={`mt-2 inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${styles.badge} hover:bg-white/10`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
