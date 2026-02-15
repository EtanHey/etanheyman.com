'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TelegramMock from './components/TelegramMock';
import GolemMascot from './components/GolemMascot';
import CopyButton from './components/CopyButton';

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
    id: 'wizard',
    label: 'Wizard',
    emoji: '\u2728',
    showMascot: true,
    lines: [
      '$ golems wizard',
      '',
      '\x1b[33m=== GOLEMS SETUP WIZARD ===\x1b[0m',
      '',
      '\x1b[34mPhase 1: Prerequisites\x1b[0m',
      '  \x1b[32m\u2713\x1b[0m bun v1.2.4',
      '  \x1b[32m\u2713\x1b[0m Claude Code v2.1',
      '  \x1b[32m\u2713\x1b[0m 1Password CLI',
      '  \x1b[33m\u25CB\x1b[0m Railway CLI (optional)',
      '',
      '\x1b[34mPhase 2: Services\x1b[0m',
      '  \x1b[36m[1]\x1b[0m Telegram Bot \u2014 Chat + notifications',
      '  \x1b[36m[2]\x1b[0m Email Golem  \u2014 Triage + routing',
      '  \x1b[36m[3]\x1b[0m Job Golem    \u2014 Board scraping',
      '  \x1b[36m[4]\x1b[0m Night Shift  \u2014 4am improvements',
      '',
      '  Select services to enable [1-4, all]: \x1b[32mall\x1b[0m',
      '',
      '\x1b[34mPhase 3: Wiring\x1b[0m',
      '  \x1b[32m\u2713\x1b[0m Created ~/.golems-zikaron/',
      '  \x1b[32m\u2713\x1b[0m Installed LaunchAgents (4 services)',
      '  \x1b[32m\u2713\x1b[0m Wired MCP servers (zikaron, email, jobs)',
      '  \x1b[32m\u2713\x1b[0m Linked golems CLI to ~/bin',
      '',
      '\x1b[32m\u2714 Setup complete! Run \x1b[0mgolems status\x1b[32m to verify.\x1b[0m',
    ],
  },
  {
    id: 'status',
    label: 'Status',
    emoji: '\uD83D\uDCCA',
    lines: [
      '$ golems status',
      '',
      '\x1b[34m=== GOLEMS STATUS ===\x1b[0m',
      '',
      '  \x1b[32m\u2713\x1b[0m Telegram Bot     running (port 3847)',
      '  \x1b[32m\u2713\x1b[0m Ollama           running',
      '',
      '\x1b[34mLaunchAgents:\x1b[0m',
      '  \x1b[32m\u2713\x1b[0m nightshift',
      '  \x1b[32m\u2713\x1b[0m briefing',
      '  \x1b[32m\u2713\x1b[0m job-golem',
      '  \x1b[32m\u2713\x1b[0m email-golem',
      '  \x1b[32m\u2713\x1b[0m session-archiver',
      '',
      '\x1b[34mClaude Sessions:\x1b[0m 3 running',
      '\x1b[34mNight Shift Target:\x1b[0m songscript',
      '',
      '\x1b[34mSkills:\x1b[0m 30+ loaded',
      '\x1b[34mPackages:\x1b[0m 10 (shared, claude, jobs, recruiter, teller, content, coach, services, ralph, zikaron)',
      '\x1b[34mTests:\x1b[0m 1148 passing (3990 assertions)',
      '\x1b[34mMemory:\x1b[0m 238K+ chunks indexed',
    ],
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    emoji: '\uD83D\uDCBC',
    lines: [
      '$ golems recruit --practice',
      '',
      '\x1b[34m=== INTERVIEW PRACTICE ===\x1b[0m',
      '\x1b[33mElo: 1450 \u2192 tracking 7-step system\x1b[0m',
      '',
      '\x1b[36mStep 1: Introduction\x1b[0m',
      '  Q: "Tell me about a challenging technical project."',
      '',
      '  \x1b[32mYou:\x1b[0m "I built an autonomous agent ecosystem',
      '  that manages email triage, job searching, and',
      '  code deployment through persistent Claude sessions..."',
      '',
      '\x1b[36mFeedback:\x1b[0m',
      '  \x1b[32m\u2713\x1b[0m Strong opening with concrete system',
      '  \x1b[33m\u25CB\x1b[0m Add metrics (1148 tests, 10 packages, 30+ skills)',
      '  \x1b[33m\u25CB\x1b[0m Mention the constraint: Mac + Railway split',
      '',
      '\x1b[34mScore: 7.2/10\x1b[0m | \x1b[33mElo: +15\x1b[0m',
      '  \x1b[36mNext:\x1b[0m Step 2: Technical Deep Dive \u2192',
    ],
  },
  {
    id: 'email',
    label: 'Email',
    emoji: '\uD83D\uDCE7',
    lines: [
      '$ golems email --triage',
      '',
      '\x1b[34m=== EMAIL TRIAGE ===\x1b[0m',
      '\x1b[33mScanning inbox... 23 new emails\x1b[0m',
      '',
      '\x1b[31m\u26A0 URGENT (score 10):\x1b[0m',
      '  From: hiring@acme-corp.dev',
      '  Subj: "Interview confirmation \u2014 Tuesday 2pm"',
      '  \x1b[32m\u2192 Routed to RecruiterGolem\x1b[0m',
      '',
      '\x1b[33mTRACKED (score 7-9):\x1b[0m',
      '  3 job status updates \u2192 RecruiterGolem',
      '  1 payment receipt ($49) \u2192 TellerGolem',
      '',
      '\x1b[36mROUTED:\x1b[0m',
      '  8 recruiter \u2192 RecruiterGolem',
      '  3 finance  \u2192 TellerGolem',
      '  12 dev     \u2192 ClaudeGolem',
      '',
      '\x1b[34mFollow-ups:\x1b[0m 2 overdue, 5 due this week',
    ],
  },
  {
    id: 'coach',
    label: 'Coach',
    emoji: '\uD83D\uDCC5',
    lines: [
      '$ golems coach --plan',
      '',
      '\x1b[34m=== DAILY PLAN ===\x1b[0m',
      '\x1b[33mToday \u2014 Saturday\x1b[0m',
      '',
      '\x1b[36mHealth (Whoop):\x1b[0m',
      '  Recovery: \x1b[32m82%\x1b[0m (green)',
      '  Sleep: 7.2h (94% efficiency)',
      '  Strain: 8.4 yesterday',
      '',
      '\x1b[36mPriorities:\x1b[0m',
      '  \x1b[32m1.\x1b[0m Finish docs polish PR (etanheyman.com)',
      '  \x1b[33m2.\x1b[0m 2 overdue email follow-ups',
      '  \x1b[33m3.\x1b[0m Interview prep: system design (Elo 1450)',
      '',
      '\x1b[36mGolem Status:\x1b[0m',
      '  \x1b[32m\u2713\x1b[0m Jobs: 3 new matches (best: 9.2)',
      '  \x1b[32m\u2713\x1b[0m Email: inbox triaged, 2 follow-ups due',
      '  \x1b[33m\u25CB\x1b[0m Recruiter: Sarah wants Thursday confirmed',
      '',
      '\x1b[32m\u2714 Plan ready. Have a good day.\x1b[0m',
    ],
  },
  {
    id: 'content',
    label: 'Content',
    emoji: '\u270D\uFE0F',
    lines: [
      '$ golems content --draft linkedin',
      '',
      '\x1b[34m=== CONTENT PIPELINE ===\x1b[0m',
      '\x1b[33mDraft: LinkedIn post (topic: agentic systems)\x1b[0m',
      '',
      '\x1b[36mResearch:\x1b[0m',
      '  Pulled 3 recent commits for context',
      '  Found 2 relevant Zikaron chunks',
      '  Audience: Israeli tech, English post',
      '',
      '\x1b[36mDraft (v1):\x1b[0m',
      '  "I built 6 autonomous agents that run while I',
      '  sleep. Night Shift creates PRs at 4am. Morning',
      '  Briefing summarizes everything at 8am. The trick?',
      '  They don\'t talk to each other directly..."',
      '',
      '\x1b[34mCritique wave:\x1b[0m \x1b[33mRunning 3 agents...\x1b[0m',
      '  Agent 1: \x1b[32m8/10\x1b[0m \u2014 Strong hook, add metrics',
      '  Agent 2: \x1b[32m7/10\x1b[0m \u2014 Good, shorten last paragraph',
      '',
      '\x1b[34mReady for review.\x1b[0m Draft saved to scratchpad.',
    ],
  },
  {
    id: 'nightshift',
    label: 'NightShift',
    emoji: '\uD83C\uDF19',
    lines: [
      '$ golems logs nightshift --last',
      '',
      '\x1b[34m=== NIGHT SHIFT LOG (4:02am) ===\x1b[0m',
      '\x1b[33mTarget: songscript\x1b[0m',
      '',
      '\x1b[36m[4:02]\x1b[0m Scanning repo for improvements...',
      '\x1b[36m[4:05]\x1b[0m Found 3 items:',
      '  1. Missing error boundary in PlayerView',
      '  2. WhisperX timeout too short (30s \u2192 120s)',
      '  3. Dead import in utils/format.ts',
      '',
      '\x1b[36m[4:12]\x1b[0m Creating worktree: nightshift-songscript',
      '\x1b[36m[4:18]\x1b[0m Implementing fixes...',
      '\x1b[36m[4:31]\x1b[0m Running tests: \x1b[32m142 pass\x1b[0m, 0 fail',
      '\x1b[36m[4:33]\x1b[0m CodeRabbit review: \x1b[32mPASS\x1b[0m',
      '\x1b[36m[4:34]\x1b[0m Created PR: songscript#42',
      '',
      '\x1b[32m\u2714 Night Shift complete. 3 fixes, 1 PR.\x1b[0m',
      '\x1b[34mMorning briefing queued for 8am.\x1b[0m',
    ],
  },
];

