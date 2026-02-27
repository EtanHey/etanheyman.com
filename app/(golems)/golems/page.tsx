"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import TelegramMock from "./components/TelegramMock";
import GolemMascot from "./components/GolemMascot";
import CopyButton from "./components/CopyButton";

/* ── Tab content: real CLI flows ───────────────────────────────── */

interface TerminalTab {
  id: string;
  label: string;
  emoji: string;
  lines: string[];
  showMascot?: boolean;
}

const tabs: TerminalTab[] = [
  {
    id: "wizard",
    label: "Wizard",
    emoji: "\u2728",
    showMascot: true,
    lines: [
      "$ golems wizard",
      "",
      "\x1b[33m=== GOLEMS SETUP WIZARD ===\x1b[0m",
      "",
      "\x1b[34mPhase 1: Prerequisites\x1b[0m",
      "  \x1b[32m\u2713\x1b[0m bun v1.2.4",
      "  \x1b[32m\u2713\x1b[0m Claude Code v2.1",
      "  \x1b[32m\u2713\x1b[0m 1Password CLI",
      "  \x1b[33m\u25CB\x1b[0m Railway CLI (optional)",
      "",
      "\x1b[34mPhase 2: Services\x1b[0m",
      "  \x1b[36m[1]\x1b[0m Telegram Bot \u2014 Chat + notifications",
      "  \x1b[36m[2]\x1b[0m Email Golem  \u2014 Triage + routing",
      "  \x1b[36m[3]\x1b[0m Job Golem    \u2014 Board scraping",
      "  \x1b[36m[4]\x1b[0m Night Shift  \u2014 4am improvements",
      "",
      "  Select services to enable [1-4, all]: \x1b[32mall\x1b[0m",
      "",
      "\x1b[34mPhase 3: Wiring\x1b[0m",
      "  \x1b[32m\u2713\x1b[0m Created ~/.golems-zikaron/",
      "  \x1b[32m\u2713\x1b[0m Installed LaunchAgents (4 services)",
      "  \x1b[32m\u2713\x1b[0m Wired MCP servers (zikaron, email, jobs)",
      "  \x1b[32m\u2713\x1b[0m Linked golems CLI to ~/bin",
      "",
      "\x1b[32m\u2714 Setup complete! Run \x1b[0mgolems status\x1b[32m to verify.\x1b[0m",
    ],
  },
  {
    id: "status",
    label: "Status",
    emoji: "\uD83D\uDCCA",
    lines: [
      "$ golems status",
      "",
      "\x1b[34m=== GOLEMS STATUS ===\x1b[0m",
      "",
      "  \x1b[32m\u2713\x1b[0m Telegram Bot     running (port 3847)",
      "  \x1b[32m\u2713\x1b[0m Ollama           running",
      "",
      "\x1b[34mLaunchAgents:\x1b[0m",
      "  \x1b[32m\u2713\x1b[0m nightshift",
      "  \x1b[32m\u2713\x1b[0m briefing",
      "  \x1b[32m\u2713\x1b[0m job-golem",
      "  \x1b[32m\u2713\x1b[0m email-golem",
      "  \x1b[32m\u2713\x1b[0m session-archiver",
      "",
      "\x1b[34mClaude Sessions:\x1b[0m 3 running",
      "\x1b[34mNight Shift Target:\x1b[0m songscript",
      "",
      "\x1b[34mSkills:\x1b[0m 30+ loaded",
      "\x1b[34mPackages:\x1b[0m 14 (shared, claude, jobs, recruiter, teller, content, coach, services, ralph, dashboard, docsite, golems-tui, orchestrator, tax-helper)",
      "\x1b[34mTests:\x1b[0m 1199 passing (2928 assertions)",
      "\x1b[34mMemory:\x1b[0m 328K+ chunks indexed",
    ],
  },
  {
    id: "recruiter",
    label: "Recruiter",
    emoji: "\uD83D\uDCBC",
    lines: [
      "$ golems recruit --practice",
      "",
      "\x1b[34m=== INTERVIEW PRACTICE ===\x1b[0m",
      "\x1b[33mElo: 1450 \u2192 tracking 7-step system\x1b[0m",
      "",
      "\x1b[36mStep 1: Introduction\x1b[0m",
      '  Q: "Tell me about a challenging technical project."',
      "",
      '  \x1b[32mYou:\x1b[0m "I built an autonomous agent ecosystem',
      "  that manages email triage, job searching, and",
      '  code deployment through persistent Claude sessions..."',
      "",
      "\x1b[36mFeedback:\x1b[0m",
      "  \x1b[32m\u2713\x1b[0m Strong opening with concrete system",
      "  \x1b[33m\u25CB\x1b[0m Add metrics (1199 tests, 14 packages, 30+ skills)",
      "  \x1b[33m\u25CB\x1b[0m Mention the constraint: Mac + Railway split",
      "",
      "\x1b[34mScore: 7.2/10\x1b[0m | \x1b[33mElo: +15\x1b[0m",
      "  \x1b[36mNext:\x1b[0m Step 2: Technical Deep Dive \u2192",
    ],
  },
  {
    id: "email",
    label: "Email",
    emoji: "\uD83D\uDCE7",
    lines: [
      "$ golems email --triage",
      "",
      "\x1b[34m=== EMAIL TRIAGE ===\x1b[0m",
      "\x1b[33mScanning inbox... 23 new emails\x1b[0m",
      "",
      "\x1b[31m\u26A0 URGENT (score 10):\x1b[0m",
      "  From: hiring@acme-corp.dev",
      '  Subj: "Interview confirmation \u2014 Tuesday 2pm"',
      "  \x1b[32m\u2192 Routed to RecruiterGolem\x1b[0m",
      "",
      "\x1b[33mTRACKED (score 7-9):\x1b[0m",
      "  3 job status updates \u2192 RecruiterGolem",
      "  1 payment receipt ($49) \u2192 TellerGolem",
      "",
      "\x1b[36mROUTED:\x1b[0m",
      "  8 recruiter \u2192 RecruiterGolem",
      "  3 finance  \u2192 TellerGolem",
      "  12 dev     \u2192 ClaudeGolem",
      "",
      "\x1b[34mFollow-ups:\x1b[0m 2 overdue, 5 due this week",
    ],
  },
  {
    id: "coach",
    label: "Coach",
    emoji: "\uD83D\uDCC5",
    lines: [
      "$ golems coach --plan",
      "",
      "\x1b[34m=== DAILY PLAN ===\x1b[0m",
      "\x1b[33mToday \u2014 Saturday\x1b[0m",
      "",
      "\x1b[36mHealth (Whoop):\x1b[0m",
      "  Recovery: \x1b[32m82%\x1b[0m (green)",
      "  Sleep: 7.2h (94% efficiency)",
      "  Strain: 8.4 yesterday",
      "",
      "\x1b[36mPriorities:\x1b[0m",
      "  \x1b[32m1.\x1b[0m Finish docs polish PR (etanheyman.com)",
      "  \x1b[33m2.\x1b[0m 2 overdue email follow-ups",
      "  \x1b[33m3.\x1b[0m Interview prep: system design (Elo 1450)",
      "",
      "\x1b[36mGolem Status:\x1b[0m",
      "  \x1b[32m\u2713\x1b[0m Jobs: 3 new matches (best: 9.2)",
      "  \x1b[32m\u2713\x1b[0m Email: inbox triaged, 2 follow-ups due",
      "  \x1b[33m\u25CB\x1b[0m Recruiter: Sarah wants Thursday confirmed",
      "",
      "\x1b[32m\u2714 Plan ready. Have a good day.\x1b[0m",
    ],
  },
  {
    id: "content",
    label: "Content",
    emoji: "\u270D\uFE0F",
    lines: [
      "$ golems content --draft linkedin",
      "",
      "\x1b[34m=== CONTENT PIPELINE ===\x1b[0m",
      "\x1b[33mDraft: LinkedIn post (topic: agentic systems)\x1b[0m",
      "",
      "\x1b[36mResearch:\x1b[0m",
      "  Pulled 3 recent commits for context",
      "  Found 2 relevant Zikaron chunks",
      "  Audience: Israeli tech, English post",
      "",
      "\x1b[36mDraft (v1):\x1b[0m",
      '  "I built 6 autonomous agents that run while I',
      "  sleep. Night Shift creates PRs at 4am. Morning",
      "  Briefing summarizes everything at 8am. The trick?",
      "  They don't talk to each other directly...\"",
      "",
      "\x1b[34mCritique wave:\x1b[0m \x1b[33mRunning 3 agents...\x1b[0m",
      "  Agent 1: \x1b[32m8/10\x1b[0m \u2014 Strong hook, add metrics",
      "  Agent 2: \x1b[32m7/10\x1b[0m \u2014 Good, shorten last paragraph",
      "",
      "\x1b[34mReady for review.\x1b[0m Draft saved to scratchpad.",
    ],
  },
  {
    id: "nightshift",
    label: "NightShift",
    emoji: "\uD83C\uDF19",
    lines: [
      "$ golems logs nightshift --last",
      "",
      "\x1b[34m=== NIGHT SHIFT LOG (4:02am) ===\x1b[0m",
      "\x1b[33mTarget: songscript\x1b[0m",
      "",
      "\x1b[36m[4:02]\x1b[0m Scanning repo for improvements...",
      "\x1b[36m[4:05]\x1b[0m Found 3 items:",
      "  1. Missing error boundary in PlayerView",
      "  2. WhisperX timeout too short (30s \u2192 120s)",
      "  3. Dead import in utils/format.ts",
      "",
      "\x1b[36m[4:12]\x1b[0m Creating worktree: nightshift-songscript",
      "\x1b[36m[4:18]\x1b[0m Implementing fixes...",
      "\x1b[36m[4:31]\x1b[0m Running tests: \x1b[32m142 pass\x1b[0m, 0 fail",
      "\x1b[36m[4:33]\x1b[0m CodeRabbit review: \x1b[32mPASS\x1b[0m",
      "\x1b[36m[4:34]\x1b[0m Created PR: songscript#42",
      "",
      "\x1b[32m\u2714 Night Shift complete. 3 fixes, 1 PR.\x1b[0m",
      "\x1b[34mMorning briefing queued for 8am.\x1b[0m",
    ],
  },
];

