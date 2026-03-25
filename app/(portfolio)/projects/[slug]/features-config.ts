// Detailed feature content for mini-site /features pages.

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface FeatureSection {
  iconName: string;
  title: string;
  tagline: string;
  description: string;
  codeExample?: CodeExample;
  highlights?: string[];
}

const featuresData: Record<string, FeatureSection[]> = {
  brainlayer: [
    {
      iconName: "Search",
      title: "Hybrid Search",
      tagline: "Semantic vectors meet keyword precision",
      description:
        "Single queries run two search strategies simultaneously. bge-large-en-v1.5 embeddings (1024 dimensions) find conceptually similar content, while FTS5 catches exact keyword matches. Reciprocal Rank Fusion merges both ranked lists — results appearing in both get boosted, giving you the best of both worlds without tuning weights.",
      codeExample: {
        language: "python",
        code: `results = brainlayer.search(
    query="authentication middleware",
    project="golems",
    intent="implementing",
    importance_min=5,
    n_results=10
)
# Returns: score, content, summary, tags,
#          importance, intent, primary_symbols`,
        caption: "Search with filters — project, intent, importance threshold",
      },
    },
    {
      iconName: "Cpu",
      title: "Faceted Enrichment v2",
      tagline: "Topic-specific tags via Gemini 2.5 Flash",
      description:
        "Three enrichment backends (Groq, MLX, Ollama) analyze every chunk and generate structured metadata. Enrichment v2 uses a faceted tag schema: topic tags (brainlayer-search-quality, cmux-terminal-orchestration), activity tags (act:debugging, act:implementing), domain tags (dom:python, dom:sql), and confidence scores. 98% valid JSON in 100-chunk pilot with 204 unique topic tags generated.",
      codeExample: {
        language: "json",
        code: `{
  "summary": "Debugging Telegram bot message drops",
  "tags": ["telegram", "debugging", "performance"],
  "importance": 8,
  "intent": "debugging",
  "primary_symbols": ["TelegramBot", "handleMessage"],
  "resolved_query": "Why does the bot drop messages?",
  "epistemic_level": "substantiated",
  "debt_impact": "resolution"
}`,
        caption: "Enrichment output per chunk — 10 structured fields",
      },
    },
    {
      iconName: "Wrench",
      title: "11 MCP Tools",
      tagline:
        "Powerful memory layer with 11 intelligent tools that understand what you need",
      description:
        "From 14 specialized tools to 11 that cover every use case. 3 core memory tools (brain_search, brain_store, brain_recall) plus 8 knowledge graph and lifecycle tools (brain_digest, brain_entity, brain_update, brain_expand, brain_tags, brain_subscribe, brain_unsubscribe, brain_stats). Backward-compat aliases keep existing workflows intact.",
      highlights: [
        "brain_search — hybrid query, 7 filter dimensions, understands intent",
        "brain_store — persist decisions, learnings, with entity linking",
        "brain_recall — file and topic history across sessions",
        "brain_digest — 3-mode ingestion: full content, faceted tags, tiered selectivity",
        "brain_entity — knowledge graph lookup with evidence",
        "brain_update — update, archive, or merge memories",
        "brain_expand — drill into search results with surrounding context",
        "brain_tags — discover, search, and suggest tags across knowledge base",
        "brain_subscribe / brain_unsubscribe — pubsub for real-time memory updates",
        "brain_stats — database statistics and health metrics",
      ],
    },
    {
      iconName: "Cpu",
      title: "BrainBar Daemon",
      tagline: "Native macOS daemon for always-on recall",
      description:
        "A 209KB Swift binary providing MCP over Unix socket. BrainBar runs as a macOS LaunchAgent, handling all MCP connections through a high-performance native bridge. Real-time indexing hooks capture prompt/response pairs as they happen — every conversation is indexed without manual intervention. Dual-protocol support (NDJSON + MCP Content-Length) ensures compatibility with all Claude Code transports.",
      highlights: [
        "209KB native Swift binary — minimal footprint",
        "Unix socket MCP — no HTTP overhead",
        "Real-time indexing hooks — per-message capture",
        "LaunchAgent auto-start — always available",
        "Dual-protocol — NDJSON + MCP Content-Length",
      ],
    },
    {
      iconName: "Brain",
      title: "Knowledge Graph",
      tagline: "Entities, relations, and person lookup across your codebase",
      description:
        "BrainLayer builds a knowledge graph from your conversations. Bilingual entity extraction (English + Hebrew) with 3 strategies: GLiNER model, regex patterns, and seed entity matching. 119 entities across people, projects, and technologies, connected by typed relations. Person lookup returns entity profiles with scoped memories in a single call. Sentiment analysis per chunk adds emotional context to your development history.",
      highlights: [
        "Entity extraction — bilingual NER with 3 strategies",
        "119 entities — people, projects, technologies",
        "Relation mapping — typed edges between entities",
        "Person lookup — profile + memories in <500ms",
        "Sentiment analysis — per-chunk emotional context",
      ],
    },
    {
      iconName: "Database",
      title: "Multi-Source Ingestion",
      tagline: "Not just Claude Code sessions",
      description:
        "The pipeline ingests from six sources: Claude Code JSONL transcripts (primary), WhatsApp message exports, YouTube transcript downloads, Markdown docs, Desktop files, and manual entries. Each source has content-aware filtering — WhatsApp messages need only 15 characters to be indexed (short-form messaging), while general assistant text requires 50 characters. Source metadata is preserved for filtered search.",
      highlights: [
        "Claude Code sessions — JSONL transcript parsing",
        "WhatsApp exports — short-form message indexing",
        "YouTube transcripts — learning content",
        "Markdown + Desktop — long-form local sources",
        "Manual entries — quick capture memories",
        "Source-aware filtering and thresholds",
      ],
    },
    {
      iconName: "FileText",
      title: "Obsidian Export",
      tagline: "Your memories as a navigable vault",
      description:
        "Export your entire memory database as an Obsidian-compatible markdown vault. Each session becomes a note with metadata frontmatter, linked to related sessions and referenced files. Tags from enrichment become Obsidian tags. The result is a browsable knowledge graph of your development history.",
      highlights: [
        "Markdown notes per session with frontmatter",
        "Cross-linked sessions and files",
        "Enrichment tags as Obsidian tags",
        "Browsable development knowledge graph",
      ],
    },
  ],

  voicelayer: [
    {
      iconName: "Mic",
      title: "2 Tools, Auto Mode Detection",
      tagline: "From fire-and-forget to full conversation — automatically",
      description:
        "voice_speak for text-to-speech (announcements, briefings, status updates). voice_ask for bidirectional Q&A with session booking. Auto-mode detection chooses the right interaction pattern based on context — no manual mode switching.",
      highlights: [
        "voice_speak — fire-and-forget TTS, rate adaptation by content length",
        "voice_ask — full Q&A with microphone lock, STT via whisper.cpp",
        "Auto-mode — picks announce, brief, consult, converse, or think automatically",
      ],
    },
    {
      iconName: "Radio",
      title: "Local Speech-to-Text",
      tagline: "~300ms transcription, no cloud required",
      description:
        "Recording uses sox at 16kHz mono PCM, processed in 1-second chunks with RMS energy detection. Transcription runs through whisper.cpp locally — ~200-400ms on Apple Silicon with ggml-large-v3-turbo. A cloud fallback via Wispr Flow WebSocket API handles cases where local setup isn't available. Backend selection is automatic based on what's installed.",
      codeExample: {
        language: "json",
        code: `{
  "mcpServers": {
    "qa-voice": {
      "command": "bunx",
      "args": ["voicelayer-mcp"],
      "env": {
        "QA_VOICE_STT_BACKEND": "auto",
        "QA_VOICE_TTS_VOICE": "en-US-JennyNeural"
      }
    }
  }
}`,
        caption: "MCP config with STT backend auto-detection",
      },
    },
    {
      iconName: "Lock",
      title: "Session Booking",
      tagline: "One microphone, no conflicts",
      description:
        "Only one Claude session can use the microphone at a time. A lockfile at /tmp/voicelayer-session.lock stores the owning PID, session ID, and start timestamp. Lock creation uses atomic wx write flags to prevent race conditions. Dead process detection uses signal-zero — if the owning PID no longer exists, the stale lock is automatically cleaned up.",
      codeExample: {
        language: "typescript",
        code: `// Other sessions see:
{
  isError: true,
  content: [{
    type: "text",
    text: "Line is busy — session abc123 " +
          "(PID 4821) since 14:30:00. " +
          "Fall back to text input."
  }]
}`,
        caption: '"Line busy" response with owner details',
      },
    },
    {
      iconName: "Volume2",
      title: "Edge-TTS + Smart Chunking",
      tagline: "Free, high-quality speech with word-boundary splitting",
      description:
        "Microsoft Edge-TTS provides neural-quality speech synthesis at zero cost. Long messages are automatically chunked at word boundaries to prevent truncation. Speech rate auto-adjusts based on content length — shorter messages play faster, longer explanations slow down by up to 15%. Each voice mode has its own rate default.",
      highlights: [
        "Neural-quality voices at $0 cost",
        "Word-boundary text splitting for long messages",
        "Auto rate adjustment by content length",
        "Mode-specific rate defaults",
        "Configurable voice selection",
      ],
    },
    {
      iconName: "Zap",
      title: "MCP Daemon Architecture",
      tagline: "Singleton voice service via socat — always on",
      description:
        "VoiceLayer runs as a macOS MCP daemon with dual-protocol support (NDJSON + MCP Content-Length). A socat-based singleton ensures only one voice service instance runs, even across multiple Claude sessions. Auto-starts via macOS LaunchAgent. User-controlled stop via signal file, with 5-minute orphan timeout for session booking cleanup.",
      highlights: [
        "Socat singleton — one daemon, many sessions",
        "Dual-protocol — NDJSON + MCP Content-Length",
        "LaunchAgent auto-start — zero manual setup",
        "5-minute orphan timeout for stale sessions",
        "touch /tmp/voicelayer-stop — instant stop",
      ],
    },
  ],

  cmuxlayer: [
    {
      iconName: "Terminal",
      title: "11 Core Surface Tools",
      tagline: "Full terminal pane control through MCP",
      description:
        "list_surfaces, new_split, send_input, send_key, read_screen, rename_tab, set_status, set_progress, close_surface, and browser_surface. These wrap the cmux CLI socket into typed, validated tools. browser_surface alone handles 8 actions: open, navigate, snapshot, click, type, eval, wait, and url.",
      highlights: [
        "list_surfaces — enumerate all panes across workspaces",
        "new_split — create terminal or browser panes",
        "send_input / send_key — type text or press keys",
        "read_screen — capture terminal content with scrollback",
        "browser_surface — 8 browser control actions",
        "set_status / set_progress — sidebar UI updates",
      ],
    },
    {
      iconName: "Bot",
      title: "8 Agent Lifecycle Tools",
      tagline: "Spawn, monitor, and communicate with AI agents",
      description:
        "spawn_agent launches a Claude, Codex, Cursor, Gemini, or Kiro CLI in a new pane with automatic boot detection. The agent transitions through spawning → booting → ready → working → done states. wait_for blocks until a target state is reached. send_to_agent and read_agent_output provide structured I/O with delimiter-based output extraction.",
      codeExample: {
        language: "typescript",
        code: `// Spawn a Claude agent
const agent = await spawn_agent({
  cli: "claude",
  repo: "brainlayer",
  prompt: "Fix failing tests"
});
// agent.id: "agent-claude-brainlayer-x7k2"

// Wait for it to be ready
await wait_for({
  agent_id: agent.id,
  target_state: "ready"
});`,
        caption: "Spawn + wait lifecycle — fully typed with Zod validation",
      },
    },
    {
      iconName: "Zap",
      title: "V2 Interact + Kill Facade",
      tagline: "8 agent operations consolidated into 2 tools",
      description:
        "The V2 API reduces cognitive load. interact() accepts a flat action enum (send, interrupt, model, resume, skill, usage, mcp) with optional fields per action. kill() terminates agents by single ID, array, or 'all'. If an agent isn't alive when you interact, it auto-spawns, waits for ready, then sends — zero manual lifecycle management.",
      codeExample: {
        language: "typescript",
        code: `// V2 interact — 7 action types
interact({ agent: "x7k2", action: "send",
           message: "Run tests" })
interact({ agent: "x7k2", action: "interrupt" })
interact({ agent: "x7k2", action: "skill",
           skill: "/commit" })
interact({ agent: "x7k2", action: "usage" })

// V2 kill — flexible targeting
kill({ target: "x7k2" })        // single
kill({ target: ["x7k2","m3p1"]}) // batch
kill({ target: "all" })          // everything`,
        caption:
          "Flat enum actions — no discriminated unions (MCP SDK limitation)",
      },
    },
    {
      iconName: "GitBranch",
      title: "Agent Hierarchy & Quality",
      tagline: "Parent-child tracking with spawn guards",
      description:
        "Agents can spawn child agents (K8s ownerRef pattern). parent_agent_id links child to parent. MAX_SPAWN_DEPTH=2 prevents unbounded recursion. MAX_CHILDREN_PER_AGENT=10 caps per-parent spawns. Each agent has a quality field (unknown → verified → suspect → degraded) for tracking output reliability. Sidebar sync pushes agent state to the cmux sidebar in real-time.",
      highlights: [
        "Parent-child links via parent_agent_id",
        "Spawn depth limit: 2 (hard cap)",
        "Per-parent child limit: 10 (configurable)",
        "Quality tracking: unknown → verified → suspect → degraded",
        "Sidebar sync for real-time agent status display",
      ],
    },
    {
      iconName: "Shield",
      title: "Security Hardening",
      tagline: "Command injection prevention + ID collision avoidance",
      description:
        "Repository names are sanitized before being passed to shell commands — only alphanumeric, hyphens, underscores, and dots are allowed. Agent IDs include a random suffix to prevent collision when spawning multiple agents for the same repo. Mode enforcement: manual mode makes all mutating tools read-only.",
      highlights: [
        "Repo name sanitization — blocks shell metacharacters",
        "Random suffix on agent IDs — no collisions",
        "Mode policy — manual mode = read-only surface tools",
        "Input validation on all 21 tools via Zod schemas",
      ],
    },
    {
      iconName: "Clock",
      title: "Roadmap (Coming Soon)",
      tagline: "Phase 5 orchestration platform — design converged, code next",
      description:
        "The Phase 5 v2 design document (1676 lines, 22 converged decisions) is complete. Upcoming: events.jsonl append-only audit log for agent state transitions. BrainLayer session persistence at session end. Context degradation circuit breakers at 80% usage. Cost caps per agent. Agent trust scoring based on success history. Per-surface mode enforcement for workspace-level access control.",
      highlights: [
        "events.jsonl — durable agent state transition log (coming soon)",
        "BrainLayer persist — session summaries at agent end (coming soon)",
        "Context circuit breaker — auto-pause at 80% (coming soon)",
        "Cost caps — maxCostPerAgent on spawn (coming soon)",
        "Agent trust scoring — success_count tracking (coming soon)",
      ],
    },
  ],

  "whatsapp-mcp": [
    {
      iconName: "Globe",
      title: "Unicode/Hebrew Search Fix",
      tagline: "SQLite LOWER() only handles ASCII — instr() handles everything",
      description:
        "The upstream repo uses LOWER(column) LIKE LOWER(?) for text search. This silently breaks for Hebrew, Arabic, emoji, and CJK because SQLite's LOWER() only converts A-Z. Our fork replaces this with instr()-based matching: instr(LOWER(content), LOWER(?)) > 0 OR instr(content, ?) > 0. The dual check handles both case-insensitive Latin matches and direct Unicode byte-level matching. Applied to contact search, message content search, and chat listing.",
      codeExample: {
        language: "python",
        code: `# Upstream (broken for Hebrew):
WHERE LOWER(chats.name) LIKE LOWER(?)
# → "שלום" passes through LOWER() unchanged
# → LIKE fails to match substrings

# Our fork (works for all Unicode):
WHERE instr(LOWER(chats.name), LOWER(?)) > 0
   OR instr(chats.name, ?) > 0
# → instr() does byte-level substring match
# → Works for Hebrew, Arabic, emoji, CJK`,
        caption:
          "The fix across 3 search functions: list_chats, list_messages, search_contacts",
      },
    },
    {
      iconName: "Smartphone",
      title: "Dual-Bridge Auto-Detection",
      tagline: "Personal and business WhatsApp from one MCP server",
      description:
        "The MCP server auto-detects which bridge database to use. If whatsapp-bridge-business/store/messages.db exists, it uses the business bridge. Otherwise it falls back to whatsapp-bridge/store/messages.db. Override with WHATSAPP_DB_PATH and WHATSAPP_API_URL env vars. Run both bridges simultaneously on different ports (8741 personal, 8742 business).",
      codeExample: {
        language: "python",
        code: `def _default_db_path():
    # Check for business bridge first
    biz = "whatsapp-bridge-business/store/messages.db"
    personal = "whatsapp-bridge/store/messages.db"
    if os.path.exists(biz):
        return biz
    return personal

# Override with env vars:
# WHATSAPP_DB_PATH=".../messages.db"
# WHATSAPP_API_URL="http://localhost:8742/api"`,
        caption: "Auto-detection with env var override for explicit control",
      },
    },
    {
      iconName: "Shield",
      title: "Self-Chat Safety Mode",
      tagline: "Let Claude read everything, but only send to you",
      description:
        "Set WHATSAPP_OWNER_JID to your phone number to restrict all send operations (send_message, send_file, send_audio_message) to your own Saved Messages. Claude can read and search all chats for context, but can't accidentally message your contacts. Phone numbers are normalized (strips +, whitespace, appends @s.whatsapp.net).",
      highlights: [
        "WHATSAPP_OWNER_JID env var — your phone number",
        "Applied to send_message, send_file, send_audio_message",
        "Read access unrestricted — full chat history available",
        "Phone number normalization for flexible input",
      ],
    },
    {
      iconName: "MessageSquare",
      title: "13 MCP Tools",
      tagline: "Full read + write access to WhatsApp",
      description:
        "9 query tools for reading messages, searching contacts, listing chats, getting context around specific messages, and downloading media. 4 write tools for sending text messages, files (images, videos, documents), and voice messages with automatic Opus/OGG conversion via FFmpeg.",
      highlights: [
        "search_contacts — Unicode-safe name + phone search",
        "list_messages — by chat, sender, date range, content",
        "list_chats — with optional last-message metadata",
        "get_chat / get_direct_chat_by_contact / get_contact_chats",
        "get_last_interaction / get_message_context",
        "download_media — images, videos, audio from messages",
        "send_message / send_file / send_audio_message",
      ],
    },
    {
      iconName: "Clock",
      title: "Ideas & Roadmap",
      tagline: "Community contribution opportunities",
      description:
        "Potential features for this fork or upstream contribution. Message reactions (send/receive emoji). Quote/reply with structured reply-to. Read receipts checking. Media type filtering (all images from chat X). Auto-translation between Hebrew and English via local LLM. Real-time webhooks instead of polling SQLite. Contact categorization and tagging.",
      highlights: [
        "Message reactions — emoji send/receive (coming soon)",
        "Quote/reply — structured reply-to messages (coming soon)",
        "Read receipts — check if messages were read (coming soon)",
        "Media type filter — all images/videos from a chat (coming soon)",
        "Auto-translation — Hebrew↔English via local LLM (coming soon)",
        "Real-time webhooks — push instead of SQLite polling (coming soon)",
      ],
    },
  ],

  golems: [
    {
      iconName: "Layers",
      title: "60+ AI-Agnostic Skills",
      tagline: "Same skills, any CLI — Claude, Codex, Cursor, Gemini, Kiro",
      description:
        "Skills are written once in universal SKILL.md format, then adapted for each AI CLI via a thin adapters/ layer. A capabilities.yaml file routes each skill to the right adapters based on what each CLI supports. 40 skill eval packs with 480+ assertions ensure quality. 96% pass rate across the eval suite. The adapter layer means skills work across 5 different AI CLIs without rewriting.",
      highlights: [
        "60+ skills — commit, pr-loop, research, orc, large-plan, and more",
        "3-layer architecture — SKILL.md + adapters/ + capabilities.yaml",
        "40 eval packs — 480+ assertions, fixture-based testing",
        "5 CLIs validated — Claude, Codex, Cursor, Gemini, Kiro",
        "96% pass rate across the full eval suite",
      ],
    },
    {
      iconName: "Zap",
      title: "Autonomous Coding Loop",
      tagline: "PRD stories to working code, unattended",
      description:
        "Ralph reads structured PRD stories and spawns fresh Claude instances to implement each one. Every commit is gated behind CodeRabbit AI review — if issues are found, Ralph fixes them automatically (up to 3 attempts). Failed fixes create BUG stories instead of shipping broken code. The cycle continues until all stories are complete.",
      codeExample: {
        language: "json",
        code: `{
  "id": "US-001",
  "title": "Add session export",
  "criteria": [
    "Export sessions to JSON format",
    "Include all enrichment metadata",
    "Run CodeRabbit review - must pass",
    "Commit: feat: US-001 add session export"
  ]
}`,
        caption: "PRD story — last 2 criteria are always CodeRabbit + commit",
      },
    },
    {
      iconName: "Bot",
      title: "OrcClaude v2.0",
      tagline: "Multi-agent orchestrator with planning topology",
      description:
        "The orchestrator agent coordinates multi-agent sprints across repos. Planning topology with response markers enables structured delegation. Spawns parallel Claude workers, monitors progress via collab files, and dispatches research to specialized agents. Sequential-parallel collab chains enable fully automated handoffs between agents — zero human intervention.",
      highlights: [
        "Planning topology — structured agent delegation",
        "Collab files — async agent-to-agent communication",
        "Sequential-parallel chains — automated handoffs",
        "Sprint coordination — multi-repo, multi-agent",
        "Response markers — structured output from spawned agents",
      ],
    },
    {
      iconName: "Moon",
      title: "Autonomous Coding Loop",
      tagline: "Night Shift + PR Loop v2 — every commit reviewed",
      description:
        "Night Shift scans repos at 4am for TODOs and improvements, creates worktrees, implements changes, and gates every commit behind CodeRabbit AI review. PR Loop v2 enforces review on every commit — if issues are found, they're fixed automatically (up to 3 attempts). Failed fixes create BUG stories instead of shipping broken code. Ralph reads PRD stories and spawns fresh Claude instances to implement each one.",
      highlights: [
        "Night Shift — 4am launchd trigger, autonomous PRs",
        "PR Loop v2 — review enforcement on every commit",
        "CodeRabbit gate — AI review before merge",
        "Ralph — PRD stories to working code, unattended",
        "3-attempt fix cycle — then BUG story, never broken code",
      ],
    },
    {
      iconName: "Cloud",
      title: "Cloud + Local Split",
      tagline: "Railway for cron, Mac for real-time",
      description:
        "Railway hosts a single cloud worker running scheduled tasks: email polling (hourly), job scraping (3x/day), and daily briefing generation — all using free Gemini Flash-Lite. macOS handles everything real-time: the Telegram bot on port 3847, BrainLayer memory indexing, VoiceLayer for voice I/O, and Night Shift coding. Total cloud cost: ~$5/month.",
      highlights: [
        "Railway — email, jobs, briefing (scheduled)",
        "macOS — Telegram, memory, voice (real-time)",
        "Cloud uses Gemini (free), local uses MLX (free)",
        "~$5/month total cloud infrastructure cost",
        "State: Supabase for cloud, local files for Mac",
      ],
    },
    {
      iconName: "Wrench",
      title: "MCP Server Ecosystem",
      tagline: "8 MCP servers powering every golem",
      description:
        "Each golem declares which MCP servers it needs. BrainLayer provides 11 memory + KG tools including the new brain_digest with 3 modes and pubsub for real-time updates. VoiceLayer exposes 2 voice tools with daemon architecture. The email server handles triage with 7 tools. Plus Supabase for database, Exa for web search, Sophtron for financial data, and GLM for local inference.",
      highlights: [
        "BrainLayer — 11 memory + KG tools, BrainBar daemon",
        "Email — 7 triage & draft tools",
        "VoiceLayer — 2 voice tools, MCP daemon",
        "Supabase — SQL & DDL access",
        "Exa — web search & code context",
        "Sophtron — bank transaction APIs",
        "GLM — local free-tier inference",
        "Jobs — 3 discovery & matching tools",
      ],
    },
    {
      iconName: "Monitor",
      title: "Neural Observatory Dashboard",
      tagline: "2D canvas knowledge graph + enrichment explorer",
      description:
        "A Next.js dashboard with d3-force 2D canvas knowledge graph visualization, enrichment observatory for search quality analysis, and wiki synthesis panels. Entity detail panels with community clustering let you explore the knowledge graph interactively. Filter panels handle 312K+ chunks without crashing.",
      highlights: [
        "2D canvas KG — d3-force graph with zoom and filter",
        "Enrichment observatory — search quality explorer",
        "Wiki synthesis — Neural Observatory Phase 1",
        "Entity detail panels — community clustering",
        "Aggregate-first — handles 312K+ chunks efficiently",
      ],
    },
  ],
};

export function getFeaturesData(slug: string): FeatureSection[] | null {
  return featuresData[slug] ?? null;
}
