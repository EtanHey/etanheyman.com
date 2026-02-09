# Admin Dashboard Completion

> Fix all dashboard UX issues: categories, pagination, job workflow, feedback loop.

## Progress

| # | Phase | Folder | Status | Notes |
|---|-------|--------|--------|-------|
| 1 | Foundation | [phase-1](phase-1/) | 🏗️ | Supabase migration done, constants typed |
| 2 | Jobs Overhaul | [phase-2](phase-2/) | ⏳ | Bad match modal, hide archived, sort, warnings |
| 3 | Emails | [phase-3](phase-3/) | ⏳ | Category normalization, pagination |

**Branch:** `fix/admin-dashboard-complete`
**Repo:** etanheyman.com
**Scraper fix:** golems issue #72 (separate)

## Execution Rules

- **CLI agents first:** cursor for code gen, gemini for research
- **One branch, one PR** — all phases ship together
- Everything typed (no `Record<string, string>` when we know the keys)
- Tests for all new server actions

## Research Findings

### Email Categories (after DB normalization)
promo(102), tech-update(63), newsletter(62), other(41), job(33), github(30), social(3), urgent(3), subscription(1)

### Job Stats
156 total: new(121), rejected→archived(21), viewed(10), applied(4)
Drushim: 17/52 generic titles. SecretTLV: 35/35 no description.

### Decision: Simplify Job Workflow
- Remove "rejected" status → bad match (thumbs down) auto-archives
- Tag modal on bad match with reason tags
- Default view hides archived
- Default sort = date
