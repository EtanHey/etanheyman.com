import Link from "next/link";
import Image from "next/image";
import CopyButton from "./components/CopyButton";
import SkillsShowcase from "./components/SkillsShowcase";
import golemsStats from "./lib/golems-stats.json";

/* ── Product cards data ────────────────────────────────────────── */

const products = [
  {
    name: "BrainLayer",
    tagline: "Persistent memory for AI agents",
    description: `${golemsStats.brainlayer.chunksDisplay} chunks indexed. ${golemsStats.brainlayer.mcpTools} MCP tools. Semantic search, entity graph, knowledge digest.`,
    href: "https://brainlayer.etanheyman.com",
    color: "#e59500",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="14"
          cy="14"
          r="12"
          stroke="#e59500"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <circle cx="14" cy="10" r="3" fill="#e59500" opacity="0.8" />
        <circle cx="9" cy="17" r="2.5" fill="#e59500" opacity="0.6" />
        <circle cx="19" cy="17" r="2.5" fill="#e59500" opacity="0.6" />
        <line
          x1="14"
          y1="13"
          x2="9"
          y2="15"
          stroke="#e59500"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="14"
          y1="13"
          x2="19"
          y2="15"
          stroke="#e59500"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="9"
          y1="17"
          x2="19"
          y2="17"
          stroke="#e59500"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    ),
  },
  {
    name: "VoiceLayer",
    tagline: "Voice I/O for AI agents",
    description: `${golemsStats.voicelayer.tests} tests. Dual-protocol MCP daemon. Talk to your agents, hear them respond.`,
    href: "https://voicelayer.etanheyman.com",
    color: "#2dd4a8",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="11"
          y="4"
          width="6"
          height="12"
          rx="3"
          stroke="#2dd4a8"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <path
          d="M8 13a6 6 0 0 0 12 0"
          stroke="#2dd4a8"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="14"
          y1="19"
          x2="14"
          y2="23"
          stroke="#2dd4a8"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="10"
          y1="23"
          x2="18"
          y2="23"
          stroke="#2dd4a8"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>
    ),
  },
  {
    name: "cmuxLayer",
    tagline: "Multi-terminal orchestration",
    description: `${golemsStats.cmuxlayer.tests} tests. ${golemsStats.cmuxlayer.socketSpeedup} faster than shell. Spawn, coordinate, and monitor AI agents.`,
    href: "https://cmuxlayer.etanheyman.com",
    color: "#6ab0f3",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="10"
          height="9"
          rx="2"
          stroke="#6ab0f3"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <rect
          x="15"
          y="4"
          width="10"
          height="9"
          rx="2"
          stroke="#6ab0f3"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <rect
          x="3"
          y="15"
          width="10"
          height="9"
          rx="2"
          stroke="#6ab0f3"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <rect
          x="15"
          y="15"
          width="10"
          height="9"
          rx="2"
          stroke="#6ab0f3"
          strokeWidth="1.5"
          opacity="0.7"
        />
      </svg>
    ),
  },
];

/* ── Connection Diagram (static SVG) ──────────────────────────── */

