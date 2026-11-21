"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface OverviewCollapsibleProps {
  summary: ReactNode;
  rest: ReactNode;
  hasMore: boolean;
}

export default function OverviewCollapsible({
  summary,
  rest,
  hasMore,
}: OverviewCollapsibleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* Summary — always visible */}
      <div className="golems-prose">{summary}</div>

      {hasMore && (
        <>
          {/* Expandable rest of content */}
          {expanded && <div className="golems-prose mt-6">{rest}</div>}

          {/* Toggle button */}
          <button
            onClick={() => setExpanded(!expanded)}
            type="button"
            aria-expanded={expanded}
            className="g-press mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-g-ink px-4 text-[0.95rem] font-medium text-g-ink hover:bg-g-raised"
          >
            {expanded ? "Show less" : "Show full documentation"}
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-200 ease-[var(--ease-g-out)] ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </>
      )}
    </div>
  );
}
