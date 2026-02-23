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
      title: "3 MCP Tools",
      tagline: "Powerful memory layer with 3 intelligent tools that understand what you need",
      description:
        "From 14 specialized tools to 3 that just work. brain_search finds relevant context with hybrid semantic + keyword queries. brain_store persists decisions and learnings. brain_recall traces file and topic history. Backward-compat aliases keep existing workflows intact.",
      highlights: [
        "brain_search — hybrid query, 7 filter dimensions, understands intent",
        "brain_store — persist decisions and learnings",
        "brain_recall — file and topic history across sessions",
      ],
    },
    {
      iconName: "Brain",
      title: "Session Analysis",
      tagline: "Patterns across hundreds of coding sessions",
      description:
        "BrainLayer doesn't just store conversations — it analyzes them. Operations are grouped into logical units (read-edit-test cycles, research chains). Sessions are enriched with quality scores, decisions made, corrections applied, and lessons learned. Plan linking connects sessions to PRD stories, letting you trace work across the entire development lifecycle.",
      highlights: [
        "Operation grouping — logical read→edit→test cycles",
        "Quality scoring — 1-10 per session",
        "Decision tracking across sessions",
        "Plan linking — PRD story to session tracing",
        "Regression detection — what broke since last success",
      ],
    },
    {
      iconName: "Database",
      title: "Multi-Source Ingestion",
      tagline: "Not just Claude Code sessions",
      description:
        "The pipeline ingests from multiple sources: Claude Code JSONL transcripts (primary), WhatsApp message exports, and YouTube transcript downloads. Each source has content-aware filtering — WhatsApp messages need only 15 characters to be indexed (short-form messaging), while general assistant text requires 50 characters. Source metadata is preserved for filtered search.",
      highlights: [
        "Claude Code sessions — JSONL transcript parsing",
        "WhatsApp exports — short-form message indexing",
        "YouTube transcripts — learning content",
        "Source-aware filtering and thresholds",
        "Per-source content-type detection",
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

  golems: [
    {
      iconName: "Bot",
      title: "7 Domain Agents",
      tagline: "Specialized Claude Code plugins for every domain",
      description:
        "Each golem is a self-contained Claude Code agent with its own tools, MCP servers, and domain knowledge. The Recruiter handles outreach and Elo-rated interview practice. Jobs scrapes Israeli job boards and scores matches. Coach manages calendar and daily planning with Whoop biometric integration. Teller tracks finances and categorizes expenses for tax. Content creates LinkedIn posts and manages publishing. Each declares its dependencies and the orchestrator ensures they're available.",
      highlights: [
        "RecruiterGolem — outreach, Elo-rated practice, contact finder",
        "JobGolem — scraping Drushim/SecretTLV, LLM match scoring",
        "CoachGolem — calendar, planning, Whoop biometrics",
        "TellerGolem — finances, subscriptions, tax categorization",
        "ContentGolem — LinkedIn, Soltome, visual factory",
        "Discovery Voice — silent assistant for client calls",
        "QA Voice — voice-powered website testing",
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
      iconName: "Wrench",
      title: "MCP Server Ecosystem",
      tagline: "8 servers, 60+ tools powering every golem",
      description:
        "Each golem declares which MCP servers it needs. BrainLayer provides 3 memory tools (brain_search, brain_store, brain_recall). The email server handles triage with 7 tools. VoiceLayer exposes 2 voice tools (voice_speak, voice_ask). Supabase provides database access. Exa handles web search, Sophtron connects to bank APIs, and a local GLM server provides free text generation. The orchestrator ensures all declared servers are running before spawning a golem.",
      highlights: [
        "BrainLayer — 3 memory tools",
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
