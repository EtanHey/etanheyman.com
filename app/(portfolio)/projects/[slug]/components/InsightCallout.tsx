"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";

interface Props {
  title: string;
  text: string;
  accentColor: string;
  accentColorRgb: string;
}

export function InsightCallout({
  title,
  text,
  accentColor,
  accentColorRgb,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        backgroundColor: `rgba(${accentColorRgb}, 0.04)`,
        borderWidth: 1,
        borderColor: `rgba(${accentColorRgb}, 0.12)`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute top-0 left-0 h-full w-[3px]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="px-6 py-5">
        <div className="mb-2 flex items-center gap-2.5">
          <Lightbulb
            className="h-3.5 w-3.5 flex-shrink-0"
            style={{ color: accentColor }}
          />
          <span
            className="font-mono text-[11px] tracking-[0.15em] uppercase"
            style={{ color: accentColor }}
          >
            {title}
          </span>
        </div>
        <p className="font-[Nutmeg] text-[14px] font-light leading-relaxed text-white/60 md:text-[15px]">
          {text}
        </p>
      </div>
    </div>
  );
}
