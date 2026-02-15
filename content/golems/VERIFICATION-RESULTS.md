# Golems Docs Verification Results

> Cross-referenced against the actual codebase at `~/Gits/golems/` on 2026-02-11.

---

## 1. Numbers Accuracy

| Claim in Docs | Actual Value | Status | Where Referenced |
|---------------|-------------|--------|-----------------|
| 1,179 tests | 1,179 tests | **Correct** | llm.md, journey.md |
| 4,054 assertions | **4,056 assertions** | **Off by 2** | llm.md:687 |
| 226K+ chunks | **238,823 chunks** | **Stale — update to 238K+** | zikaron.md:3,12,58; journey.md:44; faq.md:20; architecture.md:22; getting-started.md:14 |
| 34+ skills | **32 top-level skills** (+ 52 workflows) | **Slightly inflated** | skills.md:3,8; ralph.md:38,77; faq.md:75; getting-started.md:120 |
| 6 skill categories | 6 categories | **Correct** | llm.md:423 |

---

## 2. Stale Path References (HIGH PRIORITY)

### `./packages/autonomous/bin/golems` → should be `golems` (global CLI)

The golems CLI is now a global command (symlinked to `~/bin/golems` from `packages/autonomous/bin/golems`). Docs should use `golems` not the full path.

| File | Line(s) | Old Path |
|------|---------|----------|
| llm.md | 143, 146, 380, 457, 460, 1241 | `./packages/autonomous/bin/golems` |
| getting-started.md | 81, 144, 147 | `./packages/autonomous/bin/golems` |
| golems/claude.md | 193 | `./packages/autonomous/bin/golems` |
| architecture.md | 142, 145 | `./packages/autonomous/bin/golems` |

**Fix:** Replace all with just `golems` (12 occurrences across 4 files).

### MCP Server Paths (mcp-tools.md)

| Line | Old Path | Correct Path |
|------|----------|-------------|
| 17 | `packages/autonomous/src/email-golem/mcp-server.ts` | `packages/shared/src/email/mcp-server.ts` |
| 18 | `packages/autonomous/src/job-golem/mcp-server.ts` | `packages/jobs/src/mcp-server.ts` |

### Skills Path (skills.md)

| Line | Old Path | Correct Path |
|------|----------|-------------|
| 113 | `packages/ralph/skills/golem-powers/` | `skills/golem-powers/` (root symlink) |

---

## 3. Terminology Issues

### Issue A: EmailGolem Classification
Email was dissolved into `@golems/shared/email/` during componentization. It's infrastructure, not a domain golem. But docs (email.md, getting-started.md, journey.md:362) still list it as a golem.

**Recommendation:** Clarify that email is a routing/infrastructure layer in shared, not a standalone golem package. The `email.md` doc page is fine as-is (describes the subsystem), but the getting-started.md and journey.md should not list "EmailGolem" alongside RecruiterGolem/TellerGolem/CoachGolem.

### Issue B: ContentGolem Status
`packages/content/` exists but has no `src/` code — logic lives entirely in skills (`skills/golem-powers/content/`, `skills/golem-powers/linkedin-post/`). The content.md doc correctly notes this, but other pages (getting-started.md:10, journey.md:362) imply it's a full golem.

**Recommendation:** Keep "ContentGolem" as a name but consistently note it's skills-based (no standalone process).

### Issue C: Journey Line 362
> "7 domain golems (Claude, Email, Recruiter, Teller, Job, Coach, Content)"

Email is not a domain golem (dissolved into shared). Should be "4 domain golems + orchestrator" or "5 domain agents" depending on how you count.

### Issue D: CoachGolem in Wrong Section
Coach is under `packages/` docs but it IS a golem (CoachGolem). It should be under `golems/` alongside recruiter.md, teller.md, etc.

---

## 4. Journey Completeness

### Well Covered
- [x] **Componentization (Phase 8)** — journey.md lines 319-365: All 9 phases documented with test progression (890→1,179), strangler pattern, and key decisions
- [x] **Zikaron creation** — Detailed pipeline, Hebrew folklore context
- [x] **Cloud offload** — Mac=brain, Railway=body architecture
- [x] **Mascot/branding** — Golem trailers, docsite theming, ASCII art

### Partially Covered
- [~] **PRs #101-#118** — Phases 1-8 (PRs #101-#110) are detailed. PRs #111-#118 (Phase 9 + post-componentization: npm metadata, README update, MCP docs, mascot, rules CLI, agents) are NOT mentioned
- [~] **"Claude everywhere" pivot** — journey.md lines 268-277 mention CC plugin strategy but only ~10 lines. Doesn't emphasize the major README rewrite or the "not just a Telegram bot" positioning
- [~] **Rules library** — Mentioned in Phase 4 but no operational guide. `golems rules export` and `golems wizard add-project` not documented

