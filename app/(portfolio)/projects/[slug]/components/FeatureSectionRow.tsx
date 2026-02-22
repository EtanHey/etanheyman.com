"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Cpu,
  Wrench,
  Brain,
  Database,
  FileText,
  Mic,
  Radio,
  Lock,
  Volume2,
  Zap,
  Bot,
  Binary,
  Moon,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import type { FeatureSection } from "../features-config";
import { ArchCodeBlock } from "./ArchCodeBlock";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Cpu,
  Wrench,
  Brain,
  Database,
  FileText,
  Mic,
  Radio,
  Lock,
  Volume2,
  Zap,
  Bot,
  Binary,
  Moon,
  Cloud,
};

interface Props {
  section: FeatureSection;
  index: number;
  accentColor: string;
  accentColorRgb: string;
  codeHighlightedHtml?: string;
}

export function FeatureSectionRow({
  section,
  index,
  accentColor,
  accentColorRgb,
  codeHighlightedHtml,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isReversed = index % 2 === 1;

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
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Icon = ICON_MAP[section.iconName];

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-8 md:gap-12 ${
        isReversed ? "md:flex-row-reverse" : "md:flex-row"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 600ms ease-out, transform 600ms ease-out",
      }}
    >
      {/* Text side */}
      <div className="min-w-0 flex-1">
        {/* Icon + number */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `rgba(${accentColorRgb}, 0.1)` }}
          >
            {Icon && (
              <Icon className="h-5 w-5" style={{ color: accentColor }} />
            )}
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: `rgba(${accentColorRgb}, 0.4)` }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title + tagline */}
        <h2 className="mb-2 font-[Nutmeg] text-[20px] font-bold text-white md:text-[26px]">
          {section.title}
        </h2>
        <p
          className="mb-4 font-mono text-[12px] tracking-wide"
          style={{ color: `rgba(${accentColorRgb}, 0.6)` }}
        >
          {section.tagline}
        </p>

        {/* Description */}
        <p className="max-w-[520px] font-[Nutmeg] text-[14px] font-light leading-relaxed text-white/50 md:text-[15px]">
          {section.description}
        </p>
      </div>

      {/* Visual side */}
      <div className="min-w-0 flex-1">
        {section.codeExample && (
          <ArchCodeBlock
            code={section.codeExample.code}
            language={section.codeExample.language}
            caption={section.codeExample.caption}
            accentColor={accentColor}
            accentColorRgb={accentColorRgb}
            highlightedHtml={codeHighlightedHtml}
          />
        )}

        {section.highlights && !section.codeExample && (
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: `rgba(${accentColorRgb}, 0.1)`,
              backgroundColor: `rgba(${accentColorRgb}, 0.03)`,
            }}
          >
            <ul className="space-y-3">
              {section.highlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-mono text-[12px] leading-relaxed text-white/50 md:text-[13px]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: "opacity 400ms",
                    transitionDelay: `${i * 60 + 300}ms`,
                  }}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: `rgba(${accentColorRgb}, 0.4)` }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
