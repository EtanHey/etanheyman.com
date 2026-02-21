"use client";

import { useRef, useEffect, useState } from "react";
import type { ProjectStat } from "../project-showcase-config";

export function StatsBar({
  stats,
  accentColor,
}: {
  stats: ProjectStat[];
  accentColor: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      {stats.map((stat, i) => (
        <StatItem key={i} stat={stat} accentColor={accentColor} delay={i * 150} />
      ))}
    </div>
  );
}

function StatItem({
  stat,
  accentColor,
  delay,
}: {
  stat: ProjectStat;
  accentColor: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1400;
          const start = performance.now();
          const target = stat.value;

          function tick(now: number) {
            const elapsed = now - start - delay;
            if (elapsed < 0) {
              requestAnimationFrame(tick);
              return;
            }
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, stat.value, delay]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-6"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          background: `radial-gradient(ellipse at top, ${accentColor}, transparent 70%)`,
        }}
      />
      <div className="relative">
        <div className="font-[Nutmeg] text-[32px] font-bold leading-none tracking-tight text-white md:text-[44px]">
          {stat.prefix}
          {count.toLocaleString()}
          <span style={{ color: accentColor }}>{stat.suffix}</span>
        </div>
        <div className="mt-2 font-mono text-[11px] tracking-wide text-white/40 uppercase md:text-[12px]">
          {stat.label}
        </div>
      </div>
    </div>
  );
}
