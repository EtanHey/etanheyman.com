'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, RefreshCw } from 'lucide-react';

type ListDetailLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
  hasSelection: boolean;
  emptyIcon: LucideIcon;
  emptyText: string;
  emptySubtext?: string;
  loading: boolean;
  onBack?: () => void;
  listWidth?: string;
};

export function ListDetailLayout({
  list,
  detail,
  hasSelection,
  emptyIcon: EmptyIcon,
  emptyText,
  emptySubtext,
  loading,
  onBack,
  listWidth = 'md:w-[400px]',
}: ListDetailLayoutProps) {
  return (
    <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
      <div className={`${hasSelection ? 'hidden md:flex' : 'flex'} w-full ${listWidth} md:shrink-0 flex-col min-h-0 md:border-r md:border-white/10 md:pr-4`}>
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
            </div>
          ) : (
            list
          )}
        </div>
      </div>

      <div className={`${hasSelection ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
        {hasSelection ? (
          <div className="h-full flex flex-col bg-white/5 rounded-lg border border-white/10 p-5 md:p-6 overflow-hidden">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="md:hidden shrink-0 flex items-center gap-2 text-white/60 mb-4 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to list
              </button>
            )}
            {detail}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/40 bg-white/[0.02] rounded-lg border border-white/5">
            <EmptyIcon className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg">{emptyText}</p>
            {emptySubtext && <p className="text-sm mt-1">{emptySubtext}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
