// Static showcase data per featured project.
// Stats, features, install commands — things not in Supabase.

export interface ProjectStat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export interface ProjectFeature {
  iconName: string;
  title: string;
  description: string;
}

export interface InstallTab {
  label: string;
  command: string;
  highlightedHtml?: string;
}

export interface ProjectAccent {
  color: string;
  colorRgb: string;
}

export interface ArchitectureNode {
  icon: string;
  title: string;
  subtitle: string;
  children?: string[];
}

export interface ProjectShowcaseConfig {
  accent: ProjectAccent;
  tagline?: string;
  isMiniSite?: boolean;
  stats: ProjectStat[];
  features: ProjectFeature[];
  installTabs: InstallTab[];
  architectureFlow?: ArchitectureNode[];
}

const configs: Record<string, ProjectShowcaseConfig> = {
  brainlayer: {
    accent: { color: "#6366F1", colorRgb: "99, 102, 241" },
    tagline: "pip install brainlayer",
    isMiniSite: true,
    stats: [
      { value: 335, suffix: "K+", label: "Indexed chunks" },
      { value: 12, label: "MCP tools" },
      { value: 1848, label: "Tests passing" },
      { value: 119, label: "KG entities" },
    ],
    features: [
      {
        iconName: "Search",
        title: "Hybrid Search",
        description:
          "Semantic vectors (bge-large-en-v1.5) + FTS5 keyword search, fused with Reciprocal Rank Fusion. Content-hash dedup with UNIQUE index eliminates duplicates at ingest.",
      },
      {
        iconName: "Cpu",
        title: "BrainBar Daemon",
        description:
          "Native macOS Swift daemon (209KB) providing MCP over Unix socket. Real-time indexing hooks capture prompt/response pairs as they happen. Always-on recall without starting a separate server.",
      },
      {
        iconName: "Database",
        title: "12 MCP Tools",
        description:
          "3 core memory tools (search, store, recall) plus 9 graph, enrichment, and lifecycle tools (digest, entity, tags, expand, update, get_person, enrich, supersede, archive). Consolidated from 14. Old names still work via aliases.",
      },
      {
        iconName: "Brain",
        title: "3-Mode Enrichment",
        description:
          "Unified brain_digest with 3 modes: full content ingestion, faceted tag generation via Gemini 2.5 Flash, and tiered selectivity (T0-T3 classifier). 335K+ chunks enriched with structured metadata.",
      },
    ],
    installTabs: [
      { label: "pip", command: "pip install brainlayer" },
      {
        label: "MCP Config",
        command:
          '{\n  "mcpServers": {\n    "brainlayer": {\n      "command": "brainlayer-mcp"\n    }\n  }\n}',
      },
      {
        label: "First search",
        command: 'brainlayer search "how did I implement auth"',
      },
    ],
    architectureFlow: [
      {
        icon: "MessageSquare",
        title: "Conversation",
        subtitle: "CC sessions → JSONL",
      },
      { icon: "FileText", title: "Indexing", subtitle: "Chunk + deduplicate" },
      { icon: "Binary", title: "Embedding", subtitle: "bge-large 1024-dim" },
      { icon: "Search", title: "Hybrid Search", subtitle: "Vec + FTS5 + RRF" },
      { icon: "Wrench", title: "BrainBar", subtitle: "12 tools, Unix socket" },
    ],
  },

  voicelayer: {
    accent: { color: "#38BDF8", colorRgb: "56, 189, 248" },
    tagline: "bunx voicelayer-mcp",
    isMiniSite: true,
    stats: [
      { value: 2, label: "MCP tools" },
      { value: 2, label: "STT backends" },
      { value: 300, suffix: "ms", prefix: "~", label: "STT latency" },
      { value: 359, label: "Tests passing" },
    ],
    features: [
      {
        iconName: "Mic",
        title: "Bi-directional TTS + STT",
        description:
          "voice_speak and voice_ask cover the full range: fire-and-forget TTS to interactive Q&A, with automatic mode detection. VoiceBar daemon (renamed from FlowBar) handles both directions.",
      },
      {
        iconName: "Radio",
        title: "Local STT",
        description:
          "whisper.cpp and Wispr Flow backends at ~300ms. No cloud APIs, no data leaving your machine.",
      },
      {
        iconName: "Zap",
        title: "MCP Daemon + LaunchAgent",
        description:
          "Singleton voice service via socat with dual-protocol support (NDJSON + MCP Content-Length). Auto-starts via macOS LaunchAgent. Always available, zero manual setup after install.",
      },
      {
        iconName: "Volume2",
        title: "Edge-TTS + Smart Chunking",
        description:
          "Neural-quality TTS with word-boundary text splitting for long messages. Auto-chunks at sentence boundaries to avoid truncation. Free, local, multiple voices.",
      },
    ],
    installTabs: [
      { label: "bunx", command: "bunx voicelayer-mcp" },
      {
        label: "MCP Config",
        command:
          '{\n  "mcpServers": {\n    "qa-voice": {\n      "command": "bunx",\n      "args": ["voicelayer-mcp"]\n    }\n  }\n}',
      },
    ],
    architectureFlow: [
      { icon: "Mic", title: "Speech", subtitle: "User voice input" },
      { icon: "Radio", title: "STT", subtitle: "whisper.cpp ~300ms" },
      {
        icon: "Bot",
        title: "Voice Tools",
        subtitle: "2 tools, auto detection",
      },
      { icon: "Lock", title: "Session Mgr", subtitle: "Lockfile mutex" },
      { icon: "Volume2", title: "TTS Output", subtitle: "edge-tts neural" },
    ],
  },

  cmuxlayer: {
    accent: { color: "#10B981", colorRgb: "16, 185, 129" },
    tagline: "@golems/cmux-mcp",
    isMiniSite: true,
    stats: [
      { value: 25, label: "MCP tools" },
      { value: 5, label: "Supported CLIs" },
      { value: 335, label: "Test assertions" },
      { value: 3, label: "API layers" },
    ],
    features: [
      {
        iconName: "Terminal",
        title: "25 MCP Tools, 3 Layers",
        description:
          "13 core surface tools (split, read, send, send_key, notify, rename, move, reorder, new_surface), 10 agent lifecycle tools (spawn_agent, stop_agent, send_to_agent, wait_for, wait_for_all, my_agents), and 2 V2 facade tools (interact + kill).",
      },
      {
        iconName: "Bot",
        title: "Terminal Orchestration for AI",
        description:
          "Spawn Claude, Codex, Cursor, Gemini, or Kiro agents into terminal panes. Each gets a tracked state machine with thinking-state detection. Chunked input delivery for resilient prompt injection. Native MCP with 1,423x socket speedup.",
      },
      {
        iconName: "Globe",
        title: "Playwright Browser Surface",
        description:
          "browser_surface tool opens Playwright-controlled browser panes alongside terminal agents. Enables visual verification, screenshot capture, and automated testing within the same orchestration flow.",
      },
      {
        iconName: "GitBranch",
        title: "Agent Hierarchy & Quality",
        description:
          "Parent-child tracking with spawn depth limits (max 2) and per-parent child caps (max 10). Quality field tracks verified/suspect/degraded agent output.",
      },
    ],
    installTabs: [
      {
        label: "Clone",
        command:
          "git clone https://github.com/EtanHey/cmuxlayer.git\ncd cmuxlayer && npm install && npm run build",
      },
      {
        label: "MCP Config",
        command:
          '{\n  "mcpServers": {\n    "cmux": {\n      "command": "node",\n      "args": ["path/to/cmuxlayer/dist/index.js"]\n    }\n  }\n}',
      },
    ],
    architectureFlow: [
      {
        icon: "Terminal",
        title: "CLI Command",
        subtitle: "spawn / interact / kill",
      },
      { icon: "Wrench", title: "MCP Server", subtitle: "25 typed tools" },
      { icon: "Monitor", title: "cmux Socket", subtitle: "Terminal control" },
      {
        icon: "Bot",
        title: "Agent Engine",
        subtitle: "State machine lifecycle",
      },
      {
        icon: "Database",
        title: "State Store",
        subtitle: "JSON file persistence",
      },
    ],
  },

  "whatsapp-mcp": {
    accent: { color: "#25D366", colorRgb: "37, 211, 102" },
    tagline: "Fork of lharries/whatsapp-mcp",
    isMiniSite: true,
    stats: [
      { value: 12, label: "MCP tools" },
      { value: 2, label: "Bridge support" },
      { value: 3, label: "Unicode search fixes" },
      { value: 5.4, suffix: "K", label: "Upstream stars" },
    ],
    features: [
      {
        iconName: "Globe",
        title: "Unicode/Hebrew Search",
        description:
          "Replaced SQLite LOWER()+LIKE (ASCII-only) with instr()-based matching. Works for Hebrew, Arabic, emoji, CJK — any Unicode text.",
      },
      {
        iconName: "Smartphone",
        title: "Dual-Bridge Support",
        description:
          "Auto-detects business bridge database. Run personal (port 8741) and business (port 8742) WhatsApp accounts simultaneously without manual config.",
      },
      {
        iconName: "Shield",
        title: "Self-Chat Safety",
        description:
          "Optional WHATSAPP_OWNER_JID restricts sends to your own Saved Messages. Safe for LLM interactions — Claude can read all chats but only send to you.",
      },
      {
        iconName: "MessageSquare",
        title: "12 MCP Tools",
        description:
          "9 read tools (search contacts, list messages, get chat, download media) + 3 write tools (send message, send file, send audio with auto Opus conversion).",
      },
    ],
    installTabs: [
      {
        label: "Clone",
        command:
          "git clone https://github.com/EtanHey/whatsapp-mcp.git\ncd whatsapp-mcp && cd whatsapp-bridge && go build",
      },
      {
        label: "MCP Config",
        command:
          '{\n  "mcpServers": {\n    "whatsapp": {\n      "command": "uv",\n      "args": ["--directory", "path/to/whatsapp-mcp-server", "run", "main.py"]\n    }\n  }\n}',
      },
    ],
    architectureFlow: [
      {
        icon: "Smartphone",
        title: "WhatsApp",
        subtitle: "Personal + Business",
      },
      { icon: "Code", title: "Go Bridge", subtitle: "whatsmeow + REST API" },
      { icon: "Database", title: "SQLite", subtitle: "Message store" },
      {
        icon: "Wrench",
        title: "Python MCP",
        subtitle: "12 tools, instr() search",
      },
      { icon: "Bot", title: "AI Agent", subtitle: "Claude / Cursor" },
    ],
  },

  golems: {
    accent: { color: "#94A3B8", colorRgb: "148, 163, 184" },
    isMiniSite: true,
    stats: [
      { value: 11, label: "Packages" },
      { value: 55, label: "Skills" },
      { value: 5, label: "Supported CLIs" },
      { value: 383, suffix: "+", label: "PRs merged" },
    ],
    features: [
      {
        iconName: "Layers",
        title: "AI-Agnostic Skills",
        description:
          "55 skills with 3-layer architecture: SKILL.md (universal) + adapters/ (per-CLI) + capabilities.yaml (routing). Validated across Claude, Codex, Cursor, Gemini, and Kiro.",
      },
      {
        iconName: "Shield",
        title: "Eval Framework",
        description:
          "40 skill eval packs with 480+ assertions and fixture-based testing. 96% pass rate. Skills are measured, not assumed to work.",
      },
      {
        iconName: "Bot",
        title: "OrcClaude v2.0",
        description:
          "Orchestrator agent with planning topology, response markers, and multi-agent sprint coordination. Spawns and monitors parallel Claude workers.",
      },
      {
        iconName: "Package",
        title: "Autonomous Loop",
        description:
          "Night Shift runs improvements at 4am with CodeRabbit review gates. PR loop v2 enforces review on every commit. Morning Briefing at 8am.",
      },
      {
        iconName: "Cloud",
        title: "Cloud + Local Split",
        description:
          "Railway for cloud worker (email, jobs, briefings). Mac for Telegram bot, memory, voice. ~$5/month total.",
      },
    ],
    installTabs: [
      {
        label: "Clone",
        command:
          "git clone https://github.com/EtanHey/golems.git\ncd golems && bun install",
      },
      {
        label: "Telegram Bot",
        command: "bun run packages/claude/src/telegram-bot.ts",
      },
      { label: "Docsite", command: "cd packages/docsite && bun dev" },
    ],
    architectureFlow: [
      { icon: "Send", title: "Telegram", subtitle: "User commands" },
      { icon: "Bot", title: "OrcClaude v2", subtitle: "Multi-agent sprints" },
      {
        icon: "Layers",
        title: "55 Skills",
        subtitle: "5 CLI adapters",
        children: ["Claude", "Codex", "Cursor", "Gemini", "Kiro"],
      },
      { icon: "Shield", title: "Eval Framework", subtitle: "480+ assertions" },
      { icon: "Cloud", title: "Cloud + Local", subtitle: "Railway + Mac" },
    ],
  },
};

export function getProjectShowcaseConfig(
  slug: string,
): ProjectShowcaseConfig | null {
  return configs[slug] ?? null;
}

export function getDefaultAccent(): ProjectAccent {
  return { color: "#0F82EB", colorRgb: "15, 130, 235" };
}

export function isMiniSiteProject(slug: string): boolean {
  const config = configs[slug];
  return config?.isMiniSite === true;
}
