"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  code: string;
  language: string;
  caption?: string;
  accentColor: string;
  accentColorRgb: string;
  highlightedHtml?: string;
}

export function ArchCodeBlock({
  code,
  language,
  caption,
  accentColor,
  accentColorRgb,
  highlightedHtml,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

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
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border transition-all duration-500"
      style={{
        borderColor: `rgba(${accentColorRgb}, 0.12)`,
        backgroundColor: "#080828",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between border-b px-4 py-2"
        style={{ borderColor: `rgba(${accentColorRgb}, 0.08)` }}
      >
        <span className="font-mono text-[11px] text-white/30">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-white/30 transition-colors hover:text-white/55"
        >
          {copied ? (
            <Check className="h-3 w-3" style={{ color: accentColor }} />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="font-mono text-[10px]">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>

      {/* Code */}
      <div className="p-5">
        {highlightedHtml ? (
          <div
            className="overflow-x-auto font-mono text-[12px] leading-relaxed md:text-[13px] [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-white/70 md:text-[13px]">
            <code>{code}</code>
          </pre>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <div
          className="border-t px-4 py-2.5"
          style={{
            borderColor: `rgba(${accentColorRgb}, 0.08)`,
            backgroundColor: `rgba(${accentColorRgb}, 0.03)`,
          }}
        >
          <p className="font-mono text-[11px] text-white/35">{caption}</p>
        </div>
      )}
    </div>
  );
}
