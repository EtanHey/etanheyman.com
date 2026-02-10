'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type Metric = {
  label: string;
  value: string | number;
};

type GolemCardProps = {
  icon: LucideIcon;
  title: string;
  metrics: Metric[];
  href: string;
  borderColor: string;
};

export function GolemCard({ icon: Icon, title, metrics, href, borderColor }: GolemCardProps) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border border-white/10 border-l-4 ${borderColor} bg-white/5 p-4 transition-colors hover:bg-white/10`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-white/80" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">View</span>
      </div>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between text-xs">
            <span className="text-white/50">{metric.label}</span>
            <span className="text-white font-medium tabular-nums">{metric.value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}
