"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import golemsStats from "../lib/golems-stats.json";
import CopyButton from "./CopyButton";

/* ── Skill categories with descriptions ──────────────────────── */

interface SkillEntry {
  name: string;
  command: string;
  description: string;
  category: string;
}

const SKILL_CATEGORIES: Record<string, SkillEntry[]> = {
  Development: [
    {
      name: "commit",
      command: "/commit",
      description: "CodeRabbit review + conventional commit",
      category: "Development",
    },
    {
      name: "pr-loop",
      command: "/pr-loop",
      description: "Full PR lifecycle: branch → test → review → merge",
      category: "Development",
    },
    {
      name: "worktrees",
      command: "/worktrees",
      description: "Git worktree management (create, switch, cleanup)",
      category: "Development",
    },
    {
      name: "test-plan",
      command: "/test-plan",
      description: "Generate test plan from requirements",
      category: "Development",
    },
    {
      name: "lsp",
      command: "/lsp",
      description: "Code intelligence via Language Server Protocol",
      category: "Development",
    },
    {
      name: "coderabbit",
      command: "/coderabbit",
      description: "AI code review with multiple workflows",
      category: "Development",
    },
    {
      name: "critique-waves",
      command: "/critique-waves",
      description: "Parallel verification agents for consensus",
      category: "Development",
    },
  ],
  Operations: [
    {
      name: "cmux-agents",
      command: "/cmux-agents",
      description:
        "Spawn AI agents in terminal panes — Claude, Cursor, Gemini, Codex, Kiro",
      category: "Operations",
    },
    {
      name: "cmux",
      command: "/cmux",
      description: "Terminal multiplexer management",
      category: "Operations",
    },
    {
      name: "railway",
      command: "/railway",
      description: "Deploy, logs, restart, env vars for cloud worker",
      category: "Operations",
    },
    {
      name: "1password",
      command: "/1password",
      description: "Secret management, env migration, vault ops",
      category: "Operations",
    },
    {
      name: "github",
      command: "/github",
      description: "Issues, PRs, checks, releases via gh CLI",
      category: "Operations",
    },
    {
      name: "convex",
      command: "/convex",
      description: "Schema, deploy, data import/export, troubleshooting",
      category: "Operations",
    },
    {
      name: "golem-install",
      command: "/golem-install",
      description: "Setup golems ecosystem with guided wizard",
      category: "Operations",
    },
  ],
  "Research & Context": [
    {
      name: "brainlayer",
      command: "/brainlayer",
      description: "Search, store, recall from 290K+ memory chunks",
      category: "Research & Context",
    },
    {
      name: "research",
      command: "/research",
      description: "Deep web research with multi-source synthesis",
      category: "Research & Context",
    },
    {
      name: "context7",
      command: "/context7",
      description: "Up-to-date library documentation lookup",
      category: "Research & Context",
    },
    {
      name: "github-research",
      command: "/github-research",
      description: "Explore and document unfamiliar repositories",
      category: "Research & Context",
    },
    {
      name: "catchup",
      command: "/catchup",
      description: "Full branch context recovery",
      category: "Research & Context",
    },
    {
      name: "obsidian",
      command: "/obsidian",
      description: "Search, read, write Obsidian vault notes",
      category: "Research & Context",
    },
  ],
  "Content & Communication": [
    {
      name: "content",
      command: "/content",
      description: "Multi-platform content creation and publishing",
      category: "Content & Communication",
    },
    {
      name: "voice-sessions",
      command: "/voice-sessions",
      description: "Voice-powered debrief, QA, practice sessions",
      category: "Content & Communication",
    },
    {
      name: "video-showcase",
      command: "/video-showcase",
      description: "Remotion-based product/project animations",
      category: "Content & Communication",
    },
    {
      name: "presentation-builder",
      command: "/presentation-builder",
      description: "Workshop-method slide deck builder",
      category: "Content & Communication",
    },
    {
      name: "youtube-pipeline",
      command: "/youtube-pipeline",
      description: "Extract knowledge from YouTube via Exa",
      category: "Content & Communication",
    },
  ],
  Quality: [
    {
      name: "never-fabricate",
      command: "/never-fabricate",
      description: "Mandatory verification before reporting results",
      category: "Quality",
    },
    {
      name: "large-plan",
      command: "/large-plan",
      description: "Multi-phase plan scaffolding and execution",
      category: "Quality",
    },
    {
      name: "archive",
      command: "/archive",
      description: "Archive completed PRD stories",
      category: "Quality",
    },
    {
      name: "writing-skills",
      command: "/writing-skills",
      description: "Create and validate new skills",
      category: "Quality",
    },
    {
      name: "skills",
      command: "/skills",
      description: "Discover and list available skills",
      category: "Quality",
    },
  ],
  Domain: [
    {
      name: "coach",
      command: "/coach",
      description: "Health, schedule, life planning with Whoop integration",
      category: "Domain",
    },
    {
      name: "interview-practice",
      command: "/interview-practice",
      description: "7-mode practice with Elo tracking",
      category: "Domain",
    },
    {
      name: "prd",
      command: "/prd",
      description: "Generate Product Requirement Documents",
      category: "Domain",
    },
    {
      name: "brave",
      command: "/brave",
      description: "Browser automation via Brave",
      category: "Domain",
    },
    {
      name: "figma-loop",
      command: "/figma-loop",
      description: "Iterative Figma-to-implementation workflow",
      category: "Domain",
    },
    {
      name: "figma-swarm",
      command: "/figma-swarm",
      description:
        "Multi-agent Figma screen decomposition and component build pipeline",
      category: "Domain",
    },
    {
      name: "cli-agents",
      command: "/cli-agents",
      description: "Run Gemini, Cursor, Codex, Kiro for research",
      category: "Domain",
    },
  ],
};