/* ── Golems grid data ──────────────────────────────────────────── */

const golems = [
  {
    emoji: "\uD83E\uDD16",
    name: "ClaudeGolem",
    desc: "Telegram orchestrator. Routes commands to domain golems, spawns Claude sessions, manages notifications.",
    link: "/golems/docs/golems/claude",
  },
  {
    emoji: "\uD83D\uDCE7",
    name: "Email System",
    desc: "Scores, categorizes, and routes incoming email. Infrastructure in @golems/shared.",
    link: "/golems/docs/golems/email",
  },
  {
    emoji: "\uD83D\uDCBC",
    name: "RecruiterGolem",
    desc: "Contact finder, style-adapted outreach, follow-ups, and 7-mode interview practice with Elo tracking.",
    link: "/golems/docs/golems/recruiter",
  },
  {
    emoji: "\uD83D\uDCB0",
    name: "TellerGolem",
    desc: "Tax categorization (Schedule C), payment alerts, monthly and annual expense reports.",
    link: "/golems/docs/golems/teller",
  },
  {
    emoji: "\uD83C\uDFAF",
    name: "JobGolem",
    desc: "Scrapes Indeed, SecretTLV, Drushim, Goozali. LLM-scored matching with auto-outreach for 8+ scores.",
    link: "/golems/docs/golems/job-golem",
  },
  {
    emoji: "\uD83D\uDCC5",
    name: "CoachGolem",
    desc: "Calendar sync, daily planning, ecosystem status aggregation. Reads all golems, helps you prioritize.",
    link: "/golems/docs/golems/coach",
  },
  {
    emoji: "\u270D\uFE0F",
    name: "ContentGolem",
    desc: "LinkedIn drafting, Soltome publishing, ghostwriting. Critique-wave pipeline for quality content.",
    link: "/golems/docs/packages/content",
  },
  {
    emoji: "\uD83C\uDF19",
    name: "Services",
    desc: "Night Shift (4am), Morning Briefing (8am), Cloud Worker (Railway), Wizard, Doctor health checks.",
    link: "/golems/docs/packages/services",
  },
  {
    emoji: "\uD83D\uDD04",
    name: "Ralph",
    desc: "Autonomous coding loop. Reads PRDs, implements stories, reviews with CodeRabbit, commits and PRs.",
    link: "/golems/docs/packages/ralph",
  },
  {
    emoji: "\uD83E\uDDE0",
    name: "Zikaron",
    desc: "Memory layer. 328K+ indexed chunks across all sessions. Semantic search in under 2 seconds.",
    link: "/golems/docs/packages/zikaron",
  },
];

