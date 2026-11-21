"use client";

import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import LedgerTable, { type LedgerRow } from "./LedgerTable";

type SuiteFilter = "all" | "written" | "none";

const suiteOptions: { value: SuiteFilter; label: string }[] = [
  { value: "all", label: "Any" },
  { value: "written", label: "Scenarios written" },
  { value: "none", label: "No suite yet" },
];

// Filtering is instant and unanimated: it runs on every keystroke.
export default function SkillLedger({
  rows,
  categories,
}: {
  rows: LedgerRow[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [suite, setSuite] = useState<SuiteFilter>("all");
  const searchId = useId();
  const categoryId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (category !== "All" && row.category !== category) return false;
      if (suite === "written" && row.evalCount === 0) return false;
      if (suite === "none" && row.evalCount > 0) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q)
      );
    });
  }, [rows, query, category, suite]);

  const filtersActive = query !== "" || category !== "All" || suite !== "all";

  return (
    <div>
      <div className="mb-6 grid gap-4 border-y border-g-rule py-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
        <div>
          <label htmlFor={searchId} className="mb-1.5 block text-sm text-g-ash">
            Search names and descriptions
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-g-ash" />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. review, plan, cmux"
              className="min-h-11 w-full rounded-md border border-g-edge bg-g-raised pr-3 pl-9 text-[0.97rem] text-g-ink placeholder:text-g-ash focus-visible:border-g-cobalt"
            />
          </div>
        </div>
        <div>
          <label htmlFor={categoryId} className="mb-1.5 block text-sm text-g-ash">
            Category
          </label>
          <select
            id={categoryId}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-11 w-full rounded-md border border-g-edge bg-g-raised px-3 text-[0.97rem] text-g-ink lg:w-56"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend className="mb-1.5 text-sm text-g-ash">Eval suite</legend>
          <div className="flex rounded-md border border-g-edge bg-g-raised p-0.5">
            {suiteOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[5px] px-3 text-[0.9rem] whitespace-nowrap transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-g-cobalt ${
                  suite === opt.value ? "bg-g-ink text-g-slip" : "text-g-ink hover:bg-g-slip"
                }`}
              >
                <input
                  type="radio"
                  name="suite-filter"
                  value={opt.value}
                  checked={suite === opt.value}
                  onChange={() => setSuite(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mb-3 flex items-center justify-between gap-4 text-sm text-g-ash">
        <p aria-live="polite">
          Showing <span className="g-tabular text-g-ink">{filtered.length}</span> of{" "}
          <span className="g-tabular">{rows.length}</span> skills
        </p>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setSuite("all");
            }}
            className="g-press g-link min-h-11 rounded-sm"
          >
            Clear filters
          </button>
        )}
      </div>

      <LedgerTable rows={filtered} caption="All published skills" showCategory />
    </div>
  );
}
