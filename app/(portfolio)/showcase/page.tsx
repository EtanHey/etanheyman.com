import Link from "next/link";
import type { Metadata } from "next";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Brain,
  Mic,
  Bot,
  GitPullRequest,
  Moon,
  Layers,
  Cpu,
  Database,
  Cloud,
  Repeat,
} from "lucide-react";
import {
  TechIconWrapper,
  TechIconName,
} from "@/app/components/tech-icons/TechIconWrapper";
import { ShowcaseStats } from "./components/ShowcaseStats";
import { WorkflowDiagram } from "./components/WorkflowDiagram";

export const metadata: Metadata = {
  title: "Etan Heyman — AI Systems Engineer",
  description:
    "Builder of autonomous AI agent ecosystems. BrainLayer (268K+ memory chunks), VoiceLayer (local voice I/O), Golems (10-package monorepo, 7 domain agents). 150+ PRs with autonomous coding loops and AI code review.",
  openGraph: {
    title: "Etan Heyman — AI Systems Engineer",
    description:
      "Builder of autonomous AI agent ecosystems. BrainLayer, VoiceLayer, Golems.",
    type: "website",
    url: "https://etanheyman.com/showcase",
  },
};

const FLAGSHIP_PROJECTS = [
  {
    slug: "brainlayer",
    title: "BrainLayer",
    tagline: "Persistent Memory for AI Agents",
    stat: "268K+",
    statLabel: "indexed chunks",
    color: "#8B5CF6",
    colorRgb: "139, 92, 246",
    icon: Brain,
    highlights: [
      "14 MCP tools",
      "Hybrid semantic + keyword search",
      "Local LLM enrichment pipeline",
      "pip install brainlayer",
    ],
  },
  {
    slug: "voicelayer",
    title: "VoiceLayer",
    tagline: "Voice I/O for AI Coding Agents",
    stat: "~300ms",
    statLabel: "STT latency",
    color: "#10B981",
    colorRgb: "16, 185, 129",
    icon: Mic,
    highlights: [
      "7 MCP tools, 5 voice modes",
      "Local whisper.cpp transcription",
      "Session booking (lockfile mutex)",
      "bunx voicelayer-mcp",
    ],
  },
  {
    slug: "golems",
    title: "Golems",
    tagline: "Autonomous AI Agent Ecosystem",
    stat: "150+",
    statLabel: "PRs merged",
    color: "#F59E0B",
    colorRgb: "245, 158, 11",
    icon: Bot,
    highlights: [
      "10 packages, 7 domain agents",
      "Multi-LLM cost-optimized routing",
      "Cloud + local split architecture",
      "Autonomous coding loop (Ralph)",
    ],
  },
];

const WORKFLOW_STEPS = [
  {
    iconName: "Terminal",
    title: "Write PRD",
    description: "Define stories with acceptance criteria",
  },
  {
    iconName: "Repeat",
    title: "Ralph Executes",
    description: "Autonomous loop picks up stories",
  },
  {
    iconName: "GitPullRequest",
    title: "AI Code Review",
    description: "CodeRabbit reviews every PR",
  },
  {
    iconName: "Zap",
    title: "Auto-Merge",
    description: "Pass review → merge → next story",
  },
  {
    iconName: "Moon",
    title: "Night Shift",
    description: "3am autonomous improvements",
  },
];

const TECH_STACK: TechIconName[] = [
  "React",
  "NextJS",
  "Python",
  "Node",
  "Tailwind",
  "Docker",
  "Railway",
  "Ollama",
  "MCP",
  "HuggingFace",
  "WhisperCpp",
  "SqliteVec",
];

