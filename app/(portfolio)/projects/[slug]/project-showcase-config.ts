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
      { value: 268, suffix: "K+", label: "Indexed chunks" },
      { value: 14, label: "MCP tools" },
      { value: 1024, label: "Vector dimensions" },
      { value: 13, suffix: "s", prefix: "~", label: "Enrichment / chunk" },
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
        title: "14 MCP Tools",
        description:
          "search, context, think, recall, store, file_timeline, regression, sessions, and more.",
      },
      {
        iconName: "Brain",
        title: "Session Analysis",
        description:
          "Operation grouping, regression detection, plan linking, and enriched session summaries.",
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
      { icon: "MessageSquare", title: "Conversation", subtitle: "CC sessions → JSONL" },
      { icon: "FileText", title: "Indexing", subtitle: "Chunk + deduplicate" },
      { icon: "Binary", title: "Embedding", subtitle: "bge-large 1024-dim" },
      { icon: "Search", title: "Hybrid Search", subtitle: "Vec + FTS5 + RRF" },
      { icon: "Wrench", title: "MCP Tools", subtitle: "14 tools for agents" },
    ],
  },

  voicelayer: {
    accent: { color: "#38BDF8", colorRgb: "56, 189, 248" },
    tagline: "bunx voicelayer-mcp",
    isMiniSite: true,
    stats: [
      { value: 7, label: "MCP tools" },
      { value: 5, label: "Voice modes" },
      { value: 300, suffix: "ms", prefix: "~", label: "STT latency" },
      { value: 75, suffix: "+", label: "Tests passing" },
    ],
    features: [
      {
        iconName: "Mic",
        title: "5 Voice Modes",
        description:
          "announce, brief, consult, converse, think — from fire-and-forget TTS to full voice Q&A.",
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
          'Lockfile-based mic mutex. Other sessions see "line busy" — no conflicts.',
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
      { icon: "Bot", title: "Voice Modes", subtitle: "5 modes: ask→brief" },
      { icon: "Lock", title: "Session Mgr", subtitle: "Lockfile mutex" },
      { icon: "Volume2", title: "TTS Output", subtitle: "edge-tts neural" },
    ],
  },

  golems: {
    accent: { color: "#94A3B8", colorRgb: "148, 163, 184" },
    isMiniSite: true,
    stats: [
      { value: 10, label: "Packages" },
      { value: 7, label: "Domain agents" },
      { value: 60, suffix: "+", label: "MCP tools" },
      { value: 150, suffix: "+", label: "PRs merged" },
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
        title: "7 Domain Agents",
        description:
          "Recruiter, Jobs, Content, Coach, Teller, Services, Claude — each a self-contained CC plugin.",
      },
      {
        iconName: "Package",
        title: "Autonomous Loop",
        description:
          "Ralph executes PRD stories with CodeRabbit review gates. Night Shift runs improvements at 3am.",
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
      { label: "Dashboard", command: "cd packages/dashboard && npm run dev" },
    ],
    architectureFlow: [
      { icon: "Send", title: "Telegram", subtitle: "User commands" },
      { icon: "Bot", title: "Orchestrator", subtitle: "Route to golems" },
      { icon: "Zap", title: "Domain Agents", subtitle: "7 specialized golems", children: ["Jobs", "Recruiter", "Content", "Coach", "Teller", "Services", "Claude"] },
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
