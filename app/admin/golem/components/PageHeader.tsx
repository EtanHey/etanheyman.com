'use client';

import type { LucideIcon } from 'lucide-react';
import { RefreshCw } from 'lucide-react';

type PageHeaderProps = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  count?: number;
  onRefresh: () => void;
  loading: boolean;
  children?: React.ReactNode;
};

export function PageHeader({ icon: Icon, iconColor, title, count, onRefresh, loading, children }: PageHeaderProps) {
  return (
    <div className="shrink-0 flex items-center justify-between pb-4">
      <h1 className="text-lg font-semibold text-white flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
        {count !== undefined && (
          <span className="text-sm font-normal text-white/40">({count})</span>
        )}
      </h1>
      <div className="flex items-center gap-2">
        {children}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}
