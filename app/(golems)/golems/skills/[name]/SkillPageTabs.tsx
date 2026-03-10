"use client";

import { useState, useMemo, type ReactNode } from "react";

interface SkillPageTabsProps {
  overviewContent: ReactNode;
  rawContent: ReactNode;
  evalContent: ReactNode | null;
}

interface TabEntry {
  id: string;
  label: string;
  content: ReactNode;
}

export default function SkillPageTabs({
  overviewContent,
  rawContent,
  evalContent,
}: SkillPageTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const entries: TabEntry[] = useMemo(() => {
    const result: TabEntry[] = [
      { id: "overview", label: "Overview", content: overviewContent },
      { id: "skill-md", label: "SKILL.md", content: rawContent },
    ];
    if (evalContent) {
      result.push({
        id: "eval-results",
        label: "Eval Results",
        content: evalContent,
      });
    }
    return result;
  }, [overviewContent, rawContent, evalContent]);

  // Clamp active tab if entries shrink (e.g. evalContent removed)
  const safeActive = activeTab < entries.length ? activeTab : 0;

  return (
    <div>
      {/* Tab navigation — sticky below header */}
      <div
        className="sticky top-12 z-10 -mx-4 mb-6 flex gap-1 border-b border-[#e5950020] bg-[#0c0b0a]/95 px-4 backdrop-blur-sm md:-mx-6 md:px-6"
        role="tablist"
        aria-label="Skill content"
      >
        {entries.map((entry, i) => (
          <button
            key={entry.id}
            role="tab"
            id={`tab-${entry.id}`}
            aria-selected={i === safeActive}
            aria-controls={`panel-${entry.id}`}
            onClick={() => setActiveTab(i)}
            type="button"
            className={`relative min-h-[44px] px-4 py-3 text-sm font-medium transition-colors ${
              i === safeActive
                ? "text-[#e59500] after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-[#e59500]"
                : "text-[#b0a89c] hover:text-[#c0b8a8]"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {/* Tab panels — all pre-rendered for SEO, hidden via CSS */}
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          role="tabpanel"
          id={`panel-${entry.id}`}
          aria-labelledby={`tab-${entry.id}`}
          className={i === safeActive ? "" : "hidden"}
        >
          {entry.content}
        </div>
      ))}
    </div>
  );
}
