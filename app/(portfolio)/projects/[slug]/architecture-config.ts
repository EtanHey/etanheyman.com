// Detailed architecture content for mini-site /architecture pages.
// Separate from project-showcase-config to avoid bloating the shared config.

import type { ArchitectureNode } from "./project-showcase-config";
import golemsStats from "@/app/(golems)/golems/lib/golems-stats.json";

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

export interface ToolListItem {
  name: string;
  description: string;
}

export interface ArchitectureSection {
  title: string;
  description: string;
  diagramNodes?: ArchitectureNode[];
  toolList?: ToolListItem[];
  codeExample?: CodeExample;
  callout?: InsightCallout;
  comparisonTable?: ComparisonTable;
}

const architectureData: Record<string, ArchitectureSection[]> = {
  brainlayer: [
    {
      title: "Data Pipeline",
      description:
        "Every Claude Code session produces JSONL transcripts. BrainLayer's 4-stage pipeline turns these into searchable knowledge. Extract parses session files and detects continuation chains. Classify identifies content types (user messages, AI code, stack traces, file reads) with content-aware length thresholds. Chunk splits text using tree-sitter for code and paragraph boundaries for prose, targeting ~2000 chars per chunk. Embed generates 1024-dim vectors with bge-large-en-v1.5 and stores them in SQLite via sqlite-vec.",
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
        "Vector similarity alone misses exact keyword matches. BrainLayer runs two strategies in parallel: semantic search with 1024-dim embeddings (KNN, 3x oversampling) and FTS5 keyword search for exact hits. Reciprocal Rank Fusion combines both ranked lists with score = 1/(k + rank), where k=60 keeps any single high rank from dominating the final ordering.",
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
        "Raw chunks need structure. A local LLM (GLM-4.7-Flash or Qwen2.5-Coder-14B via MLX on Apple Silicon) enriches each chunk with 10 metadata fields: summary, tags, importance (1-10), intent, primary code symbols, a hypothetical query for HyDE retrieval, epistemic level, version scope, tech debt impact, and external deps. Batches of 50-100 chunks with 5-minute stall detection per chunk.",
      callout: {
        title: "Why local LLM?",
        text: `${golemsStats.brainlayer.chunksDisplay} chunks at ~$0.01/chunk via cloud API = $${Math.round(golemsStats.brainlayer.chunks * 0.01).toLocaleString()}. Local GLM-4.7-Flash costs \$0. Quality is comparable for structured extraction tasks, and no data leaves the machine.`,
      },
    },
    {
      title: "Why SQLite",
      description:
        "Everything lives in a single .db file: SQLite + sqlite-vec for vectors, FTS5 for keywords. Not a compromise. The database ships with the package, needs zero infrastructure, and handles concurrent access from the daemon, MCP server, and enrichment workers via APSW with a 5-second busy timeout.",
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
        "7 MCP tools expose BrainLayer's full capability to any Claude Code session. 3 core memory tools handle search, persistence, and recall. 4 knowledge graph tools add entity extraction, lookup, updates, and person profiles. Started at 14 specialized tools, consolidated to 7 that cover every use case. Old names still work through backward-compat aliases.",
      toolList: [
        {
          name: "brain_search",
          description:
            "Semantic + keyword hybrid search across all indexed chunks",
        },
        {
          name: "brain_store",
          description:
            "Persist decisions, learnings, bugs, and TODOs with auto-tagging",
        },
        {
          name: "brain_recall",
          description:
            "Session context, operational history, and work summaries",
        },
        {
          name: "brain_digest",
          description:
            "Ingest raw content and extract entities, relations, action items",
        },
        {
          name: "brain_entity",
          description:
            "Look up known entities in the knowledge graph with relations",
        },
        {
          name: "brain_update",
          description: "Update, archive, or merge existing memory chunks",
        },
        {
          name: "brain_get_person",
          description: "Retrieve person profiles with interaction history",
        },
      ],
    },
  ],

  voicelayer: [
    {
      title: "Voice Tools Pipeline",
      description:
        "Two tools, auto-mode detection. voice_speak handles TTS in three modes: announce, brief, consult. voice_ask does full bidirectional Q&A with session booking. The system picks the interaction pattern from context: fire-and-forget for short updates, slower pacing for explanations, full conversation for Q&A.",
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
        "Recording uses sox at 16kHz mono PCM, processed in 1-second chunks with RMS energy detection for silence. Transcription runs through whisper.cpp locally (~200-400ms on Apple Silicon) with automatic model discovery from ~/.cache/whisper/. Cloud fallback via Wispr Flow WebSocket handles cases where local STT isn't available. Stop recording by touching a signal file. Simple Unix.",
      diagramNodes: [
        { icon: "Mic", title: "Record", subtitle: "sox 16kHz mono" },
        { icon: "FileText", title: "WAV Buffer", subtitle: "1s chunks + RMS" },
        { icon: "Zap", title: "whisper.cpp", subtitle: "Local ~300ms" },
        {
          icon: "MessageSquare",
          title: "Transcription",
          subtitle: "Agent response",
        },
      ],
      callout: {
        title: "~300ms latency",
        text: "whisper.cpp on Apple Silicon with ggml-large-v3-turbo achieves near-instant transcription. No cloud roundtrip, no API keys, no data leaving your machine.",
      },
    },
    {
      title: "Text-to-Speech Flow",
      description:
        "Edge-TTS provides neural-quality speech synthesis for free. Speech rate auto-adjusts by content length: shorter messages play faster (+10%), longer explanations slow down (-15% for 1000+ chars). Each voice mode has its own rate default. Announce is snappy, brief is deliberate. Users interrupt playback by touching a stop signal file, monitored by a 300ms polling loop.",
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
        "Only one session can use the microphone at a time. VoiceLayer handles this with a lockfile mutex: a JSON file at /tmp/voicelayer-session.lock with the owning PID, session ID, and start timestamp. Lock creation uses atomic wx write flags to prevent TOCTOU races. Dead process detection uses the signal-zero trick: process.kill(pid, 0) throws ESRCH for dead processes, so stale locks get cleaned up automatically.",
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
        text: "Lockfiles work across process boundaries without kernel objects or special privileges. Dead process detection via signal-zero is a Unix classic. Simple and reliable.",
      },
    },
  ],

  golems: [
    {
      title: "Monorepo Structure",
      description:
        "13 packages in a Bun monorepo. @golems/shared is the foundation: Supabase client, multi-backend LLM routing, email processing, state management. Domain golems (jobs, recruiter, coach, teller, content) are self-contained Claude Code plugins. Ralph handles autonomous PRD execution. The dashboard is a Next.js 16 app with 3D brain visualization. Each package deploys independently but shares types and utilities through the foundation layer.",
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
        "Two environments, each tuned for its workload. Railway runs the cloud worker: scheduled cron tasks for email polling (hourly), job scraping (3x/day Sun-Thu), daily briefings, and content learning. macOS handles real-time services: Telegram bot (Grammy, port 3847), BrainLayer indexing, VoiceLayer I/O, and Night Shift autonomous coding at 4am via launchd.",
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
        "Every LLM call goes through a routing layer that prefers free models. The hierarchy: MLX on Apple Silicon (21-87% faster than Ollama, $0), local GLM-4.7-Flash via Ollama ($0), Gemini 2.5 Flash-Lite (free tier, 1K RPD), Groq Llama 4 Scout (free tier), then Claude Haiku 4.5 (paid, last resort). Same runLLM() interface everywhere. Backend selection is just an env var.",
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
        "Ralph turns PRD stories into working code without human intervention. The /prd skill creates structured stories with acceptance criteria. Ralph spawns a fresh Claude instance per story, implements the code, and gates every commit behind CodeRabbit AI review. Failed reviews trigger automatic fix-iterate-review cycles (max 3 attempts). Night Shift extends this at 4am: scans repos for TODOs, creates worktrees, ships PRs while the developer sleeps.",
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
        "8 MCP servers, 60+ tools. BrainLayer: 7 tools (3 core memory + 4 knowledge graph). Email: 7 tools for triage. VoiceLayer: 2 voice tools. Plus Supabase for database, Exa for web search, Sophtron for financial data, GLM for local inference. Each golem declares which MCP servers it needs. The orchestrator makes sure they're available at session startup.",
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
