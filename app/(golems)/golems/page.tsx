'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TelegramMock from './components/TelegramMock';
import GolemMascot from './components/GolemMascot';

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
      '\x1b[34mSkills:\x1b[0m 34 loaded',
      '\x1b[34mTests:\x1b[0m 539 passing',
      '\x1b[34mMemory:\x1b[0m 200k+ chunks indexed',
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
      '  \x1b[33m\u25CB\x1b[0m Add metrics (539 tests, 34 skills)',
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
      '  From: hiring@linear.dev',
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
  { emoji: '\uD83E\uDD16', name: 'ClaudeGolem', desc: 'Persistent Telegram-bridged Claude session. Manages Night Shift, content generation, and interactive coding.', link: '/golems/docs/golems/claude' },
  { emoji: '\uD83D\uDCE7', name: 'EmailGolem', desc: 'Scores, categorizes, and routes incoming email. Detects subscriptions and payment failures.', link: '/golems/docs/golems/email' },
  { emoji: '\uD83D\uDCBC', name: 'RecruiterGolem', desc: 'Finds contacts via GitHub, Exa, Hunter. Manages outreach, follow-ups, and interview practice.', link: '/golems/docs/golems/recruiter' },
  { emoji: '\uD83D\uDCB0', name: 'TellerGolem', desc: 'Tax categorization, payment failure alerts, monthly and annual expense reports.', link: '/golems/docs/golems/teller' },
  { emoji: '\uD83C\uDFAF', name: 'JobGolem', desc: 'Scrapes Indeed, SecretTLV, Drushim, Goozali. Scores and surfaces hot matches.', link: '/golems/docs/golems/job-golem' },
  { emoji: '\uD83C\uDF19', name: 'NightShift', desc: 'Autonomous 4am improvements. Rotates across repos, creates PRs, sends morning briefings.', link: '/golems/docs/architecture' },
];

