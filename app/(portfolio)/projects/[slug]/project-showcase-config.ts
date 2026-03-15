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
      { value: 291, suffix: "K+", label: "Indexed chunks" },
      { value: 7, label: "MCP tools" },
      { value: 1024, label: "Vector dimensions" },
      { value: 119, label: "KG entities" },
    ],
    features: [
      {
        iconName: "Search",
        title: "Hybrid Search",
        description:
          "Semantic vectors (bge-large-en-v1.5) + FTS5 keyword search, fused with Reciprocal Rank Fusion.",
      },
      {
        iconName: "Cpu",
        title: "Local LLM Enrichment",
        description:
          "GLM-4.7-Flash generates summaries, tags, importance scores, and intent classification per chunk.",
      },
      {
        iconName: "Database",
        title: "7 MCP Tools",
        description:
          "3 core (search, store, recall) + 4 knowledge graph (digest, entity, update, person lookup). Consolidated from 14 to 7. Old names still work via aliases.",
      },
      {
        iconName: "Brain",
        title: "Knowledge Graph",
        description:
          "Entity extraction, relation mapping, person lookup, and sentiment analysis. 119 entities across people, projects, and technologies.",
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
      { icon: "Wrench", title: "MCP Tools", subtitle: "7 tools for agents" },
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
      { value: 236, label: "Tests passing" },
    ],
    features: [
      {
        iconName: "Mic",
        title: "2 Tools, Auto Mode",
        description:
          "voice_speak and voice_ask cover the full range: fire-and-forget TTS to interactive Q&A, with automatic mode detection.",
      },
      {
        iconName: "Radio",
        title: "Local STT",
        description:
          "whisper.cpp transcription at ~300ms. No cloud APIs, no data leaving your machine.",
      },
      {
        iconName: "Lock",
        title: "Session Booking",
        description:
          'Lockfile-based mic mutex. Other sessions see "line busy". No conflicts.',
      },
      {
        iconName: "Volume2",
        title: "Edge-TTS",
        description:
          "Neural-quality text-to-speech. Free, local, multiple voices. User-controlled stop.",
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
      { value: 20, label: "MCP tools" },
      { value: 5, label: "Supported CLIs" },
      { value: 259, label: "Test assertions" },
      { value: 3, label: "API layers" },
    ],
    features: [
      {
        iconName: "Terminal",
        title: "20 MCP Tools, 3 Layers",
        description:
          "10 core surface tools (split, read, send, rename), 8 agent lifecycle tools (spawn, wait, stop, send_to_agent), and 2 V2 facade tools (interact + kill).",
      },
      {
        iconName: "Bot",
        title: "Multi-CLI Agent Spawning",
        description:
          "Spawn Claude, Codex, Cursor, Gemini, or Kiro agents into terminal panes. Each gets a tracked state machine: spawning → booting → ready → working → done.",
      },
      {
        iconName: "Zap",
        title: "V2 Interact + Kill",
        description:
          "High-level facade over 8 agent tools. interact() handles send, interrupt, model switch, resume, skill invoke, usage query, and MCP check. kill() terminates one, many, or all agents.",
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
      { icon: "Wrench", title: "MCP Server", subtitle: "20 typed tools" },
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
      { value: 13, label: "MCP tools" },
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
        title: "13 MCP Tools",
        description:
          "9 read tools (search contacts, list messages, get chat, download media) + 4 write tools (send message, send file, send audio with auto Opus conversion).",
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
        subtitle: "13 tools, instr() search",
      },
      { icon: "Bot", title: "AI Agent", subtitle: "Claude / Cursor" },
    ],
  },

  golems: {
    accent: { color: "#94A3B8", colorRgb: "148, 163, 184" },
    isMiniSite: true,
    stats: [
      { value: 11, label: "Packages" },
      { value: 4, label: "Domain golems" },
      { value: 55, label: "Skills" },
      { value: 261, suffix: "+", label: "PRs merged" },
    ],
    features: [
      {
        iconName: "Zap",
        title: "Multi-LLM Routing",
        description:
          "Claude Opus/Sonnet/Haiku, Gemini Flash-Lite, local GLM-4.7-Flash. Cost-optimized backend switching.",
      },
      {
        iconName: "Bot",
        title: "4 Domain Golems",
        description:
          "Coach (primary), Claude (telegram), Recruiter (job hunt), Services (infra). Each is a self-contained CC plugin.",
      },
      {
        iconName: "Package",
        title: "Autonomous Loop",
        description:
          "Night Shift runs improvements at 4am with CodeRabbit review gates. Morning Briefing at 8am.",
      },
      {
        iconName: "Layers",
        title: "AI-Agnostic Skills",
        description:
          "3-layer architecture: SKILL.md (universal) + adapters/ (per-CLI) + capabilities.yaml (routing). Validated across Claude, Codex, Gemini, and Kiro.",
      },
      {
        iconName: "Cloud",
        title: "Cloud + Local Split",
        description:
          "Railway for cloud worker (email, jobs, briefings). Mac for Telegram bot, memory, voice.",
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
      { icon: "Bot", title: "Orchestrator", subtitle: "Route to golems" },
      {
        icon: "Zap",
        title: "Domain Agents",
        subtitle: "4 specialized golems",
        children: ["Coach", "Claude", "Recruiter", "Services"],
      },
      { icon: "Binary", title: "LLM Router", subtitle: "Multi-model cost opt" },
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
