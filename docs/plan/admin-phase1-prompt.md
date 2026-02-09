# Admin Dashboard Phase 1 — Full Work Prompt

> Copy this entire file as the first message to a new Claude Code session in `~/Gits/etanheyman.com`

---

## Your Mission

You are working on **Phase 1 of the Admin Dashboard Overhaul** for `etanheyman.com`. This is a Next.js app with an admin section at `/admin/golem`. Your job is to:

1. Fix 3 real bugs from PR #19 reviews
2. Make the admin layout full-width (remove max-w-7xl)
3. Increase data density across all admin pages
4. Port system health + usage stats from the old admin-ui

**Branch:** `feature/admin-phase1` (already created, plan committed)
**Base:** `main` at commit `d859dd2`

---

## The Plan

Read the full plan at `docs/plan/admin-overhaul.md` — it has everything. Here's a summary:

### Part A: Fix 3 Bugs

#### Bug 1: BadMatchModal state persists between jobs
- **File:** `app/admin/golem/components/BadMatchModal.tsx` lines 13-19
- **Problem:** `selectedTags` and `note` state persist when modal closes and reopens for a different job
- **Fix:** Add `useEffect` that resets state when modal opens:
  ```tsx
  useEffect(() => {
    if (open) {
      setSelectedTags([]);
      setNote('');
    }
  }, [open, jobTitle]);
  ```

#### Bug 2: Modal clears input on save failure
- **File:** `app/admin/golem/components/BadMatchModal.tsx` lines 32-45
- **Problem:** `handleConfirm` clears `selectedTags` and `note` after `await onConfirm()` regardless of success/failure
- **Fix:** `onConfirm` wraps `saveJobRejection` which returns `{ success: boolean }`. Only reset state if success is true.

#### Bug 3: Dead `updated` variable
- **File:** `app/admin/golem/jobs/page.tsx` around lines 882-890
- **Problem:** `updated` object created but never used — code immediately filters job out
- **Fix:** Delete the unused variable

### Part B: Wider Layout

- **File:** `app/admin/golem/layout.tsx`
- Remove `max-w-7xl` and `mx-auto` from 3 containers:
  - Header: `mx-auto max-w-7xl px-4 py-3` -> `px-4 sm:px-6 py-3`
  - Nav: `mx-auto max-w-7xl px-4` -> `px-4 sm:px-6`
  - Content: `mx-auto h-full max-w-7xl px-4 py-4` -> `h-full px-4 sm:px-6 py-4`
- **ONLY change admin layout** — do NOT touch the main site layout

### Part C: Increase Data Density

- **`emails/page.tsx`**: Make sender (`from_address`) more prominent. Show snippet preview inline.
- **`jobs/page.tsx`**: Show company + location as visible columns. Add description preview (first ~100 chars).
- **`page.tsx` (overview)**: Use full width for stats cards.

### Part D: Port UsageStats + System Health to Overview

Port from `~/Gits/golems/packages/admin-ui/src/components/`:
- **`Dashboard.tsx`** -> overview page: Cloud Worker status, uptime, LLM backend, events count
- **`UsageStats.tsx`** -> overview page: API calls, tokens, cost breakdown

These read from the `golem_events` Supabase table and the cloud worker health/usage endpoints. Convert from client-side Supabase to Next.js server actions.

The cloud worker base URL is in environment variables. Create server actions following the existing pattern.

---

## Design System (DO NOT CHANGE)

| Property | Value |
|----------|-------|
| Font | Nutmeg (`font-sans`) — NO other fonts |
| Background | `bg-[#00003f]` (dark navy) |
| Primary | `#0f82eb` (blue) |
| Framework | Tailwind v4 with `@theme` directive |

**DO NOT modify `globals.css` or `tailwind.config.js`.**

---

## Existing Components (reuse, don't recreate)

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Page title + description |
| `CategoryBadge` | Colored category labels |
| `ScoreEditor` | Editable 1-10 score |
| `CorrectionBanner` | Shows when human correction exists |
| `ListDetailLayout` | Split list/detail view |
| `SearchFilterBar` | Search + filter controls |
| `RelevanceButtons` | Thumbs up/down feedback |
| `BadMatchModal` | Rejection with tags + note |

---

## Server Actions Pattern

All data fetching uses Next.js server actions. Follow this pattern:

```typescript
"use server";
import { createClient } from "@/lib/supabase/server";

export async function myNewAction(params) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("table").select("*");
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
```

Existing server actions are in `actions/data.ts` and `jobs/actions/jobs.ts`.

---

## Existing Admin Pages

| Page | Route | File |
|------|-------|------|
| Overview | `/admin/golem` | `app/admin/golem/page.tsx` |
| Emails | `/admin/golem/emails` | `app/admin/golem/emails/page.tsx` |
| Jobs | `/admin/golem/jobs` | `app/admin/golem/jobs/page.tsx` |
| Alerts | `/admin/golem/alerts` | `app/admin/golem/alerts/page.tsx` |
| Outreach | `/admin/golem/outreach` | `app/admin/golem/outreach/page.tsx` |
| Night Shift | `/admin/golem/nightshift` | `app/admin/golem/nightshift/page.tsx` |
| Content | `/admin/golem/content` | `app/admin/golem/content/page.tsx` |

---

## How to Work

1. **Read the plan first**: `docs/plan/admin-overhaul.md`
2. **Read the files before editing**: Always understand existing code
3. **Fix bugs first** (Part A), then layout (Part B), then density (Part C), then porting (Part D)
4. **Test**: Run `npm run test:run` to verify tests pass
5. **Dev server**: `npm run dev` to verify visually (port 3000)
6. **Commit when done**: One commit covering all Phase 1 changes
7. **Create PR** to `main` with title: `feat(admin): phase 1 — wider layout + bug fixes + data density`

---

## What NOT to Do

- Do NOT modify `globals.css` or `tailwind.config.js`
- Do NOT change the main site layout (only admin section)
- Do NOT create new fonts or override the design system
- Do NOT add new npm dependencies unless absolutely necessary
- Do NOT work on Phase 2 or Phase 3 (they depend on backend work that isn't done yet)
- Do NOT touch the Supabase schema — just read from existing tables

---

## Reference: Old Admin-UI Components to Port

The old Vite admin app lives at `~/Gits/golems/packages/admin-ui/src/components/`. Key files:

- **`Dashboard.tsx`**: Fetches cloud worker health endpoint, shows status cards (online/offline, uptime, LLM backend, cost, events count). Uses client-side Supabase for `golem_events` table.
- **`UsageStats.tsx`**: Fetches cloud worker `/usage` endpoint, shows total API calls, input/output tokens, total cost, breakdown by source table.
- **`EventLog.tsx`**: Reads `golem_events` table, shows actor/type/timestamp/data columns with actor filter dropdown. (This is for Phase 3, not Phase 1 — just noting for reference.)

When porting, convert all client-side `supabase.from()` calls to Next.js server actions.
