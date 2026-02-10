'use client';

import { formatRelativeTime } from '../lib/format';

type ServiceStatusProps = {
  name: string;
  lastRun: string | null;
  duration: number | null;
  status: string;
  expectedIntervalHours: number;
};

function getStatusColor(status: string, isStale: boolean) {
  const normalized = status.toLowerCase();
  if (normalized.includes('fail') || normalized.includes('error')) {
    return 'bg-red-400';
  }
  if (isStale) return 'bg-amber-400';
  return 'bg-emerald-400';
}

export function ServiceStatus({ name, lastRun, duration, status, expectedIntervalHours }: ServiceStatusProps) {
  const isStale = lastRun
    ? Date.now() - new Date(lastRun).getTime() > expectedIntervalHours * 60 * 60 * 1000
    : true;
  const dotColor = getStatusColor(status, isStale);
  const durationSeconds = duration != null ? (duration / 1000).toFixed(1) : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor} ${isStale ? 'animate-pulse' : ''}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-white/50 mt-1 flex items-center gap-2">
            <span>{lastRun ? formatRelativeTime(lastRun) : 'never'}</span>
            {durationSeconds && <span>· {durationSeconds}s</span>}
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          {status || 'unknown'}
        </span>
      </div>
    </div>
  );
}