function ConnectionDiagram() {
  return (
    <svg
      viewBox="0 0 720 260"
      fill="none"
      className="mx-auto w-full max-w-[720px]"
      role="img"
      aria-label="Diagram showing how VoiceLayer, BrainLayer, and cmuxLayer connect through Claude Code"
    >
      {/* Subtle grid background */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#e5950008"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="720" height="260" fill="url(#grid)" />

      {/* Connection lines — drawn behind nodes */}
      {/* You → VoiceLayer */}
      <path
        d="M 105 70 L 195 70"
        stroke="#2dd4a8"
        strokeWidth="1.5"
        opacity="0.4"
        strokeDasharray="4 4"
      />
      {/* VoiceLayer → Claude Code */}
      <path
        d="M 305 70 L 395 70"
        stroke="#c0b8a8"
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* Claude Code → BrainLayer */}
      <path
        d="M 505 70 L 595 70"
        stroke="#e59500"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Claude Code → cmuxLayer (down) */}
      <path
        d="M 450 100 L 450 150"
        stroke="#6ab0f3"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* cmuxLayer → 3 agent panes */}
      <path
        d="M 370 195 L 310 230"
        stroke="#6ab0f3"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M 450 210 L 450 230"
        stroke="#6ab0f3"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M 530 195 L 590 230"
        stroke="#6ab0f3"
        strokeWidth="1"
        opacity="0.25"
      />
      {/* BrainLayer → remembers label */}
      <path
        d="M 650 100 L 650 140"
        stroke="#e59500"
        strokeWidth="1"
        opacity="0.25"
        strokeDasharray="3 3"
      />

      {/* ── Nodes ── */}
      {/* You */}
      <rect
        x="40"
        y="48"
        width="65"
        height="44"
        rx="10"
        fill="#14120e"
        stroke="#c0b8a830"
        strokeWidth="1"
      />
      <text
        x="72"
        y="75"
        textAnchor="middle"
        fill="#c0b8a8"
        fontSize="13"
        fontFamily="monospace"
      >
        You
      </text>

      {/* VoiceLayer */}
      <rect
        x="195"
        y="44"
        width="110"
        height="52"
        rx="12"
        fill="#14120e"
        stroke="#2dd4a840"
        strokeWidth="1.5"
      />
      <circle cx="220" cy="70" r="6" fill="#2dd4a8" opacity="0.2" />
      <circle cx="220" cy="70" r="3" fill="#2dd4a8" opacity="0.6" />
      <text
        x="258"
        y="75"
        textAnchor="middle"
        fill="#2dd4a8"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        VoiceLayer
      </text>

      {/* Claude Code (center) */}
      <rect
        x="395"
        y="44"
        width="110"
        height="52"
        rx="12"
        fill="#14120e"
        stroke="#c0b8a850"
        strokeWidth="1.5"
      />
      <text
        x="450"
        y="66"
        textAnchor="middle"
        fill="#f0ebe0"
        fontSize="11"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        Claude Code
      </text>
      <text
        x="450"
        y="82"
        textAnchor="middle"
        fill="#b0a89c"
        fontSize="9"
        fontFamily="monospace"
      >
        orchestrates
      </text>

      {/* BrainLayer */}
      <rect
        x="595"
        y="44"
        width="110"
        height="52"
        rx="12"
        fill="#14120e"
        stroke="#e5950040"
        strokeWidth="1.5"
      />
      <circle cx="620" cy="70" r="6" fill="#e59500" opacity="0.2" />
      <circle cx="620" cy="70" r="3" fill="#e59500" opacity="0.6" />
      <text
        x="660"
        y="75"
        textAnchor="middle"
        fill="#e59500"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        BrainLayer
      </text>

      {/* cmuxLayer */}
      <rect
        x="395"
        y="150"
        width="110"
        height="52"
        rx="12"
        fill="#14120e"
        stroke="#6ab0f340"
        strokeWidth="1.5"
      />
      <circle cx="420" cy="176" r="6" fill="#6ab0f3" opacity="0.2" />
      <circle cx="420" cy="176" r="3" fill="#6ab0f3" opacity="0.6" />
      <text
        x="458"
        y="181"
        textAnchor="middle"
        fill="#6ab0f3"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        cmuxLayer
      </text>

      {/* Agent panes */}
      <rect
        x="270"
        y="232"
        width="60"
        height="24"
        rx="6"
        fill="#6ab0f30a"
        stroke="#6ab0f320"
        strokeWidth="1"
      />
      <text
        x="300"
        y="248"
        textAnchor="middle"
        fill="#6ab0f3"
        fontSize="9"
        fontFamily="monospace"
        opacity="0.7"
      >
        test
      </text>

      <rect
        x="420"
        y="232"
        width="60"
        height="24"
        rx="6"
        fill="#6ab0f30a"
        stroke="#6ab0f320"
        strokeWidth="1"
      />
      <text
        x="450"
        y="248"
        textAnchor="middle"
        fill="#6ab0f3"
        fontSize="9"
        fontFamily="monospace"
        opacity="0.7"
      >
        lint
      </text>

      <rect
        x="560"
        y="232"
        width="60"
        height="24"
        rx="6"
        fill="#6ab0f30a"
        stroke="#6ab0f320"
        strokeWidth="1"
      />
      <text
        x="590"
        y="248"
        textAnchor="middle"
        fill="#6ab0f3"
        fontSize="9"
        fontFamily="monospace"
        opacity="0.7"
      >
        deploy
      </text>

      {/* Remembers label */}
      <text
        x="650"
        y="156"
        textAnchor="middle"
        fill="#e59500"
        fontSize="9"
        fontFamily="monospace"
        opacity="0.45"
      >
        remembers
      </text>

      {/* Flow arrows (small triangles) */}
      <polygon points="193,70 187,66 187,74" fill="#2dd4a8" opacity="0.5" />
      <polygon points="393,70 387,66 387,74" fill="#c0b8a8" opacity="0.4" />
      <polygon points="593,70 587,66 587,74" fill="#e59500" opacity="0.5" />
      <polygon points="450,148 446,142 454,142" fill="#6ab0f3" opacity="0.5" />
    </svg>
  );
}

