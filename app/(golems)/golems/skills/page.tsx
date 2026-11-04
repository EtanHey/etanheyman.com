import Link from "next/link";
import SkillLedger from "../components/SkillLedger";
import type { LedgerRow } from "../components/LedgerTable";
import {
  evidenceTotals,
  formatDay,
  manifestGeneratedAt,
  manifestSkills,
} from "../lib/skill-evidence";

const categories = [...new Set(manifestSkills.map((s) => s.category))].sort();

export const metadata = {
  title: "Skills Library — Golems",
  description: `${manifestSkills.length} reusable Claude Code skills, each with its eval status and install command.`,
};

export default function SkillsIndexPage() {
  // Rows are computed on the server so the large manifest never ships to the
  // browser; the client filter only receives these small records.
  const rows: LedgerRow[] = manifestSkills.map((s) => ({
    name: s.name,
    command: s.command,
    summary: s.description,
    category: s.category,
    evalCount: s.evalCount,
    hasFixtures: s.hasFixtures,
    updated: formatDay(s.lastModified),
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 md:px-6 md:pt-16">
      <header className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <h1 className="font-g-display text-[2.4rem] leading-[1.05] md:text-[3.4rem]">
            The skill ledger
          </h1>
          <p className="mt-4 max-w-[60ch] text-[1.05rem] leading-relaxed text-g-ash md:text-[1.15rem]">
            Every published skill in <code className="font-g-mono text-[0.9em] text-g-ink">skills/golem-powers</code>,
            generated on {formatDay(manifestGeneratedAt)}. Descriptions are the
            skills&apos; own trigger text, written for agents. Open a skill for
            a readable overview, its eval status, and how to install it.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-4 border-t-2 border-g-ink pt-4 text-sm text-g-ash">
          <div className="flex flex-col-reverse">
            <dt className="mt-1.5">skills</dt>
            <dd className="font-g-display text-[2rem] leading-none text-g-ink">{evidenceTotals.skills}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="mt-1.5">with scenarios written</dt>
            <dd className="flex items-center gap-2 font-g-display text-[2rem] leading-none text-g-ink">
              {evidenceTotals.withSuite}
              <span aria-hidden="true" className="g-mark g-mark-written" />
            </dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="mt-1.5">with fixtures</dt>
            <dd className="flex items-center gap-2 font-g-display text-[2rem] leading-none text-g-ink">
              {evidenceTotals.withFixtures}
              <span aria-hidden="true" className="g-mark g-mark-fixtures" />
            </dd>
          </div>
        </dl>
      </header>

      <p className="mb-8 flex items-start gap-3 rounded-lg bg-g-raised px-4 py-3 text-[0.95rem] leading-relaxed text-g-ink">
        <span aria-hidden="true" className="g-mark g-mark-pending mt-1.5" />
        <span>
          No skill has results on current models yet, so this ledger lists
          written scenarios, not scores.{" "}
          <Link href="/golems#ladder-heading" className="g-link">
            How a skill earns a score
          </Link>
        </span>
      </p>

      <SkillLedger rows={rows} categories={categories} />

      <p className="mt-10 text-[0.95rem] text-g-ash">
        Looking for retired tools and foundational loops?{" "}
        <Link href="/golems/docs/heritage/ralph" className="g-link">
          Visit Heritage
        </Link>
        .
      </p>
    </div>
  );
}