### Missing
- [ ] **Agent profiles** — `.claude/agents/*.md` (7 profiles) are not documented anywhere in the journey or getting-started
- [ ] **Per-repo wiring** — `golems wizard add-project` (wires external repos with CLAUDE.md, .mcp.json, skills, rules) not mentioned
- [ ] **Phase 9 completion** — Journey stops at Phase 8. Phase 9 work (PRs #111-#118) is undocumented
- [ ] **Mascot SVG** — New golems-mascot.svg added to repo (PR #118) not mentioned
- [ ] **Rules library export** — `rules-library/` directory and `golems rules` CLI subcommands not documented

---

## 5. Missing Information

### Not Documented Anywhere

| Topic | What's Missing | Where It Should Go |
|-------|---------------|-------------------|
| **Agent profiles** | 7 named agents in `.claude/agents/` (recruiter, coach, jobs, content, services, orchestrator, tax-helper) | New doc page or getting-started.md |
| **`golems wizard` CLI** | Interactive setup flow (add-project, services, secrets, deploy) | getting-started.md or new CLI reference |
| **`golems doctor` CLI** | Health check diagnostics | getting-started.md or new CLI reference |
| **`golems rules` CLI** | Rules export, check, list subcommands | skills.md or new page |
| **Rules library** | `rules-library/` with base.md, tech/*.md, workflow/*.md — exportable to any project | skills.md or architecture.md |
| **Sophtron MCP** | Bank transaction MCP server (for TellerGolem tax work) | mcp-tools.md |
| **Zikaron MCP tools** | `zikaron_search`, `zikaron_context`, `zikaron_stats`, `zikaron_list_projects` | mcp-tools.md |
| **Supabase MCP** | Full database access via MCP (tables, SQL, migrations, edge functions) | mcp-tools.md |
| **Exa MCP** | Web search, company research, code context | mcp-tools.md |
| **MCP servers directory** | `mcp-servers/` exists but is empty — no per-server doc pages | mcp-servers/*.md |
| **Per-repo wiring** | How `golems wizard add-project` sets up external repos | per-repo-sessions.md |
| **Strangler wrappers** | `packages/autonomous/src/` 1-line re-exports for backward compat | architecture.md |
| **Notification server** | localhost:3847 notify endpoint used by all services | architecture.md or getting-started.md |

### MCP Tools Page Gaps

`mcp-tools.md` only documents **email** and **jobs** MCP tools. Missing:

| MCP Server | Tools | Status |
|-----------|-------|--------|
| **zikaron** | zikaron_search, zikaron_context, zikaron_stats, zikaron_list_projects | **Not documented** |
| **supabase** | 20+ tools (tables, SQL, migrations, edge functions, branches) | **Not documented** |
| **exa** | web_search, company_research, get_code_context | **Not documented** |
| **sophtron** | Bank account/transaction access (6 tools) | **Not documented** |

---

## 6. Quick Fix List (by priority)

### P0 — Factual Errors
1. Fix 12x `./packages/autonomous/bin/golems` → `golems` (4 files)
2. Fix MCP server paths in mcp-tools.md (email: shared/src/email/, jobs: packages/jobs/src/)
3. Fix skills path in skills.md:113 (`packages/ralph/skills/` → `skills/`)
4. Update assertion count: 4,054 → 4,056
5. Update chunk count: 226K+ → 238K+

### P1 — Missing Content
6. Add Zikaron, Supabase, Exa, Sophtron MCP tools to mcp-tools.md
7. Document agent profiles (`.claude/agents/`)
8. Add Phase 9 to journey.md (PRs #111-#118)
9. Move coach.md from packages/ to golems/ (it's a domain golem)

### P2 — Terminology
10. Clarify EmailGolem is infrastructure (in shared), not a standalone golem
11. Clarify ContentGolem is skills-based (no src/ code yet)
12. Fix journey.md:362 "7 domain golems" count

### P3 — Nice to Have
13. Expand "Claude everywhere" section in journey
14. Document `golems wizard`, `golems doctor`, `golems rules` CLI
15. Add rules library documentation
16. Fill `mcp-servers/` directory with per-server pages

---

## 7. Package Doc Accuracy (cross-referenced CLAUDE.md vs doc pages)

### Excellent Alignment
- **CoachGolem** — fully aligned, architecture and types match
- **Zikaron** — perfect alignment with pipeline documentation
- **TellerGolem** — schemas and reports match
- **RecruiterGolem** — E1-E6 pipeline accurately described

### Needs Updates
- **@golems/shared** (shared.md) — docs missing 10+ lib modules added during componentization: `cloud-llm.ts`, `helpers.ts`, `agent-runner.ts`, `ascii-mascots.ts`, `cost-tracker.ts`, `session-registry.ts`, `system-detect.ts`, `tui.ts`, `quality-sweep.ts`. Also missing Teller MCP tools (`teller_monthlyReport`, `teller_taxSummary` are in the email MCP server, not documented as shared)
- **Ralph** (ralph.md) — docs describe old autonomous PRD engine. Post-componentization, Ralph is now primarily a rules/reference library + React Ink TUI. The CLAUDE.md reflects this but the doc page doesn't
- **Services** (services.md) — missing session-archiver, helper status wrappers, healthcheck, bedtime-guardian modules that were added in Phases 7-8
- **ContentGolem** (content.md) — correct but minimal. Accurately notes skills-based approach

### Critical Mismatches
- **ClaudeGolem** (golems/claude.md) — docs reference `packages/autonomous/` paths but all code is now in `packages/claude/` + `packages/services/`. The entire Telegram bot section needs path updates
- **EmailGolem** (golems/email.md) — docs imply it's an autonomous golem; reality is it's a domain service in `@golems/shared/email/` with no Telegram commands of its own
- **JobGolem** (golems/job-golem.md) — minor: naming inconsistency between "JobGolem" (docs) and `@golems/jobs` (package name). Also uses old `packages/autonomous/src/job-golem/` paths

---

## Summary

**Overall docs quality: 7.5/10** — Architecture and individual golem pages are excellent. The main gaps are: stale paths from pre-componentization, missing MCP server documentation (only 2 of 6 servers documented), no coverage of the new agent profiles / rules library / wizard features added in Phase 9+, and several package docs that still reference the old `packages/autonomous/` structure.

The 12 stale `./packages/autonomous/bin/golems` CLI references are the most visible issue — anyone following the getting-started guide would hit a confusing path. The ClaudeGolem and EmailGolem doc pages have the deepest structural mismatches with the actual codebase.
