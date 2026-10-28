-- Rollback for supabase/migrations/20261028_portfolio_blurbs_claim_checked.sql

BEGIN;

UPDATE public.projects
SET description = 'BrainLayer is a local-first memory layer that gives any MCP-compatible AI agent persistent memory across conversations. It indexes Claude Code session transcripts into a SQLite database with vector embeddings, enabling semantic search, task-aware retrieval, file history tracking, and session analysis. Everything runs locally — no cloud accounts, no API keys, no Docker. The enrichment pipeline uses local LLMs (Ollama/MLX) to generate 10-field metadata per chunk including summaries, tags, importance scores, and intent classification.',
    short_description = '12 MCP tools, 335K+ indexed chunks, hybrid semantic+keyword search with MMR dedup, knowledge graph with entity resolution, Gemini enrichment. 1,848 Python + 54 Swift tests. pip install brainlayer.'
WHERE slug = 'brainlayer'
  AND ((description = 'BrainLayer gives any MCP-compatible AI agent persistent memory across conversations. It indexes agent session transcripts into a single local SQLite file as they''re written, and searches them with vector similarity and FTS5 full-text search merged by Reciprocal Rank Fusion. Embeddings run on-device with bge-large-en-v1.5. The MCP server exposes 16 tools. Sessions start with a core set (search, store, recall, expand) and load the rest on demand. A local knowledge graph tracks people, entities and how they relate. Its scheduled-job guard and backup ownership rules have bounded TLA+ models checked by TLC.' AND short_description = 'Persistent memory for AI agents over MCP. 16 tools, hybrid vector + full-text search and a local knowledge graph over one SQLite file. Bounded TLA+ models checked by TLC. pip install brainlayer.'));

-- Matches either variant, so it reverses whichever Etan picks.
UPDATE public.projects
SET description = 'Fork of lharries/whatsapp-mcp that fixes Unicode/Hebrew search and adds dual-bridge support for personal and business WhatsApp accounts. The upstream project provides 13 MCP tools for reading and sending WhatsApp messages through a Go bridge + Python MCP server. Our fork replaces SQLite LOWER()+LIKE queries (which silently break for non-ASCII text) with instr()-based matching that works for Hebrew, Arabic, emoji, and all Unicode. Also adds auto-detection of business bridge databases and an optional self-chat safety restriction for LLM interactions.',
    short_description = 'Hebrew-compatible WhatsApp MCP fork. Fixed Unicode search with instr(), dual-bridge personal+business support, self-chat safety mode. 12 MCP tools.'
WHERE slug = 'whatsapp-mcp'
  AND ((description = 'This is my fork of lharries/whatsapp-mcp. It connects an AI agent to your WhatsApp account through a Go bridge (whatsmeow) and a Python MCP server, and keeps messages in a local SQLite database. I fixed message, chat and contact search for Hebrew and other non-ASCII text by adding instr()-based literal matching next to the existing case-insensitive ASCII match. The fork also runs a personal and a business account side by side, each on its own bridge. 12 MCP tools cover reading chats, messages and media, and sending messages, files and audio.' AND short_description = 'WhatsApp MCP fork with search that works for Hebrew and other non-ASCII text, plus separate bridges for personal and business accounts. 12 MCP tools for reading and sending messages.'));

UPDATE public.projects
SET description = 'A monorepo ecosystem for autonomous AI agents. Features include: autonomous coding loops with PRD-driven development (Ralph), BrainLayer persistent memory with semantic search using sqlite-vec and sentence-transformers, Telegram bot integration for remote control and notifications, Night Shift for automated improvements while sleeping, and multi-agent sprint coordination via OrcClaude v2.0.',
    short_description = 'Autonomous AI agent ecosystem — 12 Bun workspace packages, 7 domain agents, 60+ AI-agnostic skills, multi-LLM routing, Night Shift autonomous coding at 4am. 1,073 tests.'
WHERE slug = 'golems'
  AND ((description = 'Golems is a Bun monorepo of AI agent tooling, published in the open as my working setup. Domain packages each own one area: coach handles scheduling and calendar integration, teller tracks subscriptions and spending, and services runs a morning briefing. golem-powers is a library of 50+ SKILL.md workflows for coding agents like Claude Code, Codex and Cursor, many with executable evals.' AND short_description = 'Bun monorepo of AI agent tooling: domain packages for scheduling, finance and content, plus 50+ SKILL.md workflows for coding agents, many with evals. 700+ merged PRs.'));

COMMIT;
