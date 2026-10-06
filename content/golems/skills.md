---
title: "Skills Library"
description: "Reusable Claude Code skills covering development, operations, content, research, and quality workflows."
---

# Skills Library

> Reusable Claude Code skills. Each skill is a focused workflow you can invoke with `/skill-name` in any Claude Code session.

## What Are Skills?

Skills are Claude Code plugins that provide specialized capabilities. They're stored in `skills/golem-powers/` and can be installed into any project. Each skill has a trigger (slash command), a description, and focused instructions for a specific workflow.

## Skill Categories

The live, always-current inventory is the auto-generated [Skills Library](/golems/skills) page. It is regenerated from `skills/golem-powers/` in the golems repo, so it lists only skills that exist there today, each with its docs, eval status and install command.

## Using Skills

In any Claude Code session with golem-powers installed:

```
/pr-loop             # Run the full PR loop
/large-plan          # Scaffold a multi-phase plan
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

## Evals

Many skills ship eval suites (`evals/evals.json`) with structured assertions that check the skill triggers correctly and produces the expected behavior. No skill has yet been evaluated on current models with the model recorded, so this site publishes no pass rates. Each skill's page shows its eval status.

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
