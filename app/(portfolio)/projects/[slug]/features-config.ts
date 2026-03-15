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
      title: "Local LLM Enrichment",
      tagline: "10-field metadata without cloud APIs",
      description:
        "A local LLM (GLM-4.7-Flash or Qwen2.5-Coder-14B via MLX) analyzes every chunk and generates structured metadata. Summary, 5 tags, importance score (1-10), intent classification, primary code symbols, a hypothetical search query, epistemic confidence level, version scope, tech debt impact, and external dependencies. All computed locally — no data leaves your machine.",
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
      title: "7 MCP Tools",
      tagline:
        "Powerful memory layer with 7 intelligent tools that understand what you need",
      description:
        "From 14 specialized tools to 7 that just work. 3 core memory tools (brain_search, brain_store, brain_recall) plus 4 knowledge graph tools (brain_digest, brain_entity, brain_update, brain_get_person). Backward-compat aliases keep existing workflows intact.",
      highlights: [
        "brain_search — hybrid query, 7 filter dimensions, understands intent",
        "brain_store — persist decisions, learnings, with entity linking",
        "brain_recall — file and topic history across sessions",
        "brain_digest — ingest content, extract entities and relations",
        "brain_entity — knowledge graph lookup with evidence",
        "brain_update — update, archive, or merge memories",
        "brain_get_person — person profile + scoped memories in <500ms",
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
      title: "Edge-TTS Neural Voices",
      tagline: "Free, high-quality, rate-adaptive speech",
      description:
        "Microsoft Edge-TTS provides neural-quality speech synthesis at zero cost. Speech rate auto-adjusts based on content length — shorter messages play faster, longer explanations slow down by up to 15%. Each voice mode has its own rate default. Audio plays through the platform-native player (afplay on macOS, mpv/ffplay on Linux).",
      highlights: [
        "Neural-quality voices at $0 cost",
        "Auto rate adjustment by content length",
        "Mode-specific rate defaults",
        "Cross-platform audio playback",
        "Configurable voice selection",
      ],
    },
    {
      iconName: "Zap",
      title: "User-Controlled Stop",
      tagline: "Unix philosophy: touch a file to stop",
      description:
        "Both recording and playback can be stopped instantly by touching a signal file: touch /tmp/voicelayer-stop. A 300ms polling loop monitors this file during audio output. For recording, silence detection (5s default) provides a natural stop. Maximum timeout prevents runaway sessions. The signal file is cleaned up automatically after each interaction.",
      highlights: [
        "touch /tmp/voicelayer-stop — instant stop",
        "300ms polling during playback",
        "5-second silence detection fallback",
        "300-second maximum timeout (configurable)",
        "Automatic signal file cleanup",
      ],
    },
  ],

  cmuxlayer: [
    {
      iconName: "Terminal",
      title: "10 Core Surface Tools",
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
        "Input validation on all 20 tools via Zod schemas",
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
      iconName: "Bot",
      title: "4 Domain Golems",
      tagline: "Specialized Claude Code plugins for every domain",
      description:
        "Each golem is a self-contained Claude Code agent with its own tools, MCP servers, and domain knowledge. Coach is the primary golem — health, schedule, recruiting, content, admin, and daily planning with Whoop biometric integration. Recruiter handles job board scraping, outreach, and Elo-rated interview practice. Claude is the Telegram bot that routes commands and spawns sessions. Services runs Night Shift, Morning Briefing, and cloud workers.",
      highlights: [
        "Coach — primary golem: health, schedule, recruiting, content, admin",
        "Recruiter — job hunt, outreach, Elo-rated interview practice",
        "Claude — Telegram bot, routing, session management",
        "Services — Night Shift (4am), Morning Briefing, cloud workers",
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
      iconName: "Binary",
      title: "Multi-LLM Routing",
      tagline: "Free models first, paid only as fallback",
      description:
        "Every LLM call goes through a unified routing layer. The hierarchy: MLX on Apple Silicon ($0, fastest) → local GLM-4.7-Flash via Ollama ($0) → Gemini 2.5 Flash-Lite (free tier) → Groq Llama 4 Scout (free tier) → Claude Haiku 4.5 (paid, last resort). Consumer code calls the same runLLM() function regardless of backend — the routing is an environment variable.",
      highlights: [
        "MLX — local Apple Silicon, 21-87% faster than Ollama",
        "GLM-4.7-Flash — local Ollama, free",
        "Gemini Flash-Lite — cloud free tier, 1K RPD",
        "Groq Llama 4 Scout — ultra-fast inference, free",
        "Claude Haiku 4.5 — paid fallback, only when needed",
      ],
    },
    {
      iconName: "Moon",
      title: "Night Shift",
      tagline: "Autonomous improvements at 4am",
      description:
        "A launchd-triggered service scans repos at 4am for TODOs, issues, and improvement opportunities. It creates a git worktree, implements changes, runs tests, and gates the commit behind CodeRabbit review. Successful changes become PRs. The target repo rotates automatically between active projects. All of this happens while the developer sleeps.",
      highlights: [
        "4am launchd trigger on macOS",
        "Auto-scans for TODOs and improvements",
        "Creates worktree for isolation",
        "CodeRabbit review gate before PR",
        "Rotating target repo schedule",
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
      iconName: "Layers",
      title: "AI-Agnostic Adapter Layer",
      tagline: "Same skills, any CLI — Codex, Gemini, Kiro, Claude",
      description:
        "Skills are written once in universal SKILL.md format, then adapted for each AI CLI via a thin adapters/ layer. A capabilities.yaml file routes each skill to the right adapters based on what each CLI supports. This 3-layer architecture means skills work across any AI tool without rewriting — the adapter handles CLI-specific syntax and tool names.",
      highlights: [
        "SKILL.md — universal skill definition, CLI-agnostic",
        "adapters/ — per-CLI syntax for Claude, Codex, Gemini, Kiro",
        "capabilities.yaml — automatic routing based on CLI capabilities",
        "Validated across 3 AI CLIs with cross-platform eval suite",
      ],
    },
    {
      iconName: "Wrench",
      title: "MCP Server Ecosystem",
      tagline: "8 MCP servers powering every golem",
      description:
        "Each golem declares which MCP servers it needs. BrainLayer provides 7 memory + KG tools (brain_search, brain_store, brain_recall, brain_digest, brain_entity, brain_update, brain_get_person). The email server handles triage with 7 tools. VoiceLayer exposes 2 voice tools (voice_speak, voice_ask). Supabase provides database access. Exa handles web search, Sophtron connects to bank APIs, and a local GLM server provides free text generation. The orchestrator ensures all declared servers are running before spawning a golem.",
      highlights: [
        "BrainLayer — 7 memory + KG tools",
        "Email — 7 triage & draft tools",
        "VoiceLayer — 2 voice tools",
        "Supabase — SQL & DDL access",
        "Exa — web search & code context",
        "Sophtron — bank transaction APIs",
        "GLM — local free-tier inference",
        "Jobs — 3 discovery & matching tools",
      ],
    },
  ],
};

export function getFeaturesData(slug: string): FeatureSection[] | null {
  return featuresData[slug] ?? null;
}
