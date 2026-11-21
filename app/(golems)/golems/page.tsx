import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CommandBlock from "./components/CommandBlock";
import EmetInscription from "./components/EmetInscription";
import SkillsShowcase from "./components/SkillsShowcase";
import { evidenceTotals, formatDay, manifestGeneratedAt } from "./lib/skill-evidence";

// AIDEV-NOTE: Every number on this page comes from the generated skills
// manifest via lib/skill-evidence.ts. The hand-maintained golems-stats.json
// (dated 2026-04) is intentionally not read here: its chunk/test counts were
// already contradicted by the journey doc. No eval results are published.

/* ── Hero ─────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-[1200px] px-4 pt-12 pb-10 md:px-6 md:pt-20 md:pb-14">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="g-rise flex flex-col justify-center">
          <h1
            id="hero-heading"
            className="font-g-display text-[2.6rem] leading-[1.04] tracking-[-0.01em] text-balance sm:text-[3.4rem] lg:text-[4.1rem]"
          >
            Agent skills that say exactly what has been tested.
          </h1>
          <p className="mt-6 max-w-[38rem] text-[1.1rem] leading-[1.6] text-g-ash md:text-[1.2rem]">
            Golems is an open-source monorepo of skills and tooling for Claude
            Code, Codex, and other coding agents. A skill is a{" "}
            <code className="font-g-mono text-[0.9em] text-g-ink">SKILL.md</code>{" "}
            workflow an agent loads and follows. Each skill page shows which
            eval scenarios are written, and that none has been scored on
            current models yet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/golems/docs/getting-started"
              className="g-press inline-flex min-h-12 items-center rounded-md bg-g-cobalt px-5 text-[1rem] font-medium text-white hover:bg-g-cobalt-deep"
            >
              Get started
            </Link>
            <Link
              href="/golems/skills"
              className="g-press inline-flex min-h-12 items-center rounded-md border border-g-ink px-5 text-[1rem] font-medium text-g-ink hover:bg-g-raised"
            >
              Browse {evidenceTotals.skills} skills
            </Link>
          </div>
        </div>
        <div className="g-rise [animation-delay:120ms]">
          <EmetInscription />
        </div>
      </div>
    </section>
  );
}

/* ── Evidence strip ───────────────────────────────────────────── */

