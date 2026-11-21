"use client";

import { useState } from "react";
import LedgerTable, { type LedgerRow } from "./LedgerTable";

// Filter chips for the landing ledger excerpt. Switching is instant: people
// flip between groups quickly, so only colour transitions, no movement.
export default function ShowcaseTabs({
  groups,
}: {
  groups: { group: string; rows: LedgerRow[] }[];
}) {
  const [active, setActive] = useState("All");
  const options = ["All", ...groups.map((g) => g.group)];
  const rows =
    active === "All"
      ? groups.flatMap((g) => g.rows)
      : groups.find((g) => g.group === active)?.rows ?? [];

  return (
    <div>
      <div role="group" aria-label="Filter skills by purpose" className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {options.map((option) => {
          const selected = option === active;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(option)}
              className={`g-press min-h-11 shrink-0 rounded-full border px-4 text-[0.92rem] ${
                selected
                  ? "border-g-ink bg-g-ink text-g-slip"
                  : "border-g-edge text-g-ink hover:bg-g-raised"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <LedgerTable
        rows={rows}
        caption={`Featured skills${active === "All" ? "" : `: ${active}`}, with eval scenarios and fixtures from the manifest`}
      />
    </div>
  );
}