/* ── ANSI color renderer (same as page.tsx) ──────────────────── */

function renderLine(raw: string): ReactNode {
  const parts: ReactNode[] = [];
  let key = 0;
  const colorMap: Record<string, string> = {
    "0": "",
    "31": "#ff5555",
    "32": "#28c840",
    "33": "#e59500",
    "34": "#6ab0f3",
    "36": "#40d4d4",
  };
  const regex = /\x1b\[(\d+)m/g;
  let lastIndex = 0;
  let currentColor = "";
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = raw.slice(lastIndex, match.index);
      parts.push(
        currentColor ? (
          <span key={key++} style={{ color: currentColor }}>
            {text}
          </span>
        ) : (
          <span key={key++}>{text}</span>
        ),
      );
    }
    currentColor = colorMap[match[1]] || "";
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    const text = raw.slice(lastIndex);
    parts.push(
      currentColor ? (
        <span key={key++} style={{ color: currentColor }}>
          {text}
        </span>
      ) : (
        <span key={key++}>{text}</span>
      ),
    );
  }

  return parts.length > 0 ? parts : raw;
}

/* ── Eval badge lookup ───────────────────────────────────────── */

function getEvalData(skillName: string) {
  return golemsStats.evals.find((e) => e.skill === skillName);
}

/* ── Install prompt for cmux-agents (reference implementation) ─ */

const CMUX_AGENTS_INSTALL = `Install and configure the cmux-agents skill for managing AI agents
in terminal panes. Download from github.com/EtanHey/golems and
symlink to ~/.claude/commands/cmux-agents/. If ~/.golems/config.yaml
doesn't exist, auto-detect installed AI CLIs (claude, cursor, gemini,
codex, kiro) and ask for workspace path. Then follow the First-Time
Setup section in the SKILL.md.`;

/* ── Terminal demo lines ─────────────────────────────────────── */

const installDemoLines = [
  "$ golems-cli skills install cmux-agents",
  "",
  "\x1b[34m=== INSTALLING cmux-agents ===\x1b[0m",
  "",
  "\x1b[36mDownloading:\x1b[0m github.com/EtanHey/golems/skills/golem-powers/cmux-agents/",
  "  \x1b[32m\u2713\x1b[0m SKILL.md (471 lines)",
  "  \x1b[32m\u2713\x1b[0m evals/evals.json (3 evals, 18 assertions)",
  "",
  "\x1b[36mSymlinking:\x1b[0m ~/.claude/commands/cmux-agents/ \u2192 installed",
  "",
  "\x1b[34mFirst-Time Setup:\x1b[0m",
  "  Checking ~/.golems/config.yaml...",
  "  \x1b[33m\u25CB\x1b[0m Config not found \u2014 running wizard",
  "",
  "  \x1b[36mDetecting AI CLIs:\x1b[0m",
  "  \x1b[32m\u2713\x1b[0m claude  /usr/local/bin/claude",
  "  \x1b[32m\u2713\x1b[0m cursor  /usr/local/bin/cursor",
  "  \x1b[32m\u2713\x1b[0m gemini  /usr/local/bin/gemini",
  "  \x1b[33m\u25CB\x1b[0m codex   not found",
  "  \x1b[33m\u25CB\x1b[0m kiro    not found",
  "",
  "  \x1b[36mWorkspace path:\x1b[0m ~/Projects",
  "  \x1b[32m\u2713\x1b[0m Config written to ~/.golems/config.yaml",
  "",
  "\x1b[32m\u2714 cmux-agents installed! Use /cmux-agents in any Claude session.\x1b[0m",
];

