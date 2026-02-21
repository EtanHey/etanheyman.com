"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 268, suffix: "K+", label: "Memory chunks indexed" },
  { value: 21, label: "MCP tools shipped" },
  { value: 150, suffix: "+", label: "PRs merged in weeks" },
  { value: 10, label: "Packages in monorepo" },
  { value: 7, label: "Domain AI agents" },
  { value: 3, label: "Open source products" },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function ShowcaseStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 1600;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      setCounts(STATS.map((s) => Math.round(eased * s.value)));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6"
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center transition-all"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transitionDelay: `${i * 80}ms`,
            transitionDuration: "500ms",
          }}
        >
          <div className="mb-1 font-mono text-[28px] font-bold leading-none text-white md:text-[32px]">
            {counts[i]}
            {stat.suffix && (
              <span className="text-[#0F82EB]">{stat.suffix}</span>
            )}
          </div>
          <div className="font-mono text-[10px] tracking-wide text-white/30 uppercase">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