const installSteps = [
  {
    step: "1",
    command: "git clone https://github.com/EtanHey/golems && cd golems",
    label: "Clone",
    desc: "Get the monorepo",
  },
  {
    step: "2",
    command: "bun install",
    label: "Install",
    desc: "One command, all packages",
  },
  {
    step: "3",
    command: "golems wizard",
    label: "Setup",
    desc: "Interactive 3-phase wizard wires everything",
  },
  {
    step: "4",
    command: "golems status",
    label: "Verify",
    desc: "See all your golems running",
  },
];

/* ── Render ANSI-like color codes to spans ─────────────────────── */

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

/* ── Hero Section ──────────────────────────────────────────────── */

function HomepageHero() {
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 6000);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index);
      startAutoplay(); // Reset timer so user's selection isn't immediately overridden
    },
    [startAutoplay],
  );

  const currentTab = tabs[activeTab];

  return (
    <header className="relative min-h-[600px] overflow-hidden bg-[#0c0b0a]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 500px at 15% 50%, rgba(229,149,0,0.10) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 85% 30%, rgba(196,109,60,0.07) 0%, transparent 70%), radial-gradient(ellipse 300px 300px at 50% 80%, rgba(45,212,168,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-4 p-4 md:p-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px]">
        {/* ── TERMINAL (left) ── */}
        <div className="flex flex-col gap-4">
          {/* Header with logo + title */}
          <div className="flex items-center justify-center gap-4 py-1 md:justify-start">
            <Image
              src="/images/golems-logo.svg"
              alt="Golems logo"
              width={56}
              height={56}
              className="w-9 shrink-0 drop-shadow-[0_0_20px_rgba(229,149,0,0.4)] sm:h-10 sm:w-10 md:h-14 md:w-14"
            />
            <div className="flex flex-col gap-0.5">
              <h1 className="m-0 bg-gradient-to-br from-[#f0ebe0] to-[#e59500] bg-clip-text text-xl leading-tight font-black tracking-tight text-transparent sm:text-2xl md:text-3xl">
                Golems
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[0.65rem] text-[#7c6f5e] sm:text-xs">
                <span className="text-[#a09080]">Spawn</span>
                <span className="text-[#c46d3c] opacity-70">&rarr;</span>
                <span className="text-[#a09080]">Work</span>
                <span className="text-[#c46d3c] opacity-70">&rarr;</span>
                <span className="text-[#a09080]">Die</span>
                <span className="text-[#c46d3c] opacity-70">&rarr;</span>
                <span className="text-[#2dd4a8] drop-shadow-[0_0_16px_rgba(45,212,168,0.35)]">
                  Remember
                </span>
              </div>
            </div>
          </div>

          {/* Terminal window */}
          <div className="overflow-hidden rounded-xl border border-[#e5950026] bg-[#0d0d0d] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(229,149,0,0.05)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-[#e5950014] bg-[#1a1816] px-3 py-2">
              <div className="flex gap-1.5">
                <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="block h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 text-center font-mono text-[0.72rem] text-[#666]">
                golems
              </span>
              <div className="w-12" />
            </div>

            {/* Tab bar */}
            <div
              className="scrollbar-none flex overflow-x-auto border-b border-[#e595000f] bg-[#141210]"
              role="tablist"
            >
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  className={`flex cursor-pointer items-center gap-1.5 border-b-2 px-3.5 py-2 font-mono text-[0.72rem] whitespace-nowrap text-[#666] transition-colors ${
                    i === activeTab
                      ? "border-[#e59500] bg-[#e595000f] text-[#e59500]"
                      : "border-transparent hover:bg-[#e5950007] hover:text-[#a09080]"
                  }`}
                  onClick={() => handleTabChange(i)}
                  type="button"
                  role="tab"
                  aria-selected={i === activeTab}
                >
                  <span className="text-[0.8rem]">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Terminal content */}
            <div
              className="scrollbar-none h-[260px] overflow-x-hidden overflow-y-auto p-4 font-mono text-xs leading-relaxed text-[#c0b8a8] sm:h-[340px] md:h-[420px] md:px-5 md:text-[0.76rem]"
              role="tabpanel"
            >
              {currentTab.showMascot ? (
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[auto_1fr]">
                  <div className="hidden opacity-90 md:block">
                    <GolemMascot
                      variant="guardian"
                      size="md"
                      animated={false}
                    />
                  </div>
                  <div className="overflow-hidden">
                    {currentTab.lines.map((line, i) => (
                      <div
                        key={`${activeTab}-${i}`}
                        className="animate-[lineReveal_0.3s_ease_forwards] break-words whitespace-pre-wrap opacity-0 md:break-normal md:whitespace-pre"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {renderLine(line)}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  {currentTab.lines.map((line, i) => (
                    <div
                      key={`${activeTab}-${i}`}
                      className="animate-[lineReveal_0.3s_ease_forwards] break-words whitespace-pre-wrap opacity-0 md:break-normal md:whitespace-pre"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {renderLine(line)}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-1 inline-block animate-[blink_1s_step-end_infinite] text-[#e59500]">
                _
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex w-full flex-col justify-center gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center">
            <Link
              href="/golems/docs/getting-started"
              className="flex min-h-12 w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#e59500] to-[#c46d3c] px-5 py-2 text-center text-[0.8rem] font-bold text-[#0c0b0a] no-underline transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(229,149,0,0.35)] sm:px-6 sm:py-2.5 sm:text-sm md:inline-flex md:min-h-0 md:w-auto"
            >
              Get Started
            </Link>
            <Link
              href="/golems/docs/architecture"
              className="flex min-h-12 w-full items-center justify-center rounded-lg border border-[#2dd4a840] px-5 py-2 text-center text-[0.8rem] font-semibold text-[#2dd4a8] no-underline transition-all hover:border-[#2dd4a899] hover:bg-[#2dd4a80f] sm:px-6 sm:py-2.5 sm:text-sm md:inline-flex md:min-h-0 md:w-auto"
            >
              Architecture
            </Link>
            <Link
              href="https://github.com/EtanHey/golems"
              className="flex min-h-12 w-full items-center justify-center rounded-lg border border-[#90857533] px-4 py-2 text-center text-[0.78rem] font-medium text-[#908575] no-underline transition-all hover:border-[#90857566] hover:bg-[#9085750f] hover:text-[#c0b8a8] sm:px-5 sm:py-2.5 sm:text-[0.85rem] md:inline-flex md:min-h-0 md:w-auto"
            >
              GitHub &rarr;
            </Link>
          </div>
        </div>

        {/* ── TELEGRAM (right sidebar, iPhone frame) ── */}
        <div className="mx-auto flex max-w-full flex-col self-stretch lg:mx-0 lg:max-w-none">
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#e5950026] bg-[#0e1621] shadow-[0_12px_40px_rgba(0,0,0,0.4)] lg:rounded-[44px] lg:border-2 lg:border-[#3a3a3c] lg:bg-black lg:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_#1c1c1e,inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            {/* Side button (desktop only) */}
            <div className="absolute top-[100px] right-[-4px] z-10 hidden h-11 w-[3px] rounded-r bg-[#3a3a3c] lg:block" />
            {/* Dynamic Island (desktop only) */}
            <div className="relative z-[5] mx-auto mt-2.5 hidden h-7 w-[92px] shrink-0 rounded-[20px] bg-black lg:block" />
            <TelegramMock
              activeIndex={activeTab}
              onTopicClick={handleTabChange}
            />
            {/* Home bar (desktop only) */}
            <div className="mx-auto my-2 hidden h-1 w-[100px] shrink-0 rounded-full bg-white/20 lg:block" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Get Started Section ───────────────────────────────────────── */

function GetStartedSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0c0b0a] to-[#0a0908] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e5950033] to-transparent" />
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          Get Started in 60 Seconds
        </h2>
        <p className="mb-12 text-center text-[#7c6f5e] italic">
          Four commands. That&apos;s it.
        </p>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {installSteps.map((s) => (
            <div
              key={s.step}
              className="group relative rounded-xl border border-[#e5950014] bg-[#14120e]/90 p-5 transition-colors hover:border-[#e5950040]"
            >
              <CopyButton text={s.command} />
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#e59500] to-[#c46d3c] text-sm font-extrabold text-[#0c0b0a]">
                {s.step}
              </div>
              <div className="mb-1 text-sm font-bold text-[#e59500]">
                {s.label}
              </div>
              <code className="mb-2 block rounded-md border border-[#2dd4a81a] bg-black/40 px-2.5 py-1.5 font-mono text-[0.72rem] break-all text-[#2dd4a8]">
                {s.command}
              </code>
              <p className="m-0 text-[0.8rem] leading-snug text-[#7c6f5e]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/golems/docs/getting-started"
            className="rounded-lg bg-gradient-to-br from-[#e59500] to-[#c46d3c] px-6 py-2.5 text-sm font-bold text-[#0c0b0a] no-underline transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(229,149,0,0.35)]"
          >
            Full Setup Guide
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Golems Section ────────────────────────────────────────────── */

function GolemsSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0c0b0a] to-[#080807] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e5950026] to-transparent" />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          Meet the Golems
        </h2>
        <p className="mb-12 text-center text-[#7c6f5e] italic">
          7 domain agents + infrastructure. Each golem owns a domain, not an I/O
          channel.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {golems.map((g) => (
            <Link
              key={g.name}
              href={g.link}
              className="group relative block overflow-hidden rounded-xl border border-[#c46d3c1a] bg-[#14120e]/90 p-6 text-inherit no-underline transition-all hover:translate-y-[-4px] hover:border-[#e595004d] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#e595004d] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#e5950014] bg-[#e595000f] text-2xl">
                  {g.emoji}
                </div>
                <div className="text-[1.05rem] font-bold text-[#e8e2d6]">
                  {g.name}
                </div>
              </div>
              <p className="m-0 text-sm leading-relaxed text-[#908575]">
                {g.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Architecture Section ──────────────────────────────────────── */

function ArchitectureSection() {
  return (
    <section className="relative bg-[#0c0b0a] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#2dd4a81e] to-transparent" />
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          How It Works
        </h2>
        <p className="mb-12 text-center text-[#7c6f5e] italic">
          Mac is the brain, Railway is the body
        </p>
        <div className="mx-auto flex max-w-[700px] flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex-1 rounded-xl border border-[#c46d3c1a] bg-[#14120e]/90 p-6 transition-colors hover:border-[#e5950040]">
            <h3 className="mb-3 text-base font-bold text-[#e59500]">
              Your Mac (Brain)
            </h3>
            <ul className="m-0 list-none space-y-1 p-0">
              {[
                "Telegram Bot",
                "Night Shift",
                "Zikaron Memory",
                "Notification Server",
              ].map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-[#908575] before:text-[#c46d3c] before:content-['\\2022_']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 rotate-90 text-2xl text-[#2dd4a8] drop-shadow-[0_0_12px_rgba(45,212,168,0.2)] md:rotate-0">
            &harr;
          </div>
          <div className="flex-1 rounded-xl border border-[#c46d3c1a] bg-[#14120e]/90 p-6 transition-colors hover:border-[#e5950040]">
            <h3 className="mb-3 text-base font-bold text-[#e59500]">
              Railway (Body)
            </h3>
            <ul className="m-0 list-none space-y-1 p-0">
              {["Email Poller", "Job Scraper", "Briefing Generator"].map(
                (item) => (
                  <li
                    key={item}
                    className="font-mono text-sm text-[#908575] before:text-[#c46d3c] before:content-['\\2022_']"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/golems/docs/architecture"
            className="rounded-lg border border-[#2dd4a840] px-6 py-2.5 text-sm font-semibold text-[#2dd4a8] no-underline transition-all hover:border-[#2dd4a899] hover:bg-[#2dd4a80f]"
          >
            Explore Architecture &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function GolemsHome() {
  return (
    <>
      <HomepageHero />
      <GetStartedSection />
      <GolemsSection />
      <ArchitectureSection />
    </>
  );
}
