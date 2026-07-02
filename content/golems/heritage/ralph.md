---
title: "Ralph"
description: "The original autonomous coding loop that turned PRD stories into reviewed commits and established the Golems execution model."
sidebar_position: 1
type: tool
retired: true
status: foundational
---

# Ralph

> Ralph — the Ralph Wiggum loop. The first deep tool in the ecosystem: an autonomous loop that runs one prompt against a repo until the story is actually done. Where Golems began.

Ralph matters because it proved the core Golems bet: agents become useful when they are wrapped in a loop with scope, review, verification, and commit discipline.

## What It Was

Ralph was an **autonomous coding engine** built in Zsh. It read Product Requirement Documents (PRDs), spawned fresh Claude Code sessions for each story, implemented the changes, ran CodeRabbit review, and committed on success. Most of the early Golems ecosystem was built through this loop.

Ralph is now a Heritage entry rather than a live package page. The current ecosystem keeps the lessons Ralph established - small scoped stories, explicit acceptance criteria, review gates, and verified commits - while newer tools and skills carry those patterns forward.

## Core Loop

```
while stories remain:
  spawn fresh Claude Code session
  read story from prd-json/
  implement all acceptance criteria
  run CodeRabbit review
  if review passes: commit
  if review fails: create BUG story
done
```

## Original Commands

| Command | Purpose |
|---------|---------|
| `ralph N` | Run N story iterations |
| `ralph -G` | Use Gemini mode |
| `ralph -ui` | Launch React Ink dashboard |
| `ralph --prd path/` | Use a specific PRD directory |

## Why It Mattered

Ralph turned "ask Claude to code" into a repeatable production loop:

- **Story scope:** every run started from a specific PRD story.
- **Fresh execution:** each iteration spawned a fresh Claude Code session.
- **Acceptance criteria:** done meant criteria satisfied, not just code edited.
- **Review gate:** CodeRabbit review was part of the loop, not an afterthought.
- **Commit discipline:** successful stories landed as conventional commits.

Those mechanics became the foundation for today's Golems skills and PR workflows. See the live [Skills Library](/golems/skills) for the current catalog.

## PRD Format

Stories are JSON files with structured acceptance criteria:

```json
{
  "id": "US-001",
  "title": "Add email scoring",
  "criteria": [
    { "text": "Score emails 1-10 using LLM", "files": ["src/email/scorer.ts"] },
    { "text": "Run CodeRabbit review - must pass" },
    { "text": "Commit: feat: US-001 add email scoring" }
  ]
}
```

Every story's last two criteria are always:

1. CodeRabbit review (must pass)
2. Commit with conventional message

## Heritage

Ralph was invoked via the `ralph-commit` skill or the `golems` CLI. It sat at the point where stories, skills, review automation, and git discipline first converged into a single autonomous developer loop.

## What Ralph Built

Ralph was responsible for landing 259+ PRs with 497+ commits and 40,000+ lines of code - all written by Claude Code, orchestrated by Ralph's autonomous loop.

## Historical Source

[`packages/ralph/`](https://github.com/EtanHey/golems/tree/master/packages/ralph)
