BEGIN;

UPDATE public.projects
SET description = 'MCP server that wraps the cmux CLI into 25 typed tools for terminal and agent lifecycle management. Spawn, monitor, communicate with, and kill AI agents (Claude, Codex, Cursor, Gemini, Kiro) running in parallel terminal panes. 13 core surface tools for pane control (including layout management and new_surface), 10 agent lifecycle tools for spawn/wait/send/read with thinking-state detection, and a V2 facade that consolidates agent interaction into 2 high-level tools (interact + kill). Chunked input delivery for resilient long-prompt orchestration. Includes agent hierarchy tracking, quality metrics, sidebar sync, and security hardening against command injection.',
    short_description = '25 MCP tools across 3 layers. Spawn and orchestrate Claude, Codex, Cursor, Gemini, and Kiro agents in parallel. Thinking-state detection, chunked input delivery. V2 facade: interact + kill. 335 test assertions.'
WHERE slug = 'cmuxlayer'
  AND description = 'I built cmuxlayer to run AI coding agents in parallel cmux terminal panes from MCP. The server exposes 10 tools to spawn Claude, Codex, Gemini, Kiro or Cursor agents, send them work, read their screens, and wait for them to finish. It tracks the parent-child hierarchy between agents, so a sub-agent can report a blocker back to whoever spawned it. Every tool ships MCP ToolAnnotations. Contract tests drive a real cmux app instead of a mock, and regression checks replay captured pane output in a real cmux nightly build.'
  AND short_description = 'An MCP server with 10 tools for running Claude, Codex, Gemini, Kiro and Cursor agents in parallel cmux panes. Sub-agents can report blockers to their parent. Contract tests run against real cmux.';

COMMIT;