/* ── Hero Section ──────────────────────────────────────────────── */

function HomepageHero() {
  return (
    <header className="relative overflow-hidden bg-[#0c0b0a] pb-12 md:pb-20">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 50% 20%, rgba(229,149,0,0.08) 0%, transparent 70%), radial-gradient(ellipse 400px 300px at 30% 60%, rgba(45,212,168,0.05) 0%, transparent 70%), radial-gradient(ellipse 400px 300px at 70% 60%, rgba(106,176,243,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[900px] px-4 pt-10 md:px-6 md:pt-16">
        {/* Logo + tagline */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/golems-logo.svg"
            alt="Golems logo"
            width={64}
            height={64}
            className="h-12 w-12 drop-shadow-[0_0_24px_rgba(229,149,0,0.4)] md:h-16 md:w-16"
          />

          <div className="flex items-center gap-1.5 font-mono text-[0.7rem] text-[#b0a89c] sm:text-xs">
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

          <h1 className="m-0 max-w-[640px] bg-gradient-to-br from-[#f0ebe0] to-[#e59500] bg-clip-text text-3xl leading-tight font-black tracking-tight text-transparent sm:text-4xl md:text-5xl">
            Your AI agents work alone. They don&apos;t have to.
          </h1>

          <p className="m-0 max-w-[560px] text-base leading-relaxed text-[#b0a89c] sm:text-lg">
            Three open-source MCP servers that give AI agents persistent memory,
            voice I/O, and multi-terminal coordination.{" "}
            <span className="text-[#c0b8a8]">
              {golemsStats.brainlayer.mcpTools + 11 + 22} tools.
            </span>{" "}
            One ecosystem.
          </p>
        </div>

        {/* Connection diagram */}
        <div className="mb-10 hidden sm:block">
          <ConnectionDiagram />
        </div>

        {/* Mobile: simplified flow text */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center sm:hidden">
          <div className="flex items-center gap-2 text-sm text-[#b0a89c]">
            <span className="font-bold text-[#2dd4a8]">Voice</span>
            <span className="text-[#c46d3c] opacity-60">&rarr;</span>
            <span className="font-bold text-[#f0ebe0]">Claude</span>
            <span className="text-[#c46d3c] opacity-60">&rarr;</span>
            <span className="font-bold text-[#e59500]">Memory</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#b0a89c]">
            <span className="font-bold text-[#f0ebe0]">Claude</span>
            <span className="text-[#c46d3c] opacity-60">&rarr;</span>
            <span className="font-bold text-[#6ab0f3]">Orchestrate</span>
          </div>
        </div>

        {/* Product cards */}
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {products.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border bg-[#14120e]/90 p-5 no-underline transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(229,149,0,0.08)]"
              style={{
                borderColor: `${p.color}20`,
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${p.color}10` }}
                >
                  {p.icon}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: p.color }}>
                    {p.name}
                  </div>
                  <div className="text-[0.72rem] text-[#b0a89c]">
                    {p.tagline}
                  </div>
                </div>
              </div>
              <p className="m-0 text-[0.78rem] leading-snug text-[#a09080]">
                {p.description}
              </p>
              <div
                className="mt-3 text-[0.72rem] font-medium opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: p.color }}
              >
                Visit site &rarr;
              </div>
            </a>
          ))}
        </div>

        {/* Install CTA */}
        <div className="flex flex-col items-center gap-4">
          <div className="group relative w-full max-w-md">
            <div className="flex items-center rounded-lg border border-[#2dd4a830] bg-[#0d0d0d] px-4 py-2.5 pr-14">
              <code className="font-mono text-[0.75rem] text-[#2dd4a8] sm:text-sm">
                <span className="text-[#b0a89c]">$</span> npx golems-cli install
              </code>
            </div>
            <CopyButton text="npx golems-cli install" />
          </div>

          <p className="m-0 text-center text-[0.72rem] text-[#b0a89c]">
            Or install individually:{" "}
            <code className="text-[#e59500]">pip install brainlayer</code>
            {" \u00B7 "}
            <code className="text-[#2dd4a8]">npm i voicelayer-mcp</code>
            {" \u00B7 "}
            <code className="text-[#6ab0f3]">npm i cmuxlayer</code>
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/golems/docs/getting-started"
              className="flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#e59500] to-[#c46d3c] px-6 py-2 text-[0.8rem] font-bold text-[#0c0b0a] no-underline transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(229,149,0,0.35)] sm:text-sm"
            >
              Get Started
            </Link>
            <Link
              href="https://github.com/EtanHey/golems"
              className="flex min-h-11 items-center justify-center rounded-lg border border-[#a6998733] px-5 py-2 text-[0.8rem] font-medium text-[#a69987] no-underline transition-all hover:border-[#a6998766] hover:bg-[#a699870f] hover:text-[#c0b8a8] sm:text-sm"
            >
              GitHub &rarr;
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Before/After Comparison ──────────────────────────────────── */

const comparisons = [
  {
    before: "Your agent forgets everything between sessions",
    after: "Persistent memory across every conversation",
    product: "BrainLayer",
    color: "#e59500",
  },
  {
    before: "You type every command by hand",
    after: "Talk to your agents, hear them respond",
    product: "VoiceLayer",
    color: "#2dd4a8",
  },
  {
    before: "One terminal, one task, waiting for each to finish",
    after: "Spawn parallel agents across coordinated panes",
    product: "cmuxLayer",
    color: "#6ab0f3",
  },
];

function BeforeAfterSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0c0b0a] to-[#0a0908] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e5950033] to-transparent" />
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          What Changes
        </h2>
        <p className="mb-10 text-center text-[#b0a89c] italic">
          Three problems. Three open-source solutions.
        </p>

        <div className="flex flex-col gap-4">
          {comparisons.map((c) => (
            <div
              key={c.product}
              className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border sm:grid-cols-[1fr_auto_1fr]"
              style={{ borderColor: `${c.color}15` }}
            >
              {/* Before */}
              <div className="flex items-center gap-3 bg-[#14120e]/90 px-5 py-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff555520] text-xs font-bold text-[#ff5555]">
                  &times;
                </div>
                <p className="m-0 text-sm leading-snug text-[#a09080]">
                  {c.before}
                </p>
              </div>

              {/* Arrow divider */}
              <div
                className="hidden items-center justify-center bg-[#14120e]/90 px-3 sm:flex"
                style={{ color: c.color }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
              </div>

              {/* After */}
              <div className="flex items-center gap-3 bg-[#14120e]/90 px-5 py-4">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${c.color}20`,
                    color: c.color,
                  }}
                >
                  &#10003;
                </div>
                <div>
                  <p className="m-0 text-sm leading-snug text-[#e8e2d6]">
                    {c.after}
                  </p>
                  <span
                    className="mt-0.5 inline-block text-[0.7rem] font-bold"
                    style={{ color: c.color }}
                  >
                    {c.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Get Started Section ───────────────────────────────────────── */

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

function GetStartedSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0c0b0a] to-[#0a0908] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e5950033] to-transparent" />
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          Get Started in 60 Seconds
        </h2>
        <p className="mb-12 text-center text-[#b0a89c] italic">
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
              <p className="m-0 text-[0.8rem] leading-snug text-[#b0a89c]">
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

/* ── Ecosystem Section (golems + tools) ────────────────────────── */

const golems = [
  {
    emoji: "\uD83D\uDCC5",
    name: "Coach",
    desc: "Primary golem \u2014 health, schedule, recruiting, content, admin, daily planning.",
    link: "/golems/docs/golems/coach",
  },
  {
    emoji: "\uD83E\uDD16",
    name: "Claude",
    desc: "Telegram bot \u2014 routes commands, spawns sessions, manages notifications.",
    link: "/golems/docs/golems/claude",
  },
  {
    emoji: "\uD83D\uDCBC",
    name: "Recruiter",
    desc: "Job hunt \u2014 board scraping, outreach, follow-ups, 7-mode interview practice.",
    link: "/golems/docs/golems/recruiter",
  },
  {
    emoji: "\uD83C\uDF19",
    name: "Services",
    desc: "Infrastructure \u2014 Night Shift (4am), Morning Briefing, cloud workers, nightly docs.",
    link: "/golems/docs/packages/services",
  },
];

function EcosystemSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0c0b0a] to-[#080807] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e5950026] to-transparent" />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          The Ecosystem
        </h2>
        <p className="mb-10 text-center text-[#b0a89c] italic">
          4 domain golems, {golemsStats.skills.count} skills, 3 daemon MCPs, and
          a CLI.
        </p>

        {/* Golems — compact list */}
        <div className="mb-10">
          <h3 className="mb-4 text-base font-bold text-[#e59500]">Golems</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {golems.map((g) => (
              <Link
                key={g.name}
                href={g.link}
                className="flex items-center gap-3 rounded-lg border border-[#c46d3c1a] bg-[#14120e]/90 px-4 py-3 no-underline transition-colors hover:border-[#e5950040]"
              >
                <span className="text-lg">{g.emoji}</span>
                <span className="text-sm font-bold text-[#e8e2d6]">
                  {g.name}
                </span>
                <span className="text-[0.78rem] text-[#b0a89c]">{g.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools & MCPs */}
        <div>
          <h3 className="mb-4 text-base font-bold text-[#2dd4a8]">
            Tools &amp; MCPs
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Link
              href="/golems/skills"
              className="rounded-lg border border-[#e5950014] bg-[#14120e]/90 px-4 py-3 no-underline transition-colors hover:border-[#e5950040]"
            >
              <div className="text-lg font-bold text-[#e59500]">
                {golemsStats.skills.count}
              </div>
              <div className="text-sm font-medium text-[#e8e2d6]">Skills</div>
              <div className="text-[0.75rem] text-[#b0a89c]">
                Reusable Claude Code slash commands
              </div>
            </Link>
            <div className="rounded-lg border border-[#2dd4a814] bg-[#14120e]/90 px-4 py-3">
              <div className="text-lg font-bold text-[#2dd4a8]">3</div>
              <div className="text-sm font-medium text-[#e8e2d6]">
                Daemon MCPs
              </div>
              <div className="text-[0.75rem] text-[#b0a89c]">
                BrainLayer ({golemsStats.brainlayer.chunksDisplay} chunks) +
                VoiceLayer + cmuxlayer
              </div>
            </div>
            <div className="rounded-lg border border-[#6ab0f314] bg-[#14120e]/90 px-4 py-3">
              <div className="text-lg font-bold text-[#6ab0f3]">CLI</div>
              <div className="text-sm font-medium text-[#e8e2d6]">
                golems-cli
              </div>
              <div className="text-[0.75rem] text-[#b0a89c]">
                wizard, status, recruit, coach, logs
              </div>
            </div>
          </div>
        </div>

        {/* Agents */}
        <div className="mt-10">
          <h3 className="mb-4 text-base font-bold text-[#f97316]">Agents</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              {
                name: "coachClaude",
                desc: "Health, schedule, recruiting, daily planning",
              },
              {
                name: "orcClaude",
                desc: "Cross-repo orchestrator, multi-agent sprints",
              },
              {
                name: "maintenanceClaude",
                desc: "README, docs, portfolio updates with verification",
              },
              {
                name: "publicistClaude",
                desc: "LinkedIn, content creation, showcase videos",
              },
              {
                name: "contentClaude",
                desc: "ClaudeGolem brand content across platforms",
              },
              {
                name: "interviewClaude",
                desc: "7-mode interview practice with Elo tracking",
              },
            ].map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 rounded-lg border border-[#f9731620] bg-[#14120e]/90 px-4 py-3"
              >
                <span className="font-mono text-sm font-bold text-[#f97316]">
                  {a.name}
                </span>
                <span className="text-[0.78rem] text-[#b0a89c]">{a.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#b0a89c]">
            Agents are skills loaded as persistent identities via{" "}
            <code className="text-[#6ab0f3]">claude --agent</code>
          </p>
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
        <p className="mb-12 text-center text-[#b0a89c] italic">
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
                "BrainLayer MCP",
                "VoiceLayer MCP",
              ].map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm text-[#a69987] before:text-[#c46d3c] before:content-['\\2022_']"
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
                    className="font-mono text-sm text-[#a69987] before:text-[#c46d3c] before:content-['\\2022_']"
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

/* ── Cross-AI Portability Section ──────────────────────────────── */

function CrossAISection() {
  const evals = [
    {
      cli: "Codex",
      model: "GPT-5.4",
      score: "8/10",
      note: "Before universal fallbacks were added",
      color: "#f97316",
    },
    {
      cli: "Gemini",
      model: "2.5 Pro",
      score: "10/10",
      note: "Perfect — read fallback table correctly",
      color: "#4285f4",
    },
    {
      cli: "Kiro",
      model: "Default",
      score: "9.5/10",
      note: "One buried detail missed, now explicit",
      color: "#ec4899",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#0a0908] to-[#0c0b0a] py-12 md:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#f9731626] to-transparent" />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#f0ebe0] sm:text-4xl">
          Skills Work on Any AI
        </h2>
        <p className="mb-10 text-center text-[#b0a89c] italic">
          3-layer adapter architecture · validated across 3 non-Claude CLIs
        </p>

        {/* Architecture layers */}
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              layer: "Layer 1",
              title: "SKILL.md",
              desc: "Universal best practices with platform-agnostic fallbacks. Any AI can follow it.",
              color: "#e59500",
            },
            {
              layer: "Layer 2",
              title: "capabilities.yaml",
              desc: "Machine-readable feature matrix. Routes tasks to the right CLI automatically.",
              color: "#2dd4a8",
            },
            {
              layer: "Layer 3",
              title: "adapters/",
              desc: "Exact flags, models, and syntax per CLI. One file per AI. 40-80 lines each.",
              color: "#6ab0f3",
            },
          ].map((l) => (
            <div
              key={l.layer}
              className="rounded-xl border p-4"
              style={{
                borderColor: `${l.color}20`,
                backgroundColor: `${l.color}06`,
              }}
            >
              <div
                className="mb-1 font-mono text-xs font-bold"
                style={{ color: l.color }}
              >
                {l.layer}
              </div>
              <div className="mb-1 text-sm font-bold text-[#e8e2d6]">
                {l.title}
              </div>
              <div className="text-[0.75rem] leading-snug text-[#b0a89c]">
                {l.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Cross-AI eval results */}
        <div className="mb-6">
          <h3 className="mb-4 text-sm font-bold tracking-wider text-[#b0a89c] uppercase">
            Cross-AI Portability Eval — cmux-agents (Mar 2026)
          </h3>
          <div className="space-y-2">
            {evals.map((e) => (
              <div
                key={e.cli}
                className="flex items-center gap-4 rounded-lg border px-4 py-3"
                style={{
                  borderColor: `${e.color}20`,
                  backgroundColor: `${e.color}06`,
                }}
              >
                <span
                  className="w-16 shrink-0 font-mono text-sm font-bold"
                  style={{ color: e.color }}
                >
                  {e.cli}
                </span>
                <span className="w-20 shrink-0 text-xs text-[#b0a89c]">
                  {e.model}
                </span>
                <span
                  className="w-14 shrink-0 text-center text-lg font-extrabold"
                  style={{ color: e.color }}
                >
                  {e.score}
                </span>
                <span className="text-[0.75rem] text-[#b8ad9e]">{e.note}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#b0a89c]">
            Scores above are weighted rubric totals (partial credit for 4/5).
            The{" "}
            <Link
              href="/golems/skills/cmux-agents"
              className="text-[#e59500] no-underline hover:underline"
            >
              detail page →
            </Link>{" "}
            shows binary assertion pass rates (pass = 5/5 only).
          </p>
        </div>

        {/* Skills with adapters */}
        <div className="rounded-xl border border-[#e5950014] bg-[#14120e]/90 px-5 py-4">
          <p className="mb-2 text-xs font-bold tracking-wider text-[#b0a89c] uppercase">
            Skills with adapter support
          </p>
          <div className="flex flex-wrap gap-2">
            {["cmux-agents", "pr-loop", "commit", "coach"].map((s) => (
              <Link
                key={s}
                href={`/golems/skills/${s}`}
                className="rounded-lg border border-[#e5950020] bg-[#e595000a] px-3 py-1.5 font-mono text-xs font-bold text-[#e59500] no-underline transition-colors hover:border-[#e5950060]"
              >
                /{s}
              </Link>
            ))}
          </div>
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
      <BeforeAfterSection />
      <GetStartedSection />
      <EcosystemSection />
      <SkillsShowcase />
      <CrossAISection />
      <ArchitectureSection />
    </>
  );
}
