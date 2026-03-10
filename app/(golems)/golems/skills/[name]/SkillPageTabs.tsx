"use client";

import { useState, type ReactNode } from "react";

interface SkillPageTabsProps {
  overviewContent: ReactNode;
  rawContent: ReactNode;
  evalContent: ReactNode | null;
}

export default function SkillPageTabs({
  overviewContent,
  rawContent,
  evalContent,
}: SkillPageTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "skill-md", label: "SKILL.md" },
    ...(evalContent ? [{ id: "eval-results", label: "Eval Results" }] : []),
  ];

  const panels = [
    overviewContent,
    rawContent,
    ...(evalContent ? [evalContent] : []),
  ];

  return (
    <div>
      {/* Tab navigation — sticky below header */}
      <div
        className="sticky top-12 z-10 -mx-4 mb-6 flex gap-1 border-b border-[#e5950020] bg-[#0c0b0a]/95 px-4 backdrop-blur-sm md:-mx-6 md:px-6"
        role="tablist"
        aria-label="Skill content"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={i === activeTab}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(i)}
            type="button"
            className={`relative min-h-[44px] px-4 py-3 text-sm font-medium transition-colors ${
              i === activeTab
                ? "text-[#e59500] after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-[#e59500]"
                : "text-[#a89078] hover:text-[#c0b8a8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels — all pre-rendered for SEO, hidden via CSS */}
      {panels.map((content, i) => (
        <div
          key={tabs[i].id}
          role="tabpanel"
          id={`panel-${tabs[i].id}`}
          aria-labelledby={`tab-${tabs[i].id}`}
          className={i === activeTab ? "" : "hidden"}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