/* ── Skill Card ──────────────────────────────────────────────── */

function SkillCard({ skill }: { skill: SkillEntry }) {
  const evalData = getEvalData(skill.name);

  return (
    <Link
      href={`/golems/skills/${skill.name}`}
      className="group relative block rounded-lg border border-[#e5950014] bg-[#14120e]/90 p-4 no-underline transition-colors hover:border-[#e5950040]"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <code className="rounded bg-[#e595000f] px-2 py-0.5 font-mono text-xs font-bold text-[#e59500]">
          {skill.command}
        </code>
        {evalData && (
          <span className="flex items-center gap-1 rounded-full bg-[#28c84015] px-2 py-0.5 text-[0.65rem] font-medium text-[#28c840]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            {evalData.evalCount} evals · {evalData.assertionCount} assertions
          </span>
        )}
      </div>
      <p className="m-0 text-[0.78rem] leading-relaxed text-[#a69987]">
        {skill.description}
      </p>
    </Link>
  );
}

/* ── Featured Skill (cmux-agents) ────────────────────────────── */

function FeaturedSkill() {
  const evalData = getEvalData("cmux-agents");

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5950026] bg-[#0d0d0d] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 border-b border-[#e5950014] bg-[#1a1816] px-3 py-2">
        <div className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 text-center font-mono text-[0.72rem] text-[#666]">
          golems-cli skills install
        </span>
        <div className="w-12" />
      </div>

      {/* Terminal content */}
      <div
        className="scrollbar-none h-[320px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-[#c0b8a8] md:h-[380px] md:px-5 md:text-[0.76rem]"
        aria-label="Terminal demonstration: skill installation process"
      >
        {installDemoLines.map((line, i) => (
          <div
            key={i}
            className="animate-[lineReveal_0.3s_ease_forwards] whitespace-pre-wrap opacity-0"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {renderLine(line)}
          </div>
        ))}
        <div className="mt-1 inline-block animate-[blink_1s_step-end_infinite] text-[#e59500]">
          _
        </div>
      </div>

      {/* Skill info bar */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[#e5950014] bg-[#1a1816] px-4 py-3">
        <span className="font-mono text-xs font-bold text-[#e59500]">
          cmux-agents
        </span>
        {evalData && (
          <span className="flex items-center gap-1 rounded-full bg-[#28c84015] px-2.5 py-1 text-[0.7rem] font-medium text-[#28c840]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            {evalData.evalCount} evals · {evalData.assertionCount} assertions
            {evalData.hasFixtures && " · fixtures"}
          </span>
        )}
        <span className="rounded-full bg-[#6ab0f315] px-2.5 py-1 text-[0.7rem] text-[#6ab0f3]">
          Portable
        </span>
      </div>
    </div>
  );
}

/* ── Main SkillsShowcase ─────────────────────────────────────── */

export default function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...Object.keys(SKILL_CATEGORIES)];
  const totalAssertions = golemsStats.evals.reduce(
    (sum, e) => sum + e.assertionCount,
    0,
  );

  const filteredSkills =
    activeCategory === "All"
      ? Object.values(SKILL_CATEGORIES).flat()
      : SKILL_CATEGORIES[activeCategory] || [];

  return (
    <section
      id="skills"
      className="relative bg-gradient-to-b from-[#080807] to-[#0c0b0a] py-12 md:py-20"
    >
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e5950033] to-transparent" />
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        {/* Header */}
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          Skills Library
        </h2>
        <p className="mb-4 text-center text-[#b0a89c] italic">
          {golemsStats.skills.count} reusable Claude Code skills. Install any
          skill with one paste.
        </p>

        {/* Stats row */}
        <div className="mb-10 flex flex-wrap justify-center gap-4 text-center">
          <div className="rounded-lg border border-[#e5950014] bg-[#14120e]/60 px-4 py-2">
            <div className="text-lg font-bold text-[#e59500]">
              {golemsStats.skills.count}
            </div>
            <div className="text-[0.7rem] text-[#b0a89c]">Skills</div>
          </div>
          <div className="rounded-lg border border-[#28c84014] bg-[#14120e]/60 px-4 py-2">
            <div className="text-lg font-bold text-[#28c840]">
              {golemsStats.skills.withEvals}
            </div>
            <div className="text-[0.7rem] text-[#b0a89c]">With Evals</div>
          </div>
          <div className="rounded-lg border border-[#6ab0f314] bg-[#14120e]/60 px-4 py-2">
            <div className="text-lg font-bold text-[#6ab0f3]">
              {totalAssertions}
            </div>
            <div className="text-[0.7rem] text-[#b0a89c]">Assertions</div>
          </div>
          <div className="rounded-lg border border-[#40d4d414] bg-[#14120e]/60 px-4 py-2">
            <div className="text-lg font-bold text-[#40d4d4]">
              {golemsStats.skills.evalCoverage}
            </div>
            <div className="text-[0.7rem] text-[#b0a89c]">Eval Coverage</div>
          </div>
        </div>

        {/* Featured: cmux-agents install demo */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <FeaturedSkill />

          {/* Install prompt card */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[#2dd4a826] bg-[#14120e]/90 p-5">
              <h3 className="mb-1 text-sm font-bold text-[#2dd4a8]">
                Install Prompt
              </h3>
              <p className="mb-3 text-[0.75rem] leading-relaxed text-[#b0a89c]">
                Paste this into any Claude Code session to install cmux-agents:
              </p>
              <div className="group relative">
                <CopyButton text={CMUX_AGENTS_INSTALL} />
                <pre className="scrollbar-none overflow-x-auto rounded-lg border border-[#2dd4a81a] bg-black/40 p-3 font-mono text-[0.7rem] leading-relaxed text-[#2dd4a8]">
                  {CMUX_AGENTS_INSTALL}
                </pre>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5950014] bg-[#14120e]/90 p-5">
              <h3 className="mb-2 text-sm font-bold text-[#e59500]">
                First-Time Setup
              </h3>
              <ul className="m-0 list-none space-y-1.5 p-0 text-[0.78rem] text-[#a69987]">
                <li className="before:mr-1.5 before:text-[#28c840] before:content-['1.']">
                  Auto-detects installed AI CLIs (Claude, Cursor, Gemini, Codex,
                  Kiro)
                </li>
                <li className="before:mr-1.5 before:text-[#28c840] before:content-['2.']">
                  Asks for your workspace path
                </li>
                <li className="before:mr-1.5 before:text-[#28c840] before:content-['3.']">
                  Writes{" "}
                  <code className="rounded bg-[#e595000a] px-1 text-[0.7rem] text-[#c0b8a8]">
                    ~/.golems/config.yaml
                  </code>
                </li>
                <li className="before:mr-1.5 before:text-[#28c840] before:content-['4.']">
                  Ready — use{" "}
                  <code className="rounded bg-[#e595000a] px-1 text-[0.7rem] text-[#e59500]">
                    /cmux-agents
                  </code>{" "}
                  in any session
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="scrollbar-none mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              type="button"
              className={`min-h-[44px] shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[0.72rem] transition-colors ${
                activeCategory === cat
                  ? "bg-[#e59500] font-bold text-[#0c0b0a]"
                  : "border border-[#e5950020] text-[#a69987] hover:border-[#e5950040] hover:text-[#c0b8a8]"
              }`}
            >
              {cat === "All"
                ? `All (${Object.values(SKILL_CATEGORIES).flat().length})`
                : cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://github.com/EtanHey/golems/tree/master/skills/golem-powers"
            className="rounded-lg border border-[#e5950040] px-6 py-2.5 text-sm font-semibold text-[#e59500] no-underline transition-all hover:border-[#e5950099] hover:bg-[#e595000f]"
          >
            Browse All Skills on GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
