"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

/* ── Types ────────────────────────────────────────────────── */

export interface TerminalTab {
  id: string;
  label: string;
  emoji?: string;
  lines: string[];
}

export interface TerminalShowcaseProps {
  tabs: TerminalTab[];
  /** Window title bar text */
  title?: string;
  /** Accent hex color, e.g. "#6366F1" */
  accentColor?: string;
  /** Height class for the content area */
  heightClass?: string;
  /** Autoplay interval in ms (0 = disabled) */
  autoplayMs?: number;
  /** Cursor character */
  cursor?: string;
}

/* ── ANSI escape-code parser ──────────────────────────────── */

const COLOR_MAP: Record<string, string> = {
  "0": "",
  "1": "",       // bold — handled via font-weight
  "2": "",       // dim
  "3": "",       // italic
  "31": "#ff5555",
  "32": "#28c840",
  "33": "#e59500",
  "34": "#6ab0f3",
  "35": "#c678dd",
  "36": "#40d4d4",
  "37": "#c0c0c0",
  "90": "#666666",
  "91": "#ff6e6e",
  "92": "#50fa7b",
  "93": "#f1fa8c",
  "94": "#8be9fd",
  "95": "#ff79c6",
  "96": "#8be9fd",
};

function renderAnsiLine(raw: string): ReactNode {
  const parts: ReactNode[] = [];
  let key = 0;
  const regex = /\x1b\[(\d+(?:;\d+)*)m/g;
  let lastIndex = 0;
  let currentColor = "";
  let bold = false;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = raw.slice(lastIndex, match.index);
      const style: React.CSSProperties = {};
      if (currentColor) style.color = currentColor;
      if (bold) style.fontWeight = 700;
      parts.push(
        Object.keys(style).length > 0
          ? <span key={key++} style={style}>{text}</span>
          : <span key={key++}>{text}</span>,
      );
    }

    // Handle compound codes like \x1b[1;33m
    const codes = match[1].split(";");
    for (const code of codes) {
      if (code === "0") {
        currentColor = "";
        bold = false;
      } else if (code === "1") {
        bold = true;
      } else if (COLOR_MAP[code]) {
        currentColor = COLOR_MAP[code];
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    const text = raw.slice(lastIndex);
    const style: React.CSSProperties = {};
    if (currentColor) style.color = currentColor;
    if (bold) style.fontWeight = 700;
    parts.push(
      Object.keys(style).length > 0
        ? <span key={key++} style={style}>{text}</span>
        : <span key={key++}>{text}</span>,
    );
  }

  return parts.length > 0 ? parts : raw;
}

/* ── Component ────────────────────────────────────────────── */

export function TerminalShowcase({
  tabs,
  title = "terminal",
  accentColor = "#6366F1",
  heightClass = "h-[260px] sm:h-[340px] md:h-[380px]",
  autoplayMs = 6000,
  cursor = "_",
}: TerminalShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoplayMs > 0 && tabs.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % tabs.length);
      }, autoplayMs);
    }
  }, [autoplayMs, tabs.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index);
      startAutoplay();
    },
    [startAutoplay],
  );

  const currentTab = tabs[activeTab];
  if (!currentTab) return null;

  // Derive dim accent for borders/backgrounds
  const accentDim = `${accentColor}26`; // 15% opacity
  const accentFaint = `${accentColor}0f`; // 6% opacity

  return (
    <div
      className="rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]"
      style={{
        border: `1px solid ${accentDim}`,
        backgroundColor: "#0d0d0d",
      }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center px-3 py-2 gap-2"
        style={{
          backgroundColor: "#1a1a1a",
          borderBottom: `1px solid ${accentFaint}`,
        }}
      >
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] block" />
        </div>
        <span className="font-mono text-[0.72rem] text-[#555] flex-1 text-center">
          {title}
        </span>
        <div className="w-12" />
      </div>

      {/* ── Tab bar (only if multiple tabs) ── */}
      {tabs.length > 1 && (
        <div
          className="flex overflow-x-auto scrollbar-none"
          style={{
            backgroundColor: "#141414",
            borderBottom: `1px solid ${accentFaint}`,
          }}
          role="tablist"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[0.72rem] font-mono cursor-pointer whitespace-nowrap transition-colors border-b-2"
              style={{
                color: i === activeTab ? accentColor : "#666",
                borderBottomColor: i === activeTab ? accentColor : "transparent",
                backgroundColor: i === activeTab ? accentFaint : "transparent",
              }}
              onMouseEnter={(e) => {
                if (i !== activeTab) {
                  e.currentTarget.style.color = "#999";
                  e.currentTarget.style.backgroundColor = `${accentColor}07`;
                }
              }}
              onMouseLeave={(e) => {
                if (i !== activeTab) {
                  e.currentTarget.style.color = "#666";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
              onClick={() => handleTabChange(i)}
              type="button"
              role="tab"
              aria-selected={i === activeTab}
            >
              {t.emoji && <span className="text-[0.8rem]">{t.emoji}</span>}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Terminal content ── */}
      <div
        className={`p-4 md:px-5 font-mono text-xs md:text-[0.76rem] leading-relaxed text-[#c0c0c0] overflow-y-auto overflow-x-hidden scrollbar-none ${heightClass}`}
        role="tabpanel"
      >
        <div className="overflow-hidden">
          {currentTab.lines.map((line, i) => (
            <div
              key={`${activeTab}-${i}`}
              className="whitespace-pre-wrap break-words md:whitespace-pre md:break-normal opacity-0 animate-[lineReveal_0.3s_ease_forwards]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {line === "" ? "\u00A0" : renderAnsiLine(line)}
            </div>
          ))}
        </div>
        <div
          className="animate-[blink_1s_step-end_infinite] inline-block mt-1"
          style={{ color: accentColor }}
        >
          {cursor}
        </div>
      </div>
    </div>
  );
}