const installSteps = [
  { step: '1', command: 'git clone https://github.com/EtanHey/golems && cd golems', label: 'Clone', desc: 'Get the monorepo' },
  { step: '2', command: 'bun install', label: 'Install', desc: 'One command, all packages' },
  { step: '3', command: 'golems wizard', label: 'Setup', desc: 'Interactive 7-phase wizard wires everything' },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const currentTab = tabs[activeTab];

  return (
    <header className="relative overflow-hidden bg-[#0c0b0a] min-h-[600px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse 700px 500px at 15% 50%, rgba(229,149,0,0.10) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 85% 30%, rgba(196,109,60,0.07) 0%, transparent 70%), radial-gradient(ellipse 300px 300px at 50% 80%, rgba(45,212,168,0.04) 0%, transparent 70%)',
      }} />

      <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px] gap-4 p-4 md:p-6 max-w-[1400px] items-start">
        {/* ── TERMINAL (left) ── */}
        <div className="flex flex-col gap-4">
          {/* Header with logo + title */}
          <div className="flex items-center gap-4 py-1 max-md:justify-center">
            <Image
              src="/images/golems-logo.svg"
              alt="Golems logo"
              width={56}
              height={56}
              className="shrink-0 drop-shadow-[0_0_20px_rgba(229,149,0,0.4)] max-md:w-10 max-md:h-10 max-sm:w-9 max-sm:h-9"
            />
            <div className="flex flex-col gap-0.5">
              <h1 className="text-3xl md:text-[1.8rem] font-black tracking-tight leading-tight m-0 bg-gradient-to-br from-[#f0ebe0] to-[#e59500] bg-clip-text text-transparent max-md:text-2xl max-sm:text-xl">
                Golems
              </h1>
              <div className="font-mono text-xs text-[#7c6f5e] flex items-center gap-1.5 flex-wrap max-sm:text-[0.65rem]">
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
                <div className="grid grid-cols-[auto_1fr] gap-6 items-start max-md:grid-cols-1">
                  <div className="max-md:hidden opacity-90">
                    <GolemMascot variant="guardian" size="md" animated={false} />
                  </div>
                  <div className="overflow-hidden">
                    {currentTab.lines.map((line, i) => (
                      <div
                        key={`${activeTab}-${i}`}
                        className="whitespace-pre max-md:whitespace-pre-wrap max-md:break-words opacity-0 animate-[lineReveal_0.3s_ease_forwards]"
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
                      className="whitespace-pre max-md:whitespace-pre-wrap max-md:break-words opacity-0 animate-[lineReveal_0.3s_ease_forwards]"
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
          <div className="flex flex-wrap gap-3 items-center max-md:flex-col max-md:w-full max-md:justify-center">
            <Link
              href="/golems/docs/getting-started"
              className="bg-gradient-to-br from-[#e59500] to-[#c46d3c] text-[#0c0b0a] font-bold py-2.5 px-6 rounded-lg text-sm hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(229,149,0,0.35)] transition-all no-underline max-md:w-full max-md:text-center max-md:min-h-12 max-md:flex max-md:items-center max-md:justify-center max-sm:py-2 max-sm:px-5 max-sm:text-[0.8rem]"
            >
              Get Started
            </Link>
            <Link
              href="/golems/docs/architecture"
              className="text-[#2dd4a8] border border-[#2dd4a840] font-semibold py-2.5 px-6 rounded-lg text-sm hover:border-[#2dd4a899] hover:bg-[#2dd4a80f] transition-all no-underline max-md:w-full max-md:text-center max-md:min-h-12 max-md:flex max-md:items-center max-md:justify-center max-sm:py-2 max-sm:px-5 max-sm:text-[0.8rem]"
            >
              Architecture
            </Link>
            <Link
              href="https://github.com/EtanHey/golems"
              className="text-[#908575] border border-[#90857533] font-medium py-2.5 px-5 rounded-lg text-[0.85rem] hover:text-[#c0b8a8] hover:border-[#90857566] hover:bg-[#9085750f] transition-all no-underline max-md:w-full max-md:text-center max-md:min-h-12 max-md:flex max-md:items-center max-md:justify-center max-sm:py-2 max-sm:px-4 max-sm:text-[0.78rem]"
            >
              GitHub &rarr;
            </Link>
          </div>
        </div>

        {/* ── TELEGRAM (right sidebar, iPhone frame) ── */}
        <div className="self-stretch flex flex-col max-lg:max-w-full max-lg:mx-auto">
          <div className="flex-1 flex flex-col bg-black rounded-[44px] max-lg:rounded-2xl border-2 border-[#3a3a3c] max-lg:border max-lg:border-[#e5950026] max-lg:bg-[#0e1621] shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_#1c1c1e,inset_0_0_0_1px_rgba(255,255,255,0.04)] max-lg:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden relative">
            {/* Side button (desktop only) */}
            <div className="absolute right-[-4px] top-[100px] w-[3px] h-11 bg-[#3a3a3c] rounded-r max-lg:hidden z-10" />
            {/* Dynamic Island (desktop only) */}
            <div className="w-[92px] h-7 bg-black rounded-[20px] mx-auto mt-2.5 relative z-[5] shrink-0 max-lg:hidden" />
            <TelegramMock activeIndex={activeTab} onTopicClick={handleTabChange} />
            {/* Home bar (desktop only) */}
            <div className="w-[100px] h-1 bg-white/20 rounded-full mx-auto my-2 shrink-0 max-lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Get Started Section ───────────────────────────────────────── */

function GetStartedSection() {
  return (
    <section className="py-20 max-md:py-12 bg-gradient-to-b from-[#0c0b0a] to-[#0a0908] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e5950033] to-transparent" />
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="text-center text-4xl max-sm:text-2xl font-extrabold text-[#f0ebe0] mb-2 tracking-tight">
          Get Started in 60 Seconds
        </h2>
        <p className="text-center text-[#7c6f5e] mb-12 italic">Four commands. That&apos;s it.</p>
        <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 mb-8">
          {installSteps.map((s) => (
            <div key={s.step} className="bg-[#14120e]/90 border border-[#e5950014] rounded-xl p-5 hover:border-[#e5950040] transition-colors">
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
    <section className="py-20 max-md:py-12 bg-gradient-to-b from-[#0c0b0a] to-[#080807] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e5950026] to-transparent" />
      <div className="max-w-[1000px] mx-auto px-6 max-sm:px-4">
        <h2 className="text-center text-4xl max-sm:text-2xl font-extrabold text-[#f0ebe0] mb-2 tracking-tight">
          Meet the Golems
        </h2>
        <p className="text-center text-[#7c6f5e] mb-12 italic">
          Each golem owns a domain, not an I/O channel
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-sm:grid-cols-1 gap-5">
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
    <section className="py-20 max-md:py-12 bg-[#0c0b0a] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2dd4a81e] to-transparent" />
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="text-center text-4xl max-sm:text-2xl font-extrabold text-[#f0ebe0] mb-2 tracking-tight">
          How It Works
        </h2>
        <p className="text-center text-[#7c6f5e] mb-12 italic">Mac is the brain, Railway is the body</p>
        <div className="flex items-center justify-center gap-8 max-w-[700px] mx-auto max-md:flex-col max-md:gap-4">
          <div className="flex-1 bg-[#14120e]/90 border border-[#c46d3c1a] rounded-xl p-6 hover:border-[#e5950040] transition-colors">
            <h3 className="text-base font-bold text-[#e59500] mb-3">Your Mac (Brain)</h3>
            <ul className="list-none p-0 m-0 space-y-1">
              {['Telegram Bot', 'Night Shift', 'Zikaron Memory', 'Notification Server'].map((item) => (
                <li key={item} className="text-[#908575] text-sm font-mono before:content-['\2022_'] before:text-[#c46d3c]">{item}</li>
              ))}
            </ul>
          </div>
          <div className="text-2xl text-[#2dd4a8] shrink-0 drop-shadow-[0_0_12px_rgba(45,212,168,0.2)] max-md:rotate-90">&harr;</div>
          <div className="flex-1 bg-[#14120e]/90 border border-[#c46d3c1a] rounded-xl p-6 hover:border-[#e5950040] transition-colors">
            <h3 className="text-base font-bold text-[#e59500] mb-3">Railway (Body)</h3>
            <ul className="list-none p-0 m-0 space-y-1">
              {['Email Poller', 'Job Scraper', 'Briefing Generator', 'Content Pipeline'].map((item) => (
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