function EvidenceStrip() {
  const cells = [
    {
      value: String(evidenceTotals.skills),
      text: (
        <>
          published skills, read from{" "}
          <code className="font-g-mono text-[0.9em]">skills/golem-powers</code> on{" "}
          {formatDay(manifestGeneratedAt)}
        </>
      ),
    },
    {
      value: String(evidenceTotals.withSuite),
      mark: "g-mark-written",
      text: (
        <>
          have eval scenarios written in{" "}
          <code className="font-g-mono text-[0.9em]">evals/evals.json</code>
        </>
      ),
    },
    {
      value: String(evidenceTotals.withFixtures),
      mark: "g-mark-fixtures",
      text: <>ship fixtures that those scenarios run against</>,
    },
    {
      value: "None",
      mark: "g-mark-pending",
      text: <>have results published for current models yet</>,
    },
  ];

  return (
    <section aria-label="What the evidence covers" className="mx-auto max-w-[1200px] px-4 pb-16 md:px-6 md:pb-24">
      <dl className="grid grid-cols-1 border-t-2 border-g-ink sm:grid-cols-2 lg:grid-cols-4">
        {cells.map((cell, i) => (
          <div
            key={i}
            className="flex flex-col-reverse gap-2 border-b border-g-rule py-5 sm:pr-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="text-[0.95rem] leading-snug text-g-ash">{cell.text}</dt>
            <dd className="flex items-center gap-3 font-g-display text-[2.4rem] leading-none text-g-ink">
              {cell.value}
              {cell.mark && <span aria-hidden="true" className={`g-mark ${cell.mark}`} />}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Start ────────────────────────────────────────────────────── */

const startSteps = [
  {
    title: "Clone and run the tests",
    body: "Bun installs the workspace. The README lists current totals, including known failures on a clean clone.",
    lines: ["git clone https://github.com/EtanHey/golems.git", "cd golems", "bun install", "bun test"],
  },
  {
    title: "Check your machine",
    body: "Reports whether bun, git, and claude are installed and where.",
    lines: ["bun packages/golems-cli/src/index.ts setup --check"],
  },
  {
    title: "Find a skill",
    body: "Reads what is published on master through the GitHub API, so it needs network access.",
    lines: ["bun packages/golem-skills/src/index.ts skills list"],
  },
  {
    title: "Install it, then call it",
    body: "Once installed, invoke it by name in a Claude Code session.",
    lines: ["bun packages/golem-skills/src/index.ts skills install pr-loop", "# then, in Claude Code: /pr-loop"],
  },
];

function StartSection() {
  return (
    <section aria-labelledby="start-heading" className="border-t border-g-rule bg-g-raised/60">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[0.8fr_1.5fr] lg:gap-16">
        <div>
          <h2 id="start-heading" className="font-g-display text-[2rem] leading-tight md:text-[2.75rem]">
            Start in four steps
          </h2>
          <p className="mt-4 max-w-[34ch] text-[1.05rem] leading-relaxed text-g-ash">
            Everything runs from a checkout. Skills live inside your coding
            agent; only the golem packages need secrets.
          </p>
          <Link href="/golems/docs/getting-started" className="g-link mt-6 inline-block text-[1rem]">
            Read the full getting-started guide
          </Link>
        </div>
        <ol className="space-y-8">
          {startSteps.map((step, i) => (
            <li key={step.title} className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
              <span aria-hidden="true" className="font-g-display text-[1.6rem] leading-none text-g-cobalt">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1.1rem] font-semibold">{step.title}</h3>
                <p className="mt-1 mb-3 text-[0.98rem] leading-relaxed text-g-ash">{step.body}</p>
                <CommandBlock lines={step.lines} label={step.title} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── How evidence is earned ───────────────────────────────────── */

function EvidenceLadder() {
  const rungs = [
    {
      title: "Written",
      mark: "g-mark-written",
      body: "Scenarios in evals/evals.json describe a prompt and the behaviour the skill must show. Some ship fixtures to run against.",
      status: `${evidenceTotals.withSuite} of ${evidenceTotals.skills} skills`,
    },
    {
      title: "Run",
      mark: "g-mark-pending",
      body: "The scenarios execute on a named model, and the run records which model actually answered.",
      status: "Not yet, for current models",
    },
    {
      title: "Published",
      mark: "g-mark-pending",
      body: "Results appear on the skill's page with that provenance attached. Until then the page says so.",
      status: "Nothing published",
    },
  ];

  return (
    <section aria-labelledby="ladder-heading" className="border-t border-g-rule">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.5fr] lg:gap-16">
          <div>
            <h2 id="ladder-heading" className="font-g-display text-[2rem] leading-tight md:text-[2.75rem]">
              How a skill earns a score
            </h2>
            <p className="mt-4 max-w-[36ch] text-[1.05rem] leading-relaxed text-g-ash">
              Written scenarios are not results. This site shows a pass rate only
              after a run names the model that produced it, so most of this
              ladder is honestly empty.
            </p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-g-rule bg-g-rule md:grid-cols-3">
            {rungs.map((rung, i) => (
              <li key={rung.title} className="flex flex-col bg-g-slip p-5 md:p-6">
                <p className="flex items-center gap-2.5 text-sm text-g-ash">
                  <span aria-hidden="true" className={`g-mark ${rung.mark}`} />
                  Step {i + 1}
                </p>
                <h3 className="mt-3 font-g-display text-[1.5rem]">{rung.title}</h3>
                <p className="mt-2 flex-1 text-[0.97rem] leading-relaxed text-g-ash">{rung.body}</p>
                <p className="mt-5 border-t border-g-rule pt-3 text-[0.95rem] font-medium text-g-ink">
                  {rung.status}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-6 border-t border-g-rule pt-10 lg:grid-cols-[0.8fr_1.5fr] lg:gap-16">
          <h3 className="font-g-display text-[1.5rem] leading-snug">
            One skill, any coding agent
          </h3>
          <dl className="grid gap-6 sm:grid-cols-3">
            {[
              ["SKILL.md", "The workflow itself, written so any agent can follow it."],
              ["capabilities.yaml", "A machine-readable list of what each CLI can do, used for routing."],
              ["adapters/", "Exact flags and syntax per CLI: Claude Code, Cursor, Gemini, Codex, Kiro."],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt className="font-g-mono text-[0.95rem] font-medium text-g-ink">{term}</dt>
                <dd className="mt-1.5 text-[0.97rem] leading-relaxed text-g-ash">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ── Story ────────────────────────────────────────────────────── */

const storyEntries = [
  {
    date: "Before 2026",
    title: "Ralph",
    body: "A loop that spawns a fresh Claude session per PRD story. It showed agents could work through structured tasks alone.",
    href: "/golems/docs/heritage/ralph",
  },
  {
    date: "11 Jan 2026",
    title: "Memory first",
    body: "BrainLayer, first called Zikaron (Hebrew for memory), starts as a local sqlite-vec store before any golem exists.",
  },
  {
    date: "17 Jan 2026",
    title: "The first golem",
    body: "An email router. It set the rule the project still follows: golems are domain experts, not I/O channels.",
  },
  {
    date: "2 Feb 2026",
    title: "One monorepo",
    body: "Three parallel Claude sessions, coordinating through a shared collab file, merge the packages into one tree.",
  },
  {
    date: "17 May 2026",
    title: "Rules ship with evidence",
    body: "Eight PRs in one night. Each new rule shipped only after a live A/B run against an unmodified agent flipped its signal.",
  },
  {
    date: formatDay(manifestGeneratedAt),
    title: "Today",
    body: `${evidenceTotals.skills} published skills, ${evidenceTotals.withSuite} with eval scenarios written, and runs on current models still to come.`,
  },
];

function StorySection() {
  return (
    <section aria-labelledby="story-heading" className="border-t border-g-rule bg-g-raised/60">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="story-heading" className="font-g-display text-[2rem] leading-tight md:text-[2.75rem]">
            How it got here
          </h2>
          <Link href="/golems/docs/journey" className="g-link text-[1rem]">
            Read the full engineering journey
          </Link>
        </div>
        <ol className="relative grid gap-0 md:grid-cols-3">
          {storyEntries.map((entry) => (
            <li key={entry.title} className="relative border-t border-g-ink py-5 md:pr-8">
              <p className="g-tabular text-sm text-g-ash">{entry.date}</p>
              <h3 className="mt-1.5 font-g-display text-[1.35rem]">
                {entry.href ? (
                  <Link href={entry.href} className="g-link text-g-ink">
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </h3>
              <p className="mt-2 max-w-[40ch] text-[0.97rem] leading-relaxed text-g-ash">{entry.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Sibling projects ─────────────────────────────────────────── */

const siblings = [
  { name: "BrainLayer", body: "Persistent memory for AI agents.", href: "https://brainlayer.etanheyman.com" },
  { name: "VoiceLayer", body: "Voice input and output for AI agents.", href: "https://voicelayer.etanheyman.com" },
  { name: "cmuxLayer", body: "Spawning and coordinating agents across terminal panes.", href: "https://cmuxlayer.etanheyman.com" },
];

function SiblingsSection() {
  return (
    <section aria-labelledby="siblings-heading" className="border-t border-g-rule">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[0.8fr_1.5fr] lg:gap-16">
        <div>
          <h2 id="siblings-heading" className="font-g-display text-[1.75rem] leading-tight">
            Built alongside
          </h2>
          <p className="mt-3 max-w-[34ch] text-[1rem] leading-relaxed text-g-ash">
            Separate projects by the same author that many skills call into.
          </p>
        </div>
        <ul className="divide-y divide-g-rule border-y border-g-rule">
          {siblings.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-16 items-center justify-between gap-4 py-4 transition-colors duration-150 hover:bg-g-raised/70 sm:px-2"
              >
                <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="font-g-display text-[1.3rem] text-g-ink">{s.name}</span>
                  <span className="text-[0.97rem] text-g-ash">{s.body}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-g-ash transition-transform duration-200 ease-[var(--ease-g-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-g-cobalt"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function GolemsHome() {
  return (
    <>
      <Hero />
      <EvidenceStrip />
      <SkillsShowcase />
      <EvidenceLadder />
      <StartSection />
      <StorySection />
      <SiblingsSection />
    </>
  );
}
