---
title: "Skills Library"
description: "55 reusable Claude Code skills covering development, operations, content, research, and quality workflows — 46 with eval coverage."
---

# Skills Library

> 55 reusable Claude Code skills with eval coverage across 46 skills. Each skill is a focused workflow you can invoke with `/skill-name` in any Claude Code session.

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
| Video Extract | `/video-extract` | Extract gems from YouTube or process QA recordings — two workflows, one entry point |

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
| Phoenix Human View | `/phoenix-human-view` | The human-eval UX contract for Phoenix grading views — replay-not-scorecard, frozen suites, mobile-first (eval: 45.8% → 100%) |

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
| Cursor Multitask | `/cursor-multitask` | Route fan-out/parallel work to the right engine — Cursor `/multitask`, headless fan-out, Workflow tool, or cmux fleet (eval: 78.6% → 100%) |
| Fleet Wrap | `/fleet-wrap` | Quiet-down protocol at sprint close — zero polling crons, one final dashboard + message, then silent (eval: 60% → 100%) |

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

46 of 55 skills have eval suites with structured assertions. Evals verify that skills trigger correctly and produce the expected behavior — and that they beat baseline: recent A/B-evaled skills include `/cursor-multitask` (baseline 78.6% → with-skill 100%), `/fleet-wrap` (60% → 100%), and `/phoenix-human-view` (45.8% → 100%), with raw scoring committed in each skill's `evals/results/`. See individual skill pages for eval details.

## Recent Skill Updates (2026-05-17)

Friction-reduction sprint Phase 5 — seven skill PRs merged in one night, each backed by measured signals (not hypothesis).

- **`/large-plan` Phase N+1** — every plan producing code or config now requires a separate evaluator subagent (≥8/10 or `ITERATE`). Self-audit explicitly does not satisfy `/goal`. Closes the "self-grade as evaluator" loophole observed in 4 of 4 /goal outputs the night of 2026-05-17. PR [#407](https://github.com/EtanHey/golems/pull/407).
- **`/orc` C4 parallel-by-default** + **`/agent-routing` auto-dispatch triggers** — batch reads ≥3, transcription ≥2, or web research ≥1 now fan out parallel sub-agents in the same turn, no permission ask. Live eval flipped Agent calls from **0 → 4** across both orc and coach launcher matrices. PR [#405](https://github.com/EtanHey/golems/pull/405).
- **`/cmux-agents` envelope-vs-delivery pairing** — any `[FROM=X TO=Y TYPE=Z]` envelope in the author's pane must be paired with `send_to_agent` in the same turn. Field evidence: 64 orphan envelopes in one Codex session. Also adds auto-workspace-categorization for `new_split` panes. PR [#409](https://github.com/EtanHey/golems/pull/409).
- **`/session-handoff` inherited-citation suspect rule** — after consuming a handoff doc or resuming post-compaction, all inherited `file:line` citations are SUSPECT until re-Read. Fabricated cites get logged with `compaction-fabrication` tag. Defense-in-depth against post-compaction pattern-completion fabrication. PR [#410](https://github.com/EtanHey/golems/pull/410).
- **`/presentation-builder` standing-preference inline** (canonical in `/coach`) — repeated stylistic asks (≥2 in a session) like "less terms, more visuals" become STANDING for the rest of the session. Self-prompt + self-check before every deliverable. Slide-deck eval: 9 correction turns → 2, slide 2 word count 377 → 17. PR [#404](https://github.com/EtanHey/golems/pull/404).
- **Hyphen-aware launchers** in [ralph #7](https://github.com/EtanHey/ralph/pull/7) — `skill-creatorClaude`, `maakaf-homeClaude`, `6pm-miniClaude` and friends now resolve, so `mcp__cmux__spawn_agent({repo:"skill-creator"})` works.

## Source

[`skills/golem-powers/`](https://github.com/EtanHey/golems/tree/master/skills/golem-powers)
