---
title: "Skills Library"
description: "55 reusable Claude Code skills covering development, operations, content, research, and quality workflows — 40 with eval coverage."
---

# Skills Library

> 55 reusable Claude Code skills with eval coverage across 40 skills. Each skill is a focused workflow you can invoke with `/skill-name` in any Claude Code session.

## What Are Skills?

Skills are Claude Code plugins that provide specialized capabilities. They're stored in `skills/golem-powers/` and can be installed into any project. Each skill has a trigger (slash command), a description, and focused instructions for a specific workflow.

## Skill Categories

### Development

| Skill | Command | What It Does |
|-------|---------|-------------|
| Commit | `/commit` | CodeRabbit review + conventional commit |
| PR Loop | `/pr-loop` | Full PR loop — branch, test, commit, push, PR, review, fix, merge |
| Worktrees | `/worktrees` | Git worktree management (create, switch, cleanup) |
| Test Plan | `/test-plan` | Generate test plan from requirements |
| Large Plan | `/large-plan` | Multi-phase plan scaffolding and execution |
| Code Review | `/code-review` | Dispatch reviewers, read feedback, implement fixes |
| GitHub | `/github` | Git ops, PRs, issues via `gh` CLI |
| Ralph Commit | `/ralph-commit` | Atomic commit with story validation |

### Operations

| Skill | Command | What It Does |
|-------|---------|-------------|
| Railway | `/railway` | Deploy, logs, restart, env vars for cloud worker |
| 1Password | `/1password` | Secret management, env migration, vault ops |
| Convex | `/convex` | Schema, deploy, data import/export, troubleshooting |
| Ecosystem Health | `/ecosystem-health` | MCP connections, BrainLayer stats, skill evals, friction scans |
| Context Check | `/context-check` | Audit per-project AI context hygiene, report wasted tokens |
| Maintenance | `/maintenance` | System maintenance and cleanup workflows |

### Content

| Skill | Command | What It Does |
|-------|---------|-------------|
| LinkedIn Post | `/linkedin-post` | Topic discovery, drafting, scheduling, review |
| Content | `/content` | Multi-platform content creation and publishing |
| Nightly Docs Update | `/nightly-docs-update` | Automated documentation updates |
| YouTube Pipeline | `/youtube-pipeline` | YouTube content processing pipeline |

### Research & Context

| Skill | Command | What It Does |
|-------|---------|-------------|
| Research | `/research` | Deep web research orchestrator — routes to best backend |
| Context7 | `/context7` | Library documentation lookup |
| GitHub Research | `/github-research` | Explore and document repositories |
| CLI Agents | `/cli-agents` | Run Gemini, Cursor, Codex, Kiro for research |
| Claude Web Research | `/claude-web-research` | Self-contained research prompts for Claude Web |
| Catchup | `/catchup` | Auto-depth context recovery (short break vs long break) |

### Quality

| Skill | Command | What It Does |
|-------|---------|-------------|
| CodeRabbit | `/coderabbit` | AI code review with multiple workflows |
| QA Video | `/qa-video` | Video-based QA pipeline — screen recording processed into structured findings |
| Critique Waves | `/critique-waves` | Parallel verification agents for consensus |
| Never Fabricate | `/never-fabricate` | Mandatory verification before reporting on file contents or results |

### Domain

| Skill | Command | What It Does |
|-------|---------|-------------|
| Interview Practice | `/interview-practice` | 7-mode practice with Elo tracking |
| Email Golem | `/email-golem` | Email status, manual triage, recent scores |
| Nightly Journal | `/nightly-journal` | End-of-day sweep — comms, client activity, diary |
| Obsidian | `/obsidian` | Search, read, write Obsidian vault notes |
| Voice Sessions | `/voice-sessions` | Voice I/O workflows via VoiceLayer |

### Orchestration

| Skill | Command | What It Does |
|-------|---------|-------------|
| Orc | `/orc` | Multi-agent sprint orchestration, cross-repo coordination |
| Orchestrator Status | `/orchestrator-status` | Ecosystem-wide status and orientation |
| cmux Agents | `/cmux-agents` | Spawn AI agents in cmux panes — Claude, Cursor, Gemini, Codex, Kiro |
| cmux | `/cmux` | Control cmux panes, splits, browser, sidebar, agent-to-agent messaging |

### Project Management

| Skill | Command | What It Does |
|-------|---------|-------------|
| PRD | `/prd` | Generate Product Requirement Documents |
| Archive | `/archive` | Archive completed PRD stories |
| Writing Skills | `/writing-skills` | Create and validate new golem-powers skills |
| Skills | `/skills` | List and discover installed skills |

### Browser & Presentation

| Skill | Command | What It Does |
|-------|---------|-------------|
| Brave | `/brave` | Brave browser management (navigation, inspection, debugging) |
| Presentation Builder | `/presentation-builder` | Generate slide decks from content |
| Video Showcase | `/video-showcase` | Create video showcases of features |

## Using Skills

In any Claude Code session with golem-powers installed:

```
/commit              # Invoke the commit skill
/interview-practice  # Start interview practice
/railway logs        # Check Railway deployment logs
```

## Adapter Layer

Skills are **AI-agnostic** — each skill can include adapters for different AI CLI tools:

| CLI | Adapter |
|-----|---------|
| Claude Code | `adapters/claude.md` |
| Cursor | `adapters/cursor.md` |
| Gemini CLI | `adapters/gemini.md` |
| Codex CLI | `adapters/codex.md` |
| Kiro | `adapters/kiro.md` |

## Installing Skills

Skills are available as a Claude Code plugin:

```bash
# From your project directory
claude --plugin-dir ~/Gits/golems/skills/golem-powers
```

Or symlink into your project's `.claude/commands/` directory for per-project access.

## Eval Coverage

40 of 55 skills have eval suites with structured assertions. Evals verify that skills trigger correctly and produce the expected behavior. See individual skill pages for eval details.

## Source

[`skills/golem-powers/`](https://github.com/EtanHey/golems/tree/master/skills/golem-powers)