export default function ShowcasePage() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
      {/* ─── Hero ─── */}
      <section className="mb-20 md:mb-28">
        <p className="mb-4 font-mono text-[11px] tracking-[0.25em] text-[#0F82EB]/60 uppercase md:text-[12px]">
          AI Systems Engineer
        </p>
        <h1 className="mb-6 font-[Nutmeg] text-[36px] font-bold leading-[1.08] text-white md:text-[72px]">
          I build systems
          <br />
          that build
          <span className="text-[#0F82EB]"> themselves</span>
        </h1>
        <p className="mb-8 max-w-[640px] font-[Nutmeg] text-[15px] font-light leading-relaxed text-white/50 md:text-[18px]">
          Autonomous AI agent ecosystems with persistent memory, voice I/O, and
          self-improving coding loops. Not wrappers around APIs — full
          production infrastructure.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/EtanHey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-[Nutmeg] text-[13px] font-light text-white/60 transition-all hover:border-white/25 hover:text-white/90"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/etanheyman"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-[Nutmeg] text-[13px] font-light text-white/60 transition-all hover:border-white/25 hover:text-white/90"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="mailto:etan@heyman.net"
            className="flex items-center gap-2 rounded-full bg-[#0F82EB] px-5 py-2.5 font-[Nutmeg] text-[13px] font-light text-white transition-all hover:bg-[#0D6FCA]"
          >
            <Mail className="h-4 w-4" />
            Get in touch
          </a>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="mb-20 md:mb-28">
        <ShowcaseStats />
      </section>

      {/* ─── Flagship Projects ─── */}
      <section className="mb-20 md:mb-28">
        <h2 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          Flagship projects
        </h2>
        <p className="mb-10 max-w-[520px] font-[Nutmeg] text-[14px] font-light text-white/40">
          Three interconnected systems. BrainLayer gives agents memory.
          VoiceLayer gives them a voice. Golems orchestrates everything.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {FLAGSHIP_PROJECTS.map((project) => {
            const Icon = project.icon;
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.14]"
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at top left, rgba(${project.colorRgb}, 0.08), transparent 60%)`,
                  }}
                />
                <div className="relative">
                  {/* Icon + accent bar */}
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `rgba(${project.colorRgb}, 0.12)`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: project.color }}
                      />
                    </div>
                    <div
                      className="h-[2px] flex-1 rounded-full"
                      style={{
                        background: `linear-gradient(to right, rgba(${project.colorRgb}, 0.3), transparent)`,
                      }}
                    />
                  </div>

                  {/* Title + tagline */}
                  <h3 className="mb-1 font-[Nutmeg] text-[18px] font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mb-4 font-[Nutmeg] text-[12px] font-light text-white/40">
                    {project.tagline}
                  </p>

                  {/* Key stat */}
                  <div className="mb-5">
                    <span
                      className="font-mono text-[28px] font-bold leading-none"
                      style={{ color: project.color }}
                    >
                      {project.stat}
                    </span>
                    <span className="ml-2 font-mono text-[11px] text-white/35 uppercase">
                      {project.statLabel}
                    </span>
                  </div>

                  {/* Highlights */}
                  <ul className="mb-5 space-y-1.5">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="font-mono text-[11px] leading-snug text-white/35"
                      >
                        <span
                          className="mr-1.5 inline-block h-1 w-1 rounded-full align-middle"
                          style={{ backgroundColor: project.color }}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-1 font-mono text-[11px] transition-colors group-hover:brightness-125"
                    style={{ color: project.color }}
                  >
                    View project
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── How I Build — The Autonomous Workflow ─── */}
      <section className="mb-20 md:mb-28">
        <h2 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          How I build
        </h2>
        <p className="mb-10 max-w-[560px] font-[Nutmeg] text-[14px] font-light text-white/40">
          Not just writing code — orchestrating autonomous systems that write,
          review, and ship code while I sleep.
        </p>
        <WorkflowDiagram steps={WORKFLOW_STEPS} />

        {/* Workflow detail cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Repeat className="h-4 w-4 text-[#0F82EB]" />
              <h3 className="font-mono text-[12px] font-semibold text-white/80">
                Ralph — Autonomous Loop
              </h3>
            </div>
            <p className="font-[Nutmeg] text-[12px] font-light leading-relaxed text-white/35">
              Reads PRD stories, creates branches, implements features, runs
              CodeRabbit review, fixes feedback, commits. Full cycle without
              human intervention.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0F82EB]" />
              <h3 className="font-mono text-[12px] font-semibold text-white/80">
                Multi-Agent Orchestration
              </h3>
            </div>
            <p className="font-[Nutmeg] text-[12px] font-light leading-relaxed text-white/35">
              5+ CLI agents (Gemini, Cursor, Codex, Kiro, Claude) working in
              parallel. Research agents feed implementation agents. Cost-optimized
              LLM routing.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Moon className="h-4 w-4 text-[#0F82EB]" />
              <h3 className="font-mono text-[12px] font-semibold text-white/80">
                Night Shift — 3am Improvements
              </h3>
            </div>
            <p className="font-[Nutmeg] text-[12px] font-light leading-relaxed text-white/35">
              Autonomous coding session runs while I sleep. Scans for TODOs,
              creates worktrees, implements improvements, commits. Telegram
              notification on wake.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Architecture Principles ─── */}
      <section className="mb-20 md:mb-28">
        <h2 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          Architecture
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: Cpu,
              title: "Local-First AI",
              desc: "whisper.cpp for STT, Ollama for LLM, sqlite-vec for embeddings. No data leaves the machine unless you want it to.",
            },
            {
              icon: Database,
              title: "Cost-Optimized Multi-LLM",
              desc: "Free tier first (Gemini Flash-Lite, local GLM-4.7-Flash), paid only when quality demands it. Every call tagged for cost attribution.",
            },
            {
              icon: Cloud,
              title: "Cloud + Local Split",
              desc: "Railway for scheduled cloud work (email, jobs, briefings). Mac for real-time services (Telegram bot, memory, voice).",
            },
            {
              icon: GitPullRequest,
              title: "AI-Gated Merges",
              desc: "Every PR reviewed by CodeRabbit. No human merge without passing AI review. BUG stories auto-created from review failures.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0F82EB]/60" />
                <div>
                  <h3 className="mb-1 font-mono text-[12px] font-semibold text-white/80">
                    {item.title}
                  </h3>
                  <p className="font-[Nutmeg] text-[12px] font-light leading-relaxed text-white/35">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section className="mb-20 md:mb-28">
        <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          Tech stack
        </h2>
        <div className="grid grid-cols-6 gap-[23.45px] md:grid-cols-12 xl:gap-8">
          {TECH_STACK.map((tech) => (
            <TechIconWrapper key={tech} name={tech} />
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="text-center">
        <h2 className="mb-3 font-[Nutmeg] text-[24px] font-bold text-white md:text-[36px]">
          Interested?
        </h2>
        <p className="mx-auto mb-8 max-w-[400px] font-[Nutmeg] text-[14px] font-light text-white/40">
          I&apos;m looking for my next challenge — ideally somewhere AI meets
          infrastructure at scale.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:etan@heyman.net"
            className="flex items-center gap-2 rounded-full bg-[#0F82EB] px-6 py-3 font-[Nutmeg] text-[14px] text-white transition-all hover:bg-[#0D6FCA]"
          >
            <Mail className="h-4 w-4" />
            etan@heyman.net
          </a>
          <a
            href="https://linkedin.com/in/etanheyman"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-[Nutmeg] text-[14px] text-white/60 transition-all hover:border-white/25 hover:text-white/90"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <Link
            href="/about"
            className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-[Nutmeg] text-[14px] text-white/60 transition-all hover:border-white/25 hover:text-white/90"
          >
            Full Profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
