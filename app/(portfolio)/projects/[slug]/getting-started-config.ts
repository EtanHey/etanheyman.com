// Getting started step-by-step content for mini-site /docs pages.

export interface GettingStartedStep {
  step: number;
  title: string;
  description?: string;
  command?: string;
  language?: string;
  note?: string;
  link?: { href: string; label: string };
}

const gettingStartedData: Record<string, GettingStartedStep[]> = {
  brainlayer: [
    {
      step: 1,
      title: "Install BrainLayer",
      command: "pip install brainlayer",
      note: "Requires Python 3.10+. Installs the CLI, MCP server, and all dependencies.",
    },
    {
      step: 2,
      title: "Index your conversations",
      description:
        "Point BrainLayer at your Claude Code sessions directory. It will parse JSONL transcripts, chunk content with AST-aware splitting, and generate 1024-dim embeddings.",
      command: "brainlayer index",
      note: "First run indexes all sessions. Subsequent runs only process new/changed files.",
    },
    {
      step: 3,
      title: "Configure MCP",
      description:
        "Add BrainLayer to your Claude Code MCP configuration so it's available in every session.",
      command: `// ~/.claude/settings.json
{
  "mcpServers": {
    "brainlayer": {
      "command": "brainlayer-mcp"
    }
  }
}`,
      language: "json",
    },
    {
      step: 4,
      title: "Run your first search",
      description:
        "Search your development history using natural language. Results include content, enrichment metadata, and relevance scores.",
      command: 'brainlayer search "how did I implement auth"',
      note: 'Example output: "Found 12 results across 3 projects. Top: JWT middleware in shared/auth.ts (score: 0.89, importance: 8, intent: implementing)"',
    },
    {
      step: 5,
      title: "Enrich your chunks (optional)",
      description:
        "Run a local LLM to add 10-field metadata to every chunk: summary, tags, importance, intent, and more. Requires Ollama with GLM-4.7-Flash or an MLX-compatible model.",
      command: "brainlayer enrich",
      note: "This is optional but dramatically improves search quality. Processing runs locally — no data leaves your machine.",
    },
    {
      step: 6,
      title: "Full documentation",
      description:
        "Comprehensive docs with API reference, enrichment fields, search filters, and configuration options.",
      link: {
        href: "https://etanhey.github.io/brainlayer",
        label: "View BrainLayer Docs",
      },
    },
  ],

  voicelayer: [
    {
      step: 1,
      title: "Quick start with bunx",
      description:
        "The fastest way to try VoiceLayer. Runs the MCP server directly without installing.",
      command: "bunx voicelayer-mcp",
      note: "Requires Bun runtime. For npm: npx voicelayer-mcp.",
    },
    {
      step: 2,
      title: "Configure MCP",
      description:
        "Add VoiceLayer to your Claude Code MCP configuration for persistent access.",
      command: `// ~/.claude/settings.json
{
  "mcpServers": {
    "qa-voice": {
      "command": "bunx",
      "args": ["voicelayer-mcp"]
    }
  }
}`,
      language: "json",
    },
    {
      step: 3,
      title: "Install prerequisites",
      description:
        "For voice recording: sox (brew install sox). For local transcription: whisper.cpp (brew install whisper-cpp) plus a GGML model file. Cloud transcription via Wispr Flow is available as a fallback.",
      command:
        "brew install sox whisper-cpp\n# Download a model:\ncurl -L -o ~/.cache/whisper/ggml-large-v3-turbo.bin \\\n  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin",
      note: "macOS: grant microphone access to your terminal app in System Settings > Privacy > Microphone.",
    },
    {
      step: 4,
      title: "Try your first voice command",
      description:
        "Use the announce mode for a quick fire-and-forget test. The agent will speak the message aloud.",
      command:
        '// In a Claude Code session:\nvoice_speak("Hello from VoiceLayer!")',
      language: "typescript",
    },
    {
      step: 5,
      title: "Full documentation",
      description:
        "Complete reference for voice_speak and voice_ask, environment variables, STT backends, and session management.",
      link: {
        href: "https://etanhey.github.io/voicelayer",
        label: "View VoiceLayer Docs",
      },
    },
  ],

  cmuxlayer: [
    {
      step: 1,
      title: "Clone and build",
      description:
        "Clone the repository and build the TypeScript source. Requires Node.js 20+.",
      command:
        "git clone https://github.com/EtanHey/cmuxlayer.git\ncd cmuxlayer && npm install && npm run build",
      note: "The build compiles TypeScript to dist/index.js — the MCP server entry point.",
    },
    {
      step: 2,
      title: "Configure MCP",
      description:
        "Add cmuxlayer to your Claude Code MCP configuration. The server exposes all 20 tools automatically.",
      command: `// ~/.claude/settings.json
{
  "mcpServers": {
    "cmux": {
      "command": "node",
      "args": ["/path/to/cmuxlayer/dist/index.js"]
    }
  }
}`,
      language: "json",
    },
    {
      step: 3,
      title: "Spawn your first agent",
      description:
        "Use the spawn_agent tool to launch a Claude instance in a new terminal pane. The agent goes through spawning → booting → ready states automatically.",
      command: 'spawn_agent(cli: "claude", repo: "my-project")',
      note: "Supported CLIs: claude, codex, cursor, gemini, kiro. Each spawns in its own pane with state tracking.",
    },
    {
      step: 4,
      title: "Interact with agents (V2)",
      description:
        "The V2 interact tool consolidates 8 agent operations into a single tool with action types: send, interrupt, model, resume, skill, usage, mcp.",
      command:
        'interact(agent: "agent-claude-my-project-x7k2", action: "send", message: "Run tests")',
    },
    {
      step: 5,
      title: "Run tests",
      description:
        "278 test assertions across 15 test files verify tool registration, agent lifecycle, V2 semantics, hierarchy, and quality tracking.",
      command: "npm test",
      note: "Uses Vitest. All tests run locally with mocked cmux client.",
    },
  ],

  "whatsapp-mcp": [
    {
      step: 1,
      title: "Clone the fork",
      description:
        "Clone this fork — it includes Unicode search fixes and dual-bridge support not in the upstream repo.",
      command:
        "git clone https://github.com/EtanHey/whatsapp-mcp.git\ncd whatsapp-mcp",
    },
    {
      step: 2,
      title: "Build and start the Go bridge",
      description:
        "The Go bridge authenticates with WhatsApp Web and stores messages in SQLite. First run shows a QR code — scan it with your phone.",
      command: "cd whatsapp-bridge && go build && ./whatsapp-bridge",
      note: "Default port: 8741 (personal). For business: WHATSAPP_BRIDGE_PORT=8742 go run main.go",
    },
    {
      step: 3,
      title: "Start the Python MCP server",
      description:
        "The MCP server connects to the SQLite database and exposes 13 tools. Auto-detects business bridge if present.",
      command: "cd whatsapp-mcp-server && uv run main.py",
      note: "Requires Python 3.11+ and uv. Set WHATSAPP_OWNER_JID to restrict sends to self only.",
    },
    {
      step: 4,
      title: "Configure MCP",
      description: "Add the WhatsApp MCP server to Claude Code or Cursor.",
      command: `// ~/.claude/settings.json
{
  "mcpServers": {
    "whatsapp": {
      "command": "uv",
      "args": [
        "--directory", "/path/to/whatsapp-mcp-server",
        "run", "main.py"
      ]
    }
  }
}`,
      language: "json",
    },
    {
      step: 5,
      title: "Search your messages",
      description:
        "Try a Hebrew search to verify Unicode support. The instr()-based queries work for any script.",
      command: 'search_contacts(query: "שלום")',
      note: "Also works: list_messages, get_chat, list_chats, download_media, send_message, send_file, send_audio_message.",
    },
  ],

  golems: [
    {
      step: 1,
      title: "Clone the monorepo",
      command:
        "git clone https://github.com/EtanHey/golems.git\ncd golems && bun install",
      note: "Requires Bun runtime. The monorepo uses Bun workspaces for package management.",
    },
    {
      step: 2,
      title: "Set up environment",
      description:
        "Copy the example env file and fill in your API keys. At minimum you need Supabase credentials and a Telegram bot token.",
      command:
        "cp .env.example .env\n# Edit .env with your keys:\n# SUPABASE_URL, SUPABASE_SERVICE_KEY\n# TELEGRAM_BOT_TOKEN\n# ANTHROPIC_API_KEY (optional for paid LLM)",
    },
    {
      step: 3,
      title: "Start the Telegram bot",
      description:
        "The bot receives messages and routes them to domain golems via Grammy Composers.",
      command: "bun run packages/claude/src/telegram-bot.ts",
      note: "Runs locally on port 3847. Messages are routed to the appropriate golem based on command prefixes.",
    },
    {
      step: 4,
      title: "Launch the dashboard",
      description:
        "A Next.js 16 web interface with 3D brain visualization, operations view, job matches, and token tracking.",
      command: "cd packages/dashboard && npm run dev",
    },
    {
      step: 5,
      title: "Configure Night Shift (optional)",
      description:
        "Set up the launchd plist for automated coding improvements at 4am. Night Shift scans repos for TODOs, creates worktrees, implements changes, and ships PRs.",
      command:
        "# Copy the launchd plist\ncp launchd/com.golems.night-shift.plist ~/Library/LaunchAgents/\nlaunchctl load ~/Library/LaunchAgents/com.golems.night-shift.plist",
      note: "Night Shift requires CodeRabbit CLI for automated review gates.",
    },
  ],
};

export function getGettingStartedData(
  slug: string,
): GettingStartedStep[] | null {
  return gettingStartedData[slug] ?? null;
}
