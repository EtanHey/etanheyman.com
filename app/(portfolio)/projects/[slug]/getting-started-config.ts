// Getting started step-by-step content for mini-site /docs pages.

export interface GettingStartedStep {
  step: number;
  title: string;
  description?: string;
  command?: string;
  language?: string;
  note?: string;
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
      note: "Visit etanhey.github.io/brainlayer for the complete documentation.",
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
      command: '// In a Claude Code session:\nqa_voice_announce("Hello from VoiceLayer!")',
      language: "typescript",
    },
    {
      step: 5,
      title: "Full documentation",
      description:
        "Complete reference for all 5 voice modes, environment variables, STT backends, and session management.",
      note: "Visit etanhey.github.io/voicelayer for the complete documentation.",
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
