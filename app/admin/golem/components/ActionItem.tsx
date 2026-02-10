'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

type ActionPriority = 'urgent' | 'soon' | 'info';

type ActionItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  priority: ActionPriority;
  href?: string;
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

export function ActionItem({ icon, title, description, priority, href }: ActionItemProps) {
  const styles = priorityStyles[priority];
  const content = (
    <div className={`rounded-xl border p-4 transition-colors hover:bg-white/5 ${styles.container}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${styles.icon}`}>{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>
              {priority}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">{description}</p>
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