/* ── Golems grid data ──────────────────────────────────────────── */

const golems = [
  { emoji: '\uD83E\uDD16', name: 'ClaudeGolem', desc: 'Telegram orchestrator. Routes commands to domain golems, spawns Claude sessions, manages notifications.', link: '/golems/docs/golems/claude' },
  { emoji: '\uD83D\uDCE7', name: 'Email System', desc: 'Scores, categorizes, and routes incoming email. Infrastructure in @golems/shared.', link: '/golems/docs/golems/email' },
  { emoji: '\uD83D\uDCBC', name: 'RecruiterGolem', desc: 'Contact finder, style-adapted outreach, follow-ups, and 7-mode interview practice with Elo tracking.', link: '/golems/docs/golems/recruiter' },
  { emoji: '\uD83D\uDCB0', name: 'TellerGolem', desc: 'Tax categorization (Schedule C), payment alerts, monthly and annual expense reports.', link: '/golems/docs/golems/teller' },
  { emoji: '\uD83C\uDFAF', name: 'JobGolem', desc: 'Scrapes Indeed, SecretTLV, Drushim, Goozali. LLM-scored matching with auto-outreach for 8+ scores.', link: '/golems/docs/golems/job-golem' },
  { emoji: '\uD83D\uDCC5', name: 'CoachGolem', desc: 'Calendar sync, daily planning, ecosystem status aggregation. Reads all golems, helps you prioritize.', link: '/golems/docs/golems/coach' },
  { emoji: '\u270D\uFE0F', name: 'ContentGolem', desc: 'LinkedIn drafting, Soltome publishing, ghostwriting. Critique-wave pipeline for quality content.', link: '/golems/docs/packages/content' },
  { emoji: '\uD83C\uDF19', name: 'Services', desc: 'Night Shift (4am), Morning Briefing (8am), Cloud Worker (Railway), Wizard, Doctor health checks.', link: '/golems/docs/packages/services' },
  { emoji: '\uD83D\uDD04', name: 'Ralph', desc: 'Autonomous coding loop. Reads PRDs, implements stories, reviews with CodeRabbit, commits and PRs.', link: '/golems/docs/packages/ralph' },
  { emoji: '\uD83E\uDDE0', name: 'Zikaron', desc: 'Memory layer. 238K+ indexed chunks across all sessions. Semantic search in under 2 seconds.', link: '/golems/docs/packages/zikaron' },
];

