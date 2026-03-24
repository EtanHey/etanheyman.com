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
        "10 MCP tools expose BrainLayer's full capability to any Claude Code session. 3 core memory tools handle search, persistence, and recall. 7 knowledge graph and lifecycle tools add entity extraction, digestion with 3 modes, and real-time pubsub. Started at 14 specialized tools, refined to 10 that cover every use case. BrainBar daemon provides MCP over Unix socket for always-on access.",
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
            "3-mode ingestion: full content, faceted tags (Gemini 2.5 Flash), tiered selectivity (T0-T3)",
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
          name: "brain_expand",
          description:
            "Drill into search results with surrounding context from the same session",
        },
        {
          name: "brain_tags",
          description:
            "Discover, search, and suggest tags across the knowledge base",
        },
        {
          name: "brain_subscribe / brain_unsubscribe",
          description:
            "Pubsub for real-time memory update notifications across sessions",
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

  cmuxlayer: [
    {
      title: "MCP Tool Layers",
      description:
        "21 tools organized into three layers. Layer 1: 11 core surface tools for terminal pane control (list, split, read, send, send_key, rename, status, progress, notify, close, browser). Layer 2: 8 agent lifecycle tools (spawn, stop, send_to, read_output, wait_for, wait_for_all, list, get_state). Layer 3: 2 V2 facade tools (interact + kill) that consolidate all agent operations into a clean, flat API.",
      diagramNodes: [
        {
          icon: "Terminal",
          title: "Surface Layer",
          subtitle: "11 core tools",
          children: ["list", "split", "read", "send", "notify", "browser"],
        },
        {
          icon: "Bot",
          title: "Agent Layer",
          subtitle: "8 lifecycle tools",
          children: ["spawn", "stop", "send_to", "wait_for_all"],
        },
        {
          icon: "Zap",
          title: "V2 Facade",
          subtitle: "interact + kill",
        },
      ],
    },
    {
      title: "Agent State Machine",
      description:
        "Each spawned agent transitions through a deterministic state machine: spawning → booting → ready → working → done. Boot detection uses screen content polling to determine when the CLI has finished loading. State transitions are event-driven — wait_for blocks until the target state is reached. Stale agents are detected via PID liveness checks.",
      diagramNodes: [
        { icon: "Loader", title: "Spawning", subtitle: "tmux pane created" },
        { icon: "Clock", title: "Booting", subtitle: "CLI loading" },
        { icon: "CheckCircle", title: "Ready", subtitle: "Boot detected" },
        { icon: "Wrench", title: "Working", subtitle: "Prompt sent" },
        { icon: "Check", title: "Done", subtitle: "Output extracted" },
      ],
      callout: {
        title: "Why state machines?",
        text: "Without lifecycle tracking, orchestrating multiple agents is guesswork. The state machine lets OrcClaude spawn 5 agents, wait_for each to reach 'ready', then send prompts — all with deterministic ordering.",
      },
    },
    {
      title: "cmux Socket Protocol",
      description:
        "CmuxLayer communicates with cmux via a Unix domain socket, achieving 1,423x speedup over CLI subprocess spawning. Every tool call serializes to a JSON command, sends it through the socket, and receives a typed response. The socket path is auto-discovered from the CMUX_SOCKET environment variable or defaults to the standard cmux socket location.",
      codeExample: {
        language: "typescript",
        code: `// Socket command flow
const socket = net.connect(CMUX_SOCKET);
socket.write(JSON.stringify({
  type: "new_split",
  direction: "horizontal",
  command: "claude --dangerously-skip-permissions"
}));

// Response: { id: "surface-42", ok: true }
// 1,423x faster than: child_process.exec("cmux split ...")`,
        caption: "Native MCP over Unix socket — no CLI subprocess overhead",
      },
    },
    {
      title: "Browser Surface Integration",
      description:
        "The browser_surface tool opens Playwright-controlled browser instances as cmux panes. A single tool with 8 action types: open (launch browser), navigate (go to URL), snapshot (capture visible state), click (element interaction), type (text input), eval (run JavaScript), wait (element/timeout), and url (get current URL). Enables visual verification alongside terminal agents in the same orchestration flow.",
      diagramNodes: [
        { icon: "Globe", title: "Open", subtitle: "Launch Playwright" },
        { icon: "Navigation", title: "Navigate", subtitle: "Go to URL" },
        { icon: "Camera", title: "Snapshot", subtitle: "Capture state" },
        { icon: "MousePointer", title: "Interact", subtitle: "Click + type" },
        { icon: "Code", title: "Evaluate", subtitle: "Run JavaScript" },
      ],
    },
    {
      title: "Security & Quality Guards",
      description:
        "Repository names are sanitized before shell execution — only alphanumeric characters, hyphens, underscores, and dots pass through. Agent IDs include random suffixes to prevent collision when spawning multiple agents for the same repo. All 21 tools validate input via Zod schemas. Mode enforcement: manual mode makes all mutating tools read-only. Agent quality tracking (unknown → verified → suspect → degraded) lets orchestrators filter unreliable output.",
      comparisonTable: {
        headers: ["Guard", "Mechanism", "Why"],
        rows: [
          ["Repo sanitization", "Regex allowlist", "Prevents shell injection"],
          ["ID collision", "Random suffix", "Safe parallel spawns"],
          [
            "Input validation",
            "Zod schemas on all 21 tools",
            "Type-safe at boundary",
          ],
          ["Mode enforcement", "Manual = read-only", "Safe observation mode"],
          ["Spawn depth", "MAX_SPAWN_DEPTH=2", "Prevents recursion bombs"],
          ["Child cap", "MAX_CHILDREN_PER_AGENT=10", "Resource limits"],
        ],
      },
    },
  ],

  "whatsapp-mcp": [
    {
      title: "Go Bridge Architecture",
      description:
        "The Go bridge uses whatsmeow to authenticate with WhatsApp Web via QR code scan. Messages are stored in a local SQLite database. A REST API on port 8741 (personal) or 8742 (business) exposes send operations. The bridge runs as a long-lived process that maintains the WhatsApp Web session.",
      diagramNodes: [
        { icon: "Smartphone", title: "WhatsApp Web", subtitle: "QR auth" },
        { icon: "Code", title: "whatsmeow", subtitle: "Go client library" },
        { icon: "Database", title: "SQLite", subtitle: "Message store" },
        { icon: "Server", title: "REST API", subtitle: "Port 8741/8742" },
      ],
    },
    {
      title: "Unicode Search Fix",
      description:
        "SQLite's built-in LOWER() function only handles ASCII characters (A-Z → a-z). For Hebrew, Arabic, emoji, and CJK text, LOWER() is a no-op — the text passes through unchanged. The upstream repo's LOWER(column) LIKE LOWER(?) pattern silently fails for non-Latin scripts. Our fork replaces this with instr()-based matching: a dual check that handles both case-insensitive Latin and direct Unicode byte-level matching.",
      codeExample: {
        language: "python",
        code: `# Upstream (broken for Hebrew/Arabic/CJK):
WHERE LOWER(chats.name) LIKE LOWER(?)
# → LOWER("שלום") returns "שלום" unchanged
# → LIKE "%שלום%" may fail on substring match

# Our fork (works for all Unicode):
WHERE instr(LOWER(chats.name), LOWER(?)) > 0
   OR instr(chats.name, ?) > 0
# → instr() does byte-level substring matching
# → Dual check: case-insensitive Latin + direct Unicode`,
        caption: "Applied to list_chats, list_messages, and search_contacts",
      },
      callout: {
        title: "Why not ICU extension?",
        text: "SQLite can load the ICU extension for proper Unicode collation, but it requires a C library dependency and isn't available in all environments. instr() is built-in, zero-dependency, and works everywhere SQLite runs.",
      },
    },
    {
      title: "Dual-Bridge Auto-Detection",
      description:
        "The Python MCP server checks for a business bridge database at whatsapp-bridge-business/store/messages.db. If it exists, it connects to the business bridge. Otherwise it falls back to the personal bridge at whatsapp-bridge/store/messages.db. Environment variables WHATSAPP_DB_PATH and WHATSAPP_API_URL override auto-detection for custom setups.",
      diagramNodes: [
        {
          icon: "Smartphone",
          title: "Personal Bridge",
          subtitle: "Port 8741",
        },
        {
          icon: "Briefcase",
          title: "Business Bridge",
          subtitle: "Port 8742",
        },
        {
          icon: "GitBranch",
          title: "Auto-Detect",
          subtitle: "Check file existence",
        },
        {
          icon: "Database",
          title: "SQLite DB",
          subtitle: "Shared schema",
        },
        {
          icon: "Wrench",
          title: "Python MCP",
          subtitle: "12 tools",
        },
      ],
    },
    {
      title: "MCP Tool Organization",
      description:
        "12 tools split into query (9) and mutation (3) categories. Query tools cover every read pattern: search contacts by name or phone, list messages with filters (chat, sender, date range, content), get chat metadata, fetch message context around a specific message, and download media (images, videos, audio). Mutation tools handle sending: text messages, files with captions, and voice messages with automatic Opus/OGG conversion via FFmpeg.",
      toolList: [
        {
          name: "search_contacts",
          description: "Unicode-safe name + phone search",
        },
        {
          name: "list_messages",
          description: "Filter by chat, sender, date, content",
        },
        {
          name: "list_chats",
          description: "All chats with optional last-message preview",
        },
        { name: "get_chat", description: "Chat metadata by JID" },
        {
          name: "get_direct_chat_by_contact",
          description: "Find DM chat for a contact",
        },
        {
          name: "get_contact_chats",
          description: "All chats involving a contact",
        },
        {
          name: "get_last_interaction",
          description: "Most recent message with a contact",
        },
        {
          name: "get_message_context",
          description: "Messages around a specific message ID",
        },
        {
          name: "download_media",
          description: "Images, videos, audio from messages",
        },
        { name: "send_message", description: "Text message to a JID" },
        { name: "send_file", description: "File with optional caption" },
        {
          name: "send_audio_message",
          description: "Voice message with FFmpeg Opus conversion",
        },
      ],
    },
    {
      title: "Self-Chat Safety",
      description:
        "When WHATSAPP_OWNER_JID is set, all send operations (send_message, send_file, send_audio_message) are restricted to the owner's JID — effectively a 'Saved Messages' mode. Read operations remain unrestricted, so Claude can search and reference any conversation. Phone numbers are normalized: leading '+' stripped, whitespace removed, @s.whatsapp.net appended.",
      callout: {
        title: "Why self-chat?",
        text: "Letting an LLM send messages to arbitrary contacts is dangerous. Self-chat mode lets Claude use WhatsApp as a note-taking and reference tool without risk of accidentally messaging people. Read everything, send only to yourself.",
      },
    },
  ],

  golems: [
    {
      title: "Monorepo Structure",
      description:
        "12 packages in a Bun monorepo. @golems/shared is the foundation: Supabase client, multi-backend LLM routing, email processing, state management. Domain golems (jobs, recruiter, coach, teller, content) are self-contained Claude Code plugins. 60+ AI-agnostic skills with eval framework. The dashboard is a Next.js app with 2D canvas knowledge graph and Neural Observatory. Each package deploys independently but shares types and utilities through the foundation layer.",
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
          icon: "Layers",
          title: "Skills",
          subtitle: "60+ AI-agnostic",
          children: ["SKILL.md", "Adapters", "Evals"],
        },
        {
          icon: "Monitor",
          title: "Dashboard",
          subtitle: "KG Canvas + Observatory",
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
        "Ralph turns PRD stories into working code without human intervention. PR Loop v2 enforces CodeRabbit AI review on every commit. Failed reviews trigger automatic fix-iterate-review cycles (max 3 attempts). Night Shift extends this at 4am: scans repos for TODOs, creates worktrees, ships PRs while the developer sleeps. OrcClaude v2.0 coordinates multi-agent sprints with planning topology and structured response markers.",
      diagramNodes: [
        { icon: "FileText", title: "PRD", subtitle: "Stories + criteria" },
        { icon: "Bot", title: "OrcClaude", subtitle: "Coordinate agents" },
        { icon: "Wrench", title: "Implement", subtitle: "Parallel workers" },
        { icon: "Shield", title: "CodeRabbit", subtitle: "AI review gate" },
        { icon: "GitBranch", title: "PR Loop v2", subtitle: "Review-enforced" },
      ],
      callout: {
        title: "CodeRabbit as quality gate",
        text: "Every autonomous commit must pass AI code review first. If CodeRabbit finds issues, Ralph fixes them automatically. If the fix fails after 3 attempts, it creates a BUG story instead of shipping broken code.",
      },
    },
    {
      title: "MCP Ecosystem",
      description:
        "8 MCP servers powering every golem. BrainLayer: 11 tools (3 core memory + 8 knowledge graph/lifecycle) with BrainBar daemon. Email: 7 tools for triage. VoiceLayer: 2 voice tools with MCP daemon. Plus Supabase for database, Exa for web search, Sophtron for financial data, GLM for local inference. Each golem declares which MCP servers it needs via context profiles.",
      diagramNodes: [
        {
          icon: "Brain",
          title: "BrainLayer",
          subtitle: "11 tools + daemon",
        },
        { icon: "Mail", title: "Email", subtitle: "7 tools" },
        { icon: "Mic", title: "VoiceLayer", subtitle: "2 tools + daemon" },
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
