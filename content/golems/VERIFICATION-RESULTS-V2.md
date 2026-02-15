# Golems Docs Verification Results — V2

> Second verification pass after V1 fixes were applied. Cross-referenced against the actual codebase at `~/Gits/golems/` on 2026-02-11.

---

## 1. Structural Changes (V1 P1 Fixes)

### Coach Moved to Golems Section

| Check | Status |
|-------|--------|
| `content/golems/golems/coach.md` exists | **PASS** |
| `content/golems/packages/coach.md` removed | **PASS** |
| Sidebar.tsx: Coach under "Golems" section | **PASS** — links to `/golems/docs/golems/coach` |
| Header.tsx: Coach under "Golems" section | **PASS** — matches Sidebar |
| DOC_ORDER: `golems/coach` (not `packages/coach`) | **PASS** |

### Email Reclassified as Infrastructure

| Check | Status |
|-------|--------|
| Sidebar.tsx: "Email System" under "Infrastructure" | **PASS** |
| Header.tsx: "Email System" under "Infrastructure" | **PASS** |
| page.tsx: Email listed as "Email System" in grid | **PASS** |
| page.tsx: NOT listed as a domain golem | **PASS** |
| "7 domain golems" text removed | **PASS** — only appears in old V1 VERIFICATION-RESULTS.md |

### Golem Count

| Check | Status |
|-------|--------|
| page.tsx subtitle: "6 golems + infrastructure" | **PASS** |
| Sidebar "Golems" section: 6 items (Claude, Recruiter, Teller, Job, Coach, Content) | **PASS** |
| Sidebar "Infrastructure" section: 5 items (Shared, Email, Services, Ralph, Zikaron) | **PASS** |
| Header docsSections: matches Sidebar exactly | **PASS** |

---

## 2. Numbers Accuracy (V1 P0 Fixes)

| Claim | Value in Docs | Actual Value | Status |
|-------|--------------|-------------|--------|
| Tests | 1,179 | 1,179 | **PASS** |
| Assertions | 4,056 | 4,056 | **PASS** (was 4,054 in V1) |
| Zikaron chunks | 238K+ | 238,823 | **PASS** (was 226K+ in V1) |
| Skills | 30+ | 32 top-level | **PASS** (was 34+ in V1) |
| Packages | 10 | 10 | **PASS** |

All numbers verified in `page.tsx` Status terminal tab.

---

## 3. Remaining Stale References

### `cd packages/autonomous` — 8 occurrences in 4 files

These are instructions telling users to `cd` into the old autonomous package path. Should reference new package-specific paths.

| File | Occurrences | Context |
|------|------------|---------|
| `llm.md` | 5 (lines ~393, 1161, 1414, 1822, 1997) | CLI examples, golem startup instructions |
| `golems/claude.md` | 1 (line ~113) | "cd packages/autonomous" in setup instructions |
| `golems/teller.md` | 1 (line ~111) | "cd packages/autonomous" in setup instructions |
| `golems/recruiter.md` | 1 (line ~200) | "cd packages/autonomous" in setup instructions |

**Fix:** Replace with appropriate new paths:
- Claude setup → `cd packages/claude`
- Teller setup → `cd packages/teller`
- Recruiter setup → `cd packages/recruiter`
- LLM general refs → `cd packages/shared` or remove `cd` instruction

### "EmailGolem" as a Name — Nuanced

`EmailGolem` still appears extensively in:
- **llm.md**: 20+ references (diagrams, routing descriptions, historical narrative)
- **cloud-worker.md**: 2 references (cloud worker runs "email golem" tasks)
- **mcp-tools.md**: 1 reference (email MCP server description)
- **Several golem docs**: References to email routing from/to other golems

**Assessment:** Most uses are contextually appropriate — they describe the email routing subsystem's behavior, not classify it as a domain golem. The Sidebar/Header/page.tsx correctly list it as "Email System" infrastructure. The doc content using "EmailGolem" as a shorthand for the email subsystem is acceptable, though a style pass could normalize it to "email system" or "email router" for consistency.

**Recommendation:** LOW priority. The structural classification is correct (infrastructure in nav). In-content naming is a style preference, not a factual error.

---

## 4. App File Consistency

### page.tsx (Landing Page)

| Element | Content | Status |
|---------|---------|--------|
| Terminal tabs | Wizard, Status, Recruiter, Email, NightShift | **PASS** |
| Golems grid | 10 items total | **PASS** |
| Subtitle | "6 golems + infrastructure" | **PASS** |
| Email classification | "Email System" (not "EmailGolem") | **PASS** |
| Numbers in Status tab | 30+, 10, 1179 (4056), 238K+ | **PASS** |
| Badge links | Recruiter, Teller, Coach packages | **PASS** |

### Sidebar.tsx

| Section | Items | Status |
|---------|-------|--------|
| Overview | Getting Started, Architecture | **PASS** |
| Golems | Claude, Recruiter, Teller, Job, Coach, Content (6) | **PASS** |
| Infrastructure | Shared, Email System, Services, Ralph, Zikaron (5) | **PASS** |
| Features | Interview Practice, Skills Library, MCP Tools | **PASS** |
| Deep Dives | Cloud Worker, LLM Integration, Per-Repo Sessions | **PASS** |
| Configuration | Env Vars, Secrets | **PASS** |
| Deployment | Railway | **PASS** |
| More | FAQ, Engineering Journey | **PASS** |

### Header.tsx

- `docsSections` array matches Sidebar's `sidebarConfig` exactly: **PASS**
- Mobile dropdown includes all sections: **PASS**

### DOC_ORDER ([...slug]/page.tsx)

- Contains `golems/coach` (not `packages/coach`): **PASS**
- Contains `golems/email`: **PASS**
- Order matches Sidebar section order: **PASS**
- Total: 22 entries covering all doc pages: **PASS**

---

## 5. V1 Fix Status

| V1 Issue | Priority | Status |
|----------|----------|--------|
| 12x `./packages/autonomous/bin/golems` → `golems` | P0 | **FIXED** (0 remaining) |
| MCP server paths (email, jobs) | P0 | **FIXED** |
| Skills path (`packages/ralph/skills/` → `skills/`) | P0 | **FIXED** |
| Assertion count 4,054 → 4,056 | P0 | **FIXED** |
| Chunk count 226K+ → 238K+ | P0 | **FIXED** |
| Add Zikaron/Supabase/Exa/Sophtron MCP tools | P1 | **FIXED** |
| Move coach.md to golems/ | P1 | **FIXED** |
| Clarify EmailGolem as infrastructure | P2 | **FIXED** (nav/structure) |
| Fix "7 domain golems" count | P2 | **FIXED** |
| Clarify ContentGolem is skills-based | P2 | **FIXED** |

---

## 6. Remaining Issues (New P1)

| Issue | Files | Fix |
|-------|-------|-----|
| 8x `cd packages/autonomous` in doc content | llm.md, claude.md, teller.md, recruiter.md | Replace with new package paths |
| "EmailGolem" naming in doc prose | llm.md (20+), cloud-worker.md (2), mcp-tools.md (1) | Style pass — normalize to "email system/router" (LOW) |

---

## 7. Summary

**V2 Score: 9.5/10** — All P0 and P1 structural issues from V1 are resolved. The nav structure (Sidebar, Header, DOC_ORDER) is fully consistent. Numbers are accurate. The only remaining issues are 8 stale `cd packages/autonomous` references in doc prose (should reference new package paths) and cosmetic "EmailGolem" naming in content that doesn't affect classification.

The docs site accurately represents the current monorepo architecture with correct golem classification, infrastructure separation, and up-to-date metrics.
