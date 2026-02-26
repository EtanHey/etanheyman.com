// Detailed architecture content for mini-site /architecture pages.
// Separate from project-showcase-config to avoid bloating the shared config.

import type { ArchitectureNode } from "./project-showcase-config";

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface InsightCallout {
  title: string;
  text: string;
}

export interface ComparisonTable {
  headers: string[];
  rows: string[][];
}

export interface ArchitectureSection {
  title: string;
  description: string;
  diagramNodes?: ArchitectureNode[];
  codeExample?: CodeExample;
  callout?: InsightCallout;
  comparisonTable?: ComparisonTable;
}

const architectureData: Record<string, ArchitectureSection[]> = {
  brainlayer: [
    {
      title: "Data Pipeline",
      description:
        "Every Claude Code session produces JSONL transcripts. BrainLayer's 4-stage pipeline transforms these raw conversations into searchable knowledge: Extract parses session files and detects continuation chains. Classify identifies content types — user messages, AI code, stack traces, file reads — with content-aware length thresholds. Chunk splits text using AST-aware code parsing (tree-sitter) and paragraph-based text splitting, targeting ~2000 chars per chunk. Finally, Embed generates 1024-dimensional vectors using bge-large-en-v1.5 and stores them in SQLite with sqlite-vec.",
      diagramNodes: [
        {
          icon: "MessageSquare",
          title: "Extract",
          subtitle: "JSONL → sessions",
        },
        {
          icon: "FileText",
          title: "Classify",
          subtitle: "Content-type detection",
        },
        { icon: "Scissors", title: "Chunk", subtitle: "AST-aware splitting" },
        { icon: "Binary", title: "Embed", subtitle: "bge-large 1024-dim" },
        { icon: "Database", title: "Store", subtitle: "SQLite + sqlite-vec" },
      ],
    },
    {
      title: "Hybrid Search",
      description:
        "Finding relevant memories requires more than vector similarity. BrainLayer runs two search strategies in parallel and fuses the results. Semantic search finds conceptually similar content using 1024-dim embeddings with K-nearest-neighbor lookup (3x oversampling). FTS5 keyword search catches exact matches that semantic search might miss. Reciprocal Rank Fusion (RRF) combines both ranked lists using the formula score = 1/(k + rank), where k=60 prevents any single high rank from dominating.",
      codeExample: {
        language: "python",
        code: `# Reciprocal Rank Fusion (k=60)
for chunk_id in all_results:
    score = 0.0
    if chunk_id in semantic_results:
        score += 1.0 / (60 + semantic_rank)
    if chunk_id in fts_results:
        score += 1.0 / (60 + fts_rank)
    fused[chunk_id] = score

return sorted(fused, reverse=True)[:n]`,
        caption: "Results appearing in both lists get higher scores",
      },
    },
    {
      title: "Enrichment Pipeline",
      description:
        "Raw chunks are useful but lack structure. A local LLM (GLM-4.7-Flash or Qwen2.5-Coder-14B on Apple Silicon via MLX) enriches each chunk with 10 metadata fields: summary, tags, importance score (1-10), intent classification, primary code symbols, a hypothetical query for HyDE-style retrieval, epistemic level, version scope, tech debt impact, and external dependencies. Processing runs at ~50-100 chunks per batch with 5-minute stall detection per chunk.",
      callout: {
        title: "Why local LLM?",
        text: "328K+ chunks at ~$0.01/chunk via cloud API = $3,280. Local GLM-4.7-Flash costs $0 in electricity. The enrichment quality is comparable for structured extraction tasks, and no data leaves the machine.",
      },
    },
    {
      title: "Why SQLite",
      description:
        "BrainLayer stores everything in a single .db file using SQLite + sqlite-vec for vectors and FTS5 for keyword search. This isn't a compromise — it's a deliberate architectural choice. The database ships with the package, requires zero infrastructure, and handles concurrent access from the daemon, MCP server, and enrichment workers via APSW with a 5-second busy timeout.",
      comparisonTable: {
        headers: ["", "BrainLayer", "pgvector", "Pinecone", "Chroma"],
        rows: [
          [
            "Deployment",
            "pip install",
            "PostgreSQL server",
            "Cloud SaaS",
            "Docker/Cloud",
          ],
          ["Cost", "Free", "Server costs", "$0.04/1M vec/mo", "Free (OSS)"],
          ["Offline", "Yes", "Needs DB conn", "No", "Needs server"],
          ["Portability", "Copy .db file", "pg_dump", "N/A", "Export"],
          [
            "Hybrid search",
            "FTS5 built-in",
            "Separate plugin",
            "Vector only",
            "Limited",
          ],
        ],
      },
    },
    {
      title: "MCP Integration",
      description:
        "7 MCP tools expose BrainLayer's full capability to any Claude Code session. 3 core memory tools (brain_search, brain_store, brain_recall) handle search, persistence, and recall. 4 knowledge graph tools (brain_digest, brain_entity, brain_update, brain_get_person) add entity extraction, lookup, updates, and person profiles. From 14 specialized tools to 7 that just work — backward-compat aliases for existing workflows.",
      diagramNodes: [
        {
          icon: "Brain",
          title: "Think",
          subtitle: "Task-aware context",
        },
        { icon: "Search", title: "Search", subtitle: "Hybrid query + filters" },
        { icon: "FileText", title: "Recall", subtitle: "File & topic history" },
        {
          icon: "MessageSquare",
          title: "Context",
          subtitle: "Expand results",
        },
        {
          icon: "Wrench",
          title: "Tools",
          subtitle: "7 total",
          children: [
            "brain_search",
            "brain_store",
            "brain_recall",
            "brain_digest",
            "brain_entity",
            "brain_update",
            "brain_get_person",
          ],
        },
      ],
    },
  ],

  voicelayer: [
    {
      title: "Voice Tools Pipeline",
      description:
        "VoiceLayer implements 2 tools with auto-mode detection. voice_speak handles text-to-speech (announce, brief, consult). voice_ask enables full bidirectional Q&A with session booking. The system automatically picks the right interaction pattern — fire-and-forget announcements, slower-paced briefings, or full conversation — based on context.",
      diagramNodes: [
        { icon: "Volume2", title: "voice_speak", subtitle: "TTS, auto rate" },
        {
          icon: "MessageSquare",
          title: "voice_ask",
          subtitle: "Q&A + session lock",
        },
        {
          icon: "Zap",
          title: "Auto mode",
          subtitle: "Context-aware selection",
        },
      ],
    },
    {
      title: "Speech-to-Text Flow",
      description:
        "Recording uses sox at 16kHz mono PCM, processed in 1-second chunks with RMS energy detection for silence. Transcription runs through whisper.cpp locally (~200-400ms on Apple Silicon) with automatic model discovery from ~/.cache/whisper/. A cloud fallback via Wispr Flow WebSocket API handles cases where local transcription isn't available. Users stop recording by touching a signal file — Unix philosophy at its simplest.",
      codeExample: {
        language: "text",
        code: `sox rec (16kHz mono) → WAV buffer
    ↓
whisper.cpp (local, ~300ms)
  OR Wispr Flow (cloud fallback)
    ↓
Transcription → Agent response

Stop: touch /tmp/voicelayer-stop`,
        caption: "Dual-backend STT with filesystem-based stop signal",
      },
      callout: {
        title: "~300ms latency",
        text: "whisper.cpp on Apple Silicon with ggml-large-v3-turbo achieves near-instant transcription. No cloud roundtrip, no API keys, no data leaving your machine.",
      },
    },
    {
      title: "Text-to-Speech Flow",
      description:
        "Edge-TTS provides neural-quality speech synthesis for free. Speech rate auto-adjusts based on content length — shorter messages play faster (+10%), longer explanations slow down (-15% for 1000+ chars). Each voice mode has its own rate default: announce is snappy, brief is deliberate. Users can interrupt playback at any time by touching the stop signal file, which a 300ms polling loop monitors during audio output.",
      diagramNodes: [
        { icon: "FileText", title: "Text", subtitle: "Agent response" },
        { icon: "Volume2", title: "Edge-TTS", subtitle: "Neural synthesis" },
        {
          icon: "Radio",
          title: "Rate Adjust",
          subtitle: "Mode + length aware",
        },
        { icon: "Mic", title: "Play", subtitle: "afplay / mpv" },
      ],
    },
    {
      title: "Session Booking",
      description:
        "Only one session can use the microphone at a time. VoiceLayer solves this with a lockfile mutex — a JSON file at /tmp/voicelayer-session.lock containing the owning PID, session ID, and start timestamp. Lock creation uses atomic wx write flags to prevent race conditions. Dead process detection uses the signal-zero trick: process.kill(pid, 0) throws ESRCH for dead processes, enabling automatic stale lock cleanup.",
      codeExample: {
        language: "typescript",
        code: `// Atomic lock creation (TOCTOU-safe)
writeFileSync(lockPath, JSON.stringify({
  pid: process.pid,
  sessionId,
  startedAt: new Date().toISOString()
}), { flag: 'wx' });

// Dead process detection
try {
  process.kill(lockPid, 0); // alive
} catch {
  unlinkSync(lockPath);     // stale → cleanup
}`,
        caption: "Lockfile mutex with dead process cleanup",
      },
      callout: {
        title: "Why lockfile over semaphore?",
        text: "Lockfiles are simple filesystem artifacts that work across process boundaries without kernel objects or special privileges. Dead process detection via signal-zero is a Unix classic that's both elegant and reliable.",
      },
    },
  ],

  golems: [
    {
      title: "Monorepo Structure",
      description:
        "13 packages organized in a Bun monorepo. @golems/shared provides the foundation — Supabase client, multi-backend LLM routing, email processing, and state management. Domain golems (jobs, recruiter, coach, teller, content) are self-contained Claude Code plugins. Ralph handles autonomous PRD execution. The dashboard is a Next.js 16 app with 3D brain visualization. Each package is independently deployable but shares types and utilities through the foundation layer.",
      diagramNodes: [
        {
          icon: "Package",
          title: "Foundation",
          subtitle: "@golems/shared",
          children: ["Supabase", "LLM Router", "Email", "State"],
        },
        {
          icon: "Bot",
          title: "Domain",
          subtitle: "7 golems",
          children: ["Jobs", "Recruiter", "Coach", "Teller", "Content"],
        },
        {
          icon: "Zap",
          title: "Autonomy",
          subtitle: "Ralph + Night Shift",
        },
        {
          icon: "Monitor",
          title: "Dashboard",
          subtitle: "Next.js 16 + Three.js",
        },
        {
          icon: "Send",
          title: "Telegram",
          subtitle: "Grammy bot",
        },
      ],
    },
    {
      title: "Cloud + Local Split",
      description:
        "Golems runs across two environments, each optimized for its workload. Railway hosts the cloud worker — a single service running scheduled cron tasks: email polling (hourly), job scraping (3x/day Sun-Thu), daily briefing generation, and content learning. macOS handles everything real-time: the Telegram bot (Grammy, port 3847), BrainLayer memory indexing, VoiceLayer voice I/O, and Night Shift autonomous coding at 4am via launchd.",
      comparisonTable: {
        headers: ["", "Railway (Cloud)", "macOS (Local)"],
        rows: [
          ["Workload", "Scheduled cron tasks", "Real-time services"],
          [
            "LLM Backend",
            "Gemini Flash-Lite (free)",
            "MLX / GLM (free) → Haiku (paid)",
          ],
          ["State", "Supabase", "Local files"],
          [
            "Services",
            "Email, Jobs, Briefing",
            "Telegram, Memory, Voice, Night Shift",
          ],
          ["Cost", "~$5/mo Railway", "$0 (Mac Mini)"],
        ],
      },
    },
    {
      title: "Multi-LLM Routing",
      description:
        "Every LLM call goes through a unified routing layer that prioritizes free models. The routing hierarchy: MLX on Apple Silicon (21-87% faster than Ollama, $0) → local GLM-4.7-Flash via Ollama ($0) → Gemini 2.5 Flash-Lite (free tier, 1K RPD) → Groq Llama 4 Scout (free tier) → Claude Haiku 4.5 (paid, only when free options are exhausted). The same runLLM() interface works everywhere — backend selection is an environment variable.",
      codeExample: {
        language: "typescript",
        code: `// Same interface, any backend
import { runLLM } from "@golems/shared/lib/llm";

const result = await runLLM(prompt);
// Routes based on LLM_BACKEND env var:
// "mlx" → local Apple Silicon (fastest)
// "glm" → local Ollama (free)
// "gemini" → cloud free tier
// "haiku" → paid fallback`,
        caption: "Consumer code is identical regardless of LLM backend",
      },
    },
    {
      title: "Autonomous Loop",
      description:
        "Ralph transforms PRD stories into working code without human intervention. The /prd skill creates structured stories with acceptance criteria. Ralph spawns fresh Claude instances per story, implements the code, and gates every commit behind CodeRabbit AI review. Failed reviews trigger automatic fix-iterate-review cycles (max 3). Night Shift extends this at 4am — scanning repos for TODOs and improvements, creating worktrees, and shipping PRs while the developer sleeps.",
      diagramNodes: [
        { icon: "FileText", title: "PRD", subtitle: "Stories + criteria" },
        { icon: "Bot", title: "Ralph", subtitle: "Spawn Claude" },
        { icon: "Wrench", title: "Implement", subtitle: "Code generation" },
        { icon: "Shield", title: "CodeRabbit", subtitle: "AI review gate" },
        { icon: "GitBranch", title: "Commit", subtitle: "Auto-merge" },
      ],
      callout: {
        title: "CodeRabbit as quality gate",
        text: "Every autonomous commit must pass AI code review first. If CodeRabbit finds issues, Ralph fixes them automatically. If the fix fails after 3 attempts, it creates a BUG story instead of shipping broken code.",
      },
    },
    {
      title: "MCP Ecosystem",
      description:
        "8 MCP servers provide 60+ tools across the ecosystem. BrainLayer contributes 7 tools — 3 core memory (brain_search, brain_store, brain_recall) + 4 knowledge graph (brain_digest, brain_entity, brain_update, brain_get_person). The email server handles triage with 7 tools. VoiceLayer exposes 2 voice tools (voice_speak, voice_ask). Supabase provides database access. Specialized servers for web search (Exa), financial data (Sophtron), and local LLM inference (GLM) round out the toolkit. Each golem declares which MCP servers it needs — the orchestrator ensures they're available at session startup.",
      diagramNodes: [
        {
          icon: "Brain",
          title: "BrainLayer",
          subtitle: "7 tools",
        },
        { icon: "Mail", title: "Email", subtitle: "7 tools" },
        { icon: "Mic", title: "VoiceLayer", subtitle: "2 tools" },
        { icon: "Database", title: "Supabase", subtitle: "SQL + DDL" },
        {
          icon: "Wrench",
          title: "Others",
          subtitle: "25+ tools",
          children: ["Exa", "Sophtron", "GLM", "Jobs"],
        },
      ],
    },
  ],
};

export function getArchitectureData(
  slug: string,
): ArchitectureSection[] | null {
  return architectureData[slug] ?? null;
}
