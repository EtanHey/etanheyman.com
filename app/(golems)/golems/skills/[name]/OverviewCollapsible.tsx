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
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#e5950025] bg-[#e5950008] px-4 py-2.5 text-sm font-medium text-[#e59500] transition-colors hover:border-[#e5950040] hover:bg-[#e5950012]"
          >
            {expanded ? "Show less" : "Show full documentation"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </>
      )}
    </div>
  );
}
