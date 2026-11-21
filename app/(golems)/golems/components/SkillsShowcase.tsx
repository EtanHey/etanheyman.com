import Link from "next/link";
import skillsManifest from "../lib/skills-manifest.json";
import { formatDay, type ManifestSkill } from "../lib/skill-evidence";
import type { LedgerRow } from "./LedgerTable";
import ShowcaseTabs from "./ShowcaseTabs";

/* ── Curated groups for the landing page ─────────────────────── */

interface SkillEntry {
  name: string;
  command: string;
  description: string;
  category: string;
}

// AIDEV-NOTE: Plain-language summaries of each skill's manifest description,
// grouped by what a reader wants to do. Eval numbers are never written here;
// they come from the manifest at render time. Mixes skills with and without
// eval suites on purpose so the landing page shows the honest spread.
const CURATED_SKILLS: Record<string, SkillEntry[]> = {
  "Ship code": [
    { name: "pr-loop", command: "/pr-loop", category: "Ship code", description: "Runs the pull-request loop: branch, commit, push, review, merge, and CI fixes." },
    { name: "git-guardian", command: "/git-guardian", category: "Ship code", description: "Stops destructive git commands such as force-push, reset, or branch delete until they are confirmed." },
    { name: "coderabbit", command: "/coderabbit", category: "Ship code", description: "Works through review feedback from CodeRabbit, Greptile, Bugbot, and GitHub." },
  ],
  "Run agents": [
    { name: "cmux-agents", command: "/cmux-agents", category: "Run agents", description: "Spawns visible AI workers in cmux terminal panes and coordinates them." },
    { name: "large-plan", command: "/large-plan", category: "Run agents", description: "Turns a large task into a phased plan, with a separate evaluator checking each phase." },
    { name: "session-handoff", command: "/session-handoff", category: "Run agents", description: "Writes a handoff and starts a successor session when context runs high." },
  ],
  "Check the work": [
    { name: "never-fabricate", command: "/never-fabricate", category: "Check the work", description: "Requires reading, running, and verifying before any done or green claim." },
    { name: "skill-creator", command: "/skill-creator", category: "Check the work", description: "Creates, edits, audits, and evaluates Golems skills." },
    { name: "deploy-verify", command: "/deploy-verify", category: "Check the work", description: "Probes deployed services after a merge or restart." },
  ],
  "Think and write": [
    { name: "grill-me", command: "/grill-me", category: "Think and write", description: "Interviews you about a design to stress-test it before you build." },
    { name: "unslop", command: "/unslop", category: "Think and write", description: "Tightens verbose text without losing numbers, paths, or hedges." },
    { name: "eli5", command: "/eli5", category: "Think and write", description: "Explains an unfamiliar topic quickly, for a smart adult." },
  ],
};

const publishedSkills = skillsManifest.skills as unknown as Record<string, ManifestSkill>;

// AIDEV-NOTE: Only skills with a published /golems/skills page are shown, so a
// skill archived in golems drops off the showcase on the next manifest regen.
export const SKILL_CATEGORIES: Record<string, SkillEntry[]> =
  Object.fromEntries(
    Object.entries(CURATED_SKILLS)
      .map(([category, entries]) => [
        category,
        entries.filter((s) => s.name in publishedSkills),
      ])
      .filter(([, entries]) => entries.length > 0),
  );

function toRow(entry: SkillEntry): LedgerRow {
  const skill = publishedSkills[entry.name];
  return {
    name: entry.name,
    command: entry.command,
    summary: entry.description,
    category: entry.category,
    evalCount: skill.evalCount,
    hasFixtures: skill.hasFixtures,
    updated: formatDay(skill.lastModified),
  };
}

/* ── Landing showcase ─────────────────────────────────────────── */

export default function SkillsShowcase() {
  const groups = Object.entries(SKILL_CATEGORIES).map(([group, entries]) => ({
    group,
    rows: entries.map(toRow),
  }));

  return (
    <section id="skills" aria-labelledby="skills-heading" className="border-t border-g-rule">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 id="skills-heading" className="font-g-display text-[2rem] leading-tight md:text-[2.75rem]">
              From the skill ledger
            </h2>
            <p className="mt-3 max-w-[60ch] text-[1.05rem] leading-relaxed text-g-ash">
              {groups.reduce((n, g) => n + g.rows.length, 0)} of the{" "}
              {skillsManifest.skillCount} published skills, picked
              by what you want an agent to do. The eval columns come straight from
              each skill&apos;s <code className="font-g-mono text-[0.9em]">evals/evals.json</code>.
            </p>
          </div>
          <Link
            href="/golems/skills"
            className="g-press inline-flex min-h-11 items-center self-start rounded-md border border-g-ink px-4 text-[0.95rem] font-medium hover:bg-g-ink hover:text-g-slip md:self-auto"
          >
            Open all {skillsManifest.skillCount} skills
          </Link>
        </div>
        <ShowcaseTabs groups={groups} />
      </div>
    </section>
  );
}