const installSteps = [
  { step: '1', command: 'git clone https://github.com/EtanHey/golems && cd golems', label: 'Clone', desc: 'Get the monorepo' },
  { step: '2', command: 'bun install', label: 'Install', desc: 'One command, all packages' },
  { step: '3', command: 'golems wizard', label: 'Setup', desc: 'Interactive 3-phase wizard wires everything' },
  { step: '4', command: 'golems status', label: 'Verify', desc: 'See all your golems running' },
];

/* ── Render ANSI-like color codes to spans ─────────────────────── */

function renderLine(raw: string): ReactNode {
  const parts: ReactNode[] = [];
  let key = 0;
  const colorMap: Record<string, string> = {
    '0': '',
    '31': '#ff5555',
    '32': '#28c840',
    '33': '#e59500',
    '34': '#6ab0f3',
    '36': '#40d4d4',
  };
  const regex = /\x1b\[(\d+)m/g;
  let lastIndex = 0;
  let currentColor = '';
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = raw.slice(lastIndex, match.index);
      parts.push(currentColor ? <span key={key++} style={{ color: currentColor }}>{text}</span> : <span key={key++}>{text}</span>);
    }
    currentColor = colorMap[match[1]] || '';
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    const text = raw.slice(lastIndex);
    parts.push(currentColor ? <span key={key++} style={{ color: currentColor }}>{text}</span> : <span key={key++}>{text}</span>);
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoplay]);

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
    startAutoplay(); // Reset timer so user's selection isn't immediately overridden
  }, [startAutoplay]);

  const currentTab = tabs[activeTab];

  return (
    <header className="relative overflow-hidden bg-[#0c0b0a] min-h-[600px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse 700px 500px at 15% 50%, rgba(229,149,0,0.10) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 85% 30%, rgba(196,109,60,0.07) 0%, transparent 70%), radial-gradient(ellipse 300px 300px at 50% 80%, rgba(45,212,168,0.04) 0%, transparent 70%)',
      }} />

      <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px] gap-4 p-4 md:p-6 max-w-[1400px] mx-auto items-start">
        {/* ── TERMINAL (left) ── */}
        <div className="flex flex-col gap-4">
          {/* Header with logo + title */}
          <div className="flex items-center gap-4 py-1 justify-center md:justify-start">
            <Image
              src="/images/golems-logo.svg"
              alt="Golems logo"
              width={56}
              height={56}
              className="shrink-0 drop-shadow-[0_0_20px_rgba(229,149,0,0.4)] w-9 sm:w-10 sm:h-10 md:w-14 md:h-14"
            />
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight m-0 bg-gradient-to-br from-[#f0ebe0] to-[#e59500] bg-clip-text text-transparent">
                Golems
              </h1>
              <div className="font-mono text-[0.65rem] sm:text-xs text-[#7c6f5e] flex items-center gap-1.5 flex-wrap">
                <span className="text-[#a09080]">Spawn</span>
                <span className="text-[#c46d3c] opacity-70">&rarr;</span>
                <span className="text-[#a09080]">Work</span>
                <span className="text-[#c46d3c] opacity-70">&rarr;</span>
                <span className="text-[#a09080]">Die</span>
                <span className="text-[#c46d3c] opacity-70">&rarr;</span>
                <span className="text-[#2dd4a8] drop-shadow-[0_0_16px_rgba(45,212,168,0.35)]">Remember</span>
              </div>
            </div>
          </div>

          {/* Terminal window */}
          <div className="border border-[#e5950026] rounded-xl overflow-hidden bg-[#0d0d0d] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(229,149,0,0.05)]">
            {/* Title bar */}
            <div className="flex items-center px-3 py-2 bg-[#1a1816] border-b border-[#e5950014] gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] block" />
              </div>
              <span className="font-mono text-[0.72rem] text-[#666] flex-1 text-center">golems</span>
              <div className="w-12" />
            </div>

            {/* Tab bar */}
            <div className="flex bg-[#141210] border-b border-[#e595000f] overflow-x-auto scrollbar-none" role="tablist">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[#666] text-[0.72rem] font-mono cursor-pointer whitespace-nowrap transition-colors border-b-2 ${
                    i === activeTab
                      ? 'text-[#e59500] border-[#e59500] bg-[#e595000f]'
                      : 'border-transparent hover:text-[#a09080] hover:bg-[#e5950007]'
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
            <div className="p-4 md:px-5 font-mono text-xs md:text-[0.76rem] leading-relaxed text-[#c0b8a8] h-[260px] sm:h-[340px] md:h-[420px] overflow-y-auto overflow-x-hidden scrollbar-none" role="tabpanel">
              {currentTab.showMascot ? (
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                  <div className="hidden md:block opacity-90">
                    <GolemMascot variant="guardian" size="md" animated={false} />
                  </div>
                  <div className="overflow-hidden">
                    {currentTab.lines.map((line, i) => (
                      <div
                        key={`${activeTab}-${i}`}
                        className="whitespace-pre-wrap break-words md:whitespace-pre md:break-normal opacity-0 animate-[lineReveal_0.3s_ease_forwards]"
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
                      className="whitespace-pre-wrap break-words md:whitespace-pre md:break-normal opacity-0 animate-[lineReveal_0.3s_ease_forwards]"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {renderLine(line)}
                    </div>
                  ))}
                </div>
              )}
              <div className="text-[#e59500] animate-[blink_1s_step-end_infinite] inline-block mt-1">_</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col w-full justify-center md:flex-row md:flex-wrap md:w-auto md:items-center gap-3">
            <Link
              href="/golems/docs/getting-started"
              className="bg-gradient-to-br from-[#e59500] to-[#c46d3c] text-[#0c0b0a] font-bold py-2 px-5 rounded-lg text-[0.8rem] sm:py-2.5 sm:px-6 sm:text-sm hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(229,149,0,0.35)] transition-all no-underline w-full text-center min-h-12 flex items-center justify-center md:w-auto md:min-h-0 md:inline-flex"
            >
              Get Started
            </Link>
            <Link
              href="/golems/docs/architecture"
              className="text-[#2dd4a8] border border-[#2dd4a840] font-semibold py-2 px-5 rounded-lg text-[0.8rem] sm:py-2.5 sm:px-6 sm:text-sm hover:border-[#2dd4a899] hover:bg-[#2dd4a80f] transition-all no-underline w-full text-center min-h-12 flex items-center justify-center md:w-auto md:min-h-0 md:inline-flex"
            >
              Architecture
            </Link>
            <Link
              href="https://github.com/EtanHey/golems"
              className="text-[#908575] border border-[#90857533] font-medium py-2 px-4 rounded-lg text-[0.78rem] sm:py-2.5 sm:px-5 sm:text-[0.85rem] hover:text-[#c0b8a8] hover:border-[#90857566] hover:bg-[#9085750f] transition-all no-underline w-full text-center min-h-12 flex items-center justify-center md:w-auto md:min-h-0 md:inline-flex"
            >
              GitHub &rarr;
            </Link>
          </div>
        </div>

        {/* ── TELEGRAM (right sidebar, iPhone frame) ── */}
        <div className="self-stretch flex flex-col max-w-full mx-auto lg:max-w-none lg:mx-0">
          <div className="flex-1 flex flex-col bg-[#0e1621] rounded-2xl border border-[#e5950026] shadow-[0_12px_40px_rgba(0,0,0,0.4)] lg:bg-black lg:rounded-[44px] lg:border-2 lg:border-[#3a3a3c] lg:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_#1c1c1e,inset_0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden relative">
            {/* Side button (desktop only) */}
            <div className="hidden lg:block absolute right-[-4px] top-[100px] w-[3px] h-11 bg-[#3a3a3c] rounded-r z-10" />
            {/* Dynamic Island (desktop only) */}
            <div className="hidden lg:block w-[92px] h-7 bg-black rounded-[20px] mx-auto mt-2.5 relative z-[5] shrink-0" />
            <TelegramMock activeIndex={activeTab} onTopicClick={handleTabChange} />
            {/* Home bar (desktop only) */}
            <div className="hidden lg:block w-[100px] h-1 bg-white/20 rounded-full mx-auto my-2 shrink-0" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Get Started Section ───────────────────────────────────────── */

function GetStartedSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-[#0c0b0a] to-[#0a0908] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e5950033] to-transparent" />
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#f0ebe0] mb-2 tracking-tight">
          Get Started in 60 Seconds
        </h2>
        <p className="text-center text-[#7c6f5e] mb-12 italic">Four commands. That&apos;s it.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {installSteps.map((s) => (
            <div key={s.step} className="relative group bg-[#14120e]/90 border border-[#e5950014] rounded-xl p-5 hover:border-[#e5950040] transition-colors">
              <CopyButton text={s.command} />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e59500] to-[#c46d3c] text-[#0c0b0a] font-extrabold text-sm flex items-center justify-center mb-3">
                {s.step}
              </div>
              <div className="font-bold text-sm text-[#e59500] mb-1">{s.label}</div>
              <code className="bg-black/40 px-2.5 py-1.5 rounded-md text-[0.72rem] text-[#2dd4a8] font-mono break-all border border-[#2dd4a81a] block mb-2">
                {s.command}
              </code>
              <p className="text-[#7c6f5e] text-[0.8rem] m-0 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/golems/docs/getting-started"
            className="bg-gradient-to-br from-[#e59500] to-[#c46d3c] text-[#0c0b0a] font-bold py-2.5 px-6 rounded-lg text-sm hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(229,149,0,0.35)] transition-all no-underline"
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
    <section className="py-12 md:py-20 bg-gradient-to-b from-[#0c0b0a] to-[#080807] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e5950026] to-transparent" />
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#f0ebe0] mb-2 tracking-tight">
          Meet the Golems
        </h2>
        <p className="text-center text-[#7c6f5e] mb-12 italic">
          6 golems + infrastructure. Each golem owns a domain, not an I/O channel.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {golems.map((g) => (
            <Link
              key={g.name}
              href={g.link}
              className="group bg-[#14120e]/90 border border-[#c46d3c1a] rounded-xl p-6 transition-all no-underline text-inherit hover:border-[#e595004d] hover:translate-y-[-4px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] relative overflow-hidden block"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e595004d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl w-11 h-11 flex items-center justify-center bg-[#e595000f] rounded-[10px] border border-[#e5950014]">
                  {g.emoji}
                </div>
                <div className="font-bold text-[1.05rem] text-[#e8e2d6]">{g.name}</div>
              </div>
              <p className="text-[#908575] text-sm leading-relaxed m-0">{g.desc}</p>
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
    <section className="py-12 md:py-20 bg-[#0c0b0a] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2dd4a81e] to-transparent" />
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#f0ebe0] mb-2 tracking-tight">
          How It Works
        </h2>
        <p className="text-center text-[#7c6f5e] mb-12 italic">Mac is the brain, Railway is the body</p>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8 items-center justify-center max-w-[700px] mx-auto">
          <div className="flex-1 bg-[#14120e]/90 border border-[#c46d3c1a] rounded-xl p-6 hover:border-[#e5950040] transition-colors">
            <h3 className="text-base font-bold text-[#e59500] mb-3">Your Mac (Brain)</h3>
            <ul className="list-none p-0 m-0 space-y-1">
              {['Telegram Bot', 'Night Shift', 'Zikaron Memory', 'Notification Server'].map((item) => (
                <li key={item} className="text-[#908575] text-sm font-mono before:content-['\2022_'] before:text-[#c46d3c]">{item}</li>
              ))}
            </ul>
          </div>
          <div className="text-2xl text-[#2dd4a8] shrink-0 drop-shadow-[0_0_12px_rgba(45,212,168,0.2)] rotate-90 md:rotate-0">&harr;</div>
          <div className="flex-1 bg-[#14120e]/90 border border-[#c46d3c1a] rounded-xl p-6 hover:border-[#e5950040] transition-colors">
            <h3 className="text-base font-bold text-[#e59500] mb-3">Railway (Body)</h3>
            <ul className="list-none p-0 m-0 space-y-1">
              {['Email Poller', 'Job Scraper', 'Briefing Generator'].map((item) => (
                <li key={item} className="text-[#908575] text-sm font-mono before:content-['\2022_'] before:text-[#c46d3c]">{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/golems/docs/architecture"
            className="text-[#2dd4a8] border border-[#2dd4a840] font-semibold py-2.5 px-6 rounded-lg text-sm hover:border-[#2dd4a899] hover:bg-[#2dd4a80f] transition-all no-underline"
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
