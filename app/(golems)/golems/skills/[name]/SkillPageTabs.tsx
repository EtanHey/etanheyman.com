"use client";

import { useState, useMemo, useRef, type ReactNode, type KeyboardEvent } from "react";

interface SkillPageTabsProps {
  overviewContent: ReactNode;
  rawContent: ReactNode;
  evalContent: ReactNode | null;
  recordContent: ReactNode | null;
}

interface TabEntry {
  id: string;
  label: string;
  content: ReactNode;
}

// ARIA tabs with roving focus: arrow keys, Home and End move between tabs.
// Switching is instant (people flip tabs often), only the underline colour eases.
export default function SkillPageTabs({
  overviewContent,
  rawContent,
  evalContent,
  recordContent,
}: SkillPageTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const entries: TabEntry[] = useMemo(() => {
    const result: TabEntry[] = [
      { id: "overview", label: "Overview", content: overviewContent },
      { id: "skill-md", label: "SKILL.md", content: rawContent },
    ];
    if (evalContent) result.push({ id: "eval-status", label: "Eval status", content: evalContent });
    if (recordContent) result.push({ id: "record", label: "Record", content: recordContent });
    return result;
  }, [overviewContent, rawContent, evalContent, recordContent]);

  const safeActive = activeTab < entries.length ? activeTab : 0;

  const focusTab = (index: number) => {
    const next = (index + entries.length) % entries.length;
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight") focusTab(i + 1);
    else if (e.key === "ArrowLeft") focusTab(i - 1);
    else if (e.key === "Home") focusTab(0);
    else if (e.key === "End") focusTab(entries.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div
        className="scrollbar-none sticky top-14 z-10 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-g-rule bg-g-slip/95 px-4 backdrop-blur-md md:mx-0 md:px-0"
        role="tablist"
        aria-label="Skill content"
      >
        {entries.map((entry, i) => {
          const selected = i === safeActive;
          return (
            <button
              key={entry.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${entry.id}`}
              aria-selected={selected}
              aria-controls={`panel-${entry.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              type="button"
              className={`relative min-h-12 shrink-0 px-3 text-[0.95rem] whitespace-nowrap transition-colors duration-150 after:absolute after:right-3 after:bottom-[-1px] after:left-3 after:h-[2px] after:transition-colors after:duration-150 ${
                selected
                  ? "font-medium text-g-ink after:bg-g-cobalt"
                  : "text-g-ash after:bg-transparent hover:text-g-ink"
              }`}
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels — all pre-rendered for SEO, hidden via CSS */}
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          role="tabpanel"
          id={`panel-${entry.id}`}
          aria-labelledby={`tab-${entry.id}`}
          tabIndex={0}
          className={`rounded-sm focus-visible:outline-offset-8 ${i === safeActive ? "" : "hidden"}`}
        >
          {entry.content}
        </div>
      ))}
    </div>
  );
}
