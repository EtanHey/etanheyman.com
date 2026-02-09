# Admin Dashboard Overhaul Plan

> Repo: `etanheyman.com`
> Route: `/admin/golem`
> Data source: Supabase (shared with golems/packages/autonomous)
> Parallel backend work: golems/packages/autonomous (separate Claude session)

---

## Overview

Consolidate all admin functionality into etanheyman.com. Port useful features from `golems/packages/admin-ui/` (Vite SPA being deprecated). Make the dashboard wider, denser, and more useful.

---

## Phase 1: Bug Fixes + Wider Layout + Port System Health

**Branch:** `feature/admin-phase1`
**Dependencies:** None — start immediately
**Estimated scope:** ~8 files modified

### Part A: Fix 3 bugs from PR #19 reviews

These were flagged by both CodeRabbit and Cursor bot. All are real bugs.

#### Bug 1: BadMatchModal state persists between jobs
- **File:** `app/admin/golem/components/BadMatchModal.tsx` lines 13-19
- **Problem:** Modal keeps `selectedTags` and `note` state when closed and reopened for a different job. User opens modal for Job A, selects tags, cancels, opens for Job B — sees Job A's tags.
- **Fix:** Add `useEffect` that resets state when the modal opens:
  ```tsx
  useEffect(() => {
    if (open) {
      setSelectedTags([]);
      setNote('');
    }
  }, [open, jobTitle]);
  ```

#### Bug 2: Modal clears input on save failure
- **File:** `app/admin/golem/components/BadMatchModal.tsx` lines 32-45, `handleConfirm` function
- **Problem:** Clears `selectedTags` and `note` after `await onConfirm()` regardless of success/failure. If save fails, user loses their input.
- **Fix:** `onConfirm` wraps `saveJobRejection` which returns `{ success: boolean }`. Only reset state if success is true. The `handleConfirm` should check the return value.

#### Bug 3: Dead `updated` variable
- **File:** `app/admin/golem/jobs/page.tsx` around lines 882-890
- **Problem:** An `updated` object is created with archived job fields but never used. Code immediately filters the job out with `setJobs(prev => prev.filter(...))`.
- **Fix:** Delete the unused `updated` variable.

### Part B: Wider layout

Currently the admin uses `max-w-7xl` (1280px) which wastes space on wide monitors.

- **File:** `app/admin/golem/layout.tsx`
- **Change:** Remove `max-w-7xl` and `mx-auto` from these 3 containers:
  - Header: `mx-auto max-w-7xl px-4 py-3` → `px-4 sm:px-6 py-3`
  - Nav: `mx-auto max-w-7xl px-4` → `px-4 sm:px-6`
  - Content: `mx-auto h-full max-w-7xl px-4 py-4` → `h-full px-4 sm:px-6 py-4`
- **ONLY change admin layout** — do NOT touch the main site layout

### Part C: Increase data density

Now that we have full width, show more data inline:

- **`emails/page.tsx`**: Make sender (`from_address`) more prominent in list. Show snippet preview inline (not just in detail view).
- **`jobs/page.tsx`**: Show company + location as visible columns in list view. Add description preview (first ~100 chars, truncated).
- **`page.tsx` (overview)**: Use full width for stats cards. Port system health cards from `golems/packages/admin-ui/src/components/Dashboard.tsx`:
  - Cloud Worker status (online/offline)
  - Uptime
  - LLM Backend + cost
  - Events count (24h)
  - These read from `golem_events` Supabase table and the cloud worker health endpoint

### Part D: Port UsageStats to overview

From `golems/packages/admin-ui/src/components/UsageStats.tsx`, add to the overview page:
- Total API calls, input/output tokens, total cost
- Breakdown by source (table)
- This reads from the cloud worker `/usage` endpoint
- Convert from client-side Supabase to Next.js server action

---

## Phase 2: Email Sender Modal + Unsubscribe

**Branch:** `feature/admin-phase2`
**Dependencies:** Backend Phase 3 must create `email_senders` table + unsubscribe API first
**Wait for:** Backend Claude to notify that email_senders table is ready

### What to build

1. **Sender button on each email row** — clickable sender name/email that opens modal
2. **SenderModal component:**
   - Header: sender name, email address, category badge (promo/newsletter/normal)
   - Stats: total emails received, average score, last email date
   - History: last 10 emails from this sender (subject + date)
   - Actions:
     - For promos/newsletters: "Unsubscribe" button
     - For normal emails: "Reply" button (opens draft-reply)
     - "Block sender" option
3. **Server actions:**
   - `getSenderDetails(emailAddress)` — query `email_senders` + recent emails
   - `setSenderAction(emailAddress, action)` — keep/unsubscribe/block
4. **Bulk mode:** Checkbox on email list, "Unsubscribe selected senders" button

### Data contract (from backend)

The `email_senders` Supabase table will have:
- `email_address` (PK), `display_name`, `category`
- `total_emails`, `last_email_at`, `avg_score`
- `unsubscribe_url`, `unsubscribe_status`
- `user_action` (null/keep/unsubscribe/block)

---

## Phase 3: Activity Log + Event Timeline

**Branch:** `feature/admin-phase3`
**Dependencies:** Backend Phase 2 must create `scrape_activity` table first
**Wait for:** Backend Claude to notify that scrape_activity table is ready

### What to build

1. **Redesign `alerts/page.tsx`** as full Activity Log:
   - Timeline view: each scrape run as a card
   - Per source breakdown: SecretTLV / Drushim / Indeed / Goozali
   - Stats per run: total found, new saved, duplicates, errors
2. **Port EventLog from golems/admin-ui** (`EventLog.tsx`):
   - Table: actor, type, timestamp, data
   - Filter by actor (golem dropdown)
   - Convert from client-side Supabase to server action
   - Reads from `golem_events` table
3. **Quality dashboard:**
   - Description completeness rate
   - Source comparison (which gives best data?)
   - Job quality flags (missing description, short titles)
4. **Email processing stats:**
   - Recent scoring runs
   - Category distribution
5. **Port OutreachPipeline features** into existing `outreach/page.tsx`

### Existing quality features (already built, don't recreate)

- Thumbs up/down relevance buttons (`RelevanceButtons.tsx`)
- BadMatchModal with rejection tags + explanation
- Tags: wrong_seniority, wrong_stack, wrong_location, low_quality_listing, duplicate, expired, irrelevant
- `human_match_score`, `human_relevant`, `correction_tags`, `rejection_note` fields

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

## Existing Pages

| Page | Route | Purpose |
|------|-------|---------|
| Overview | `/admin/golem` | Stats dashboard |
| Emails | `/admin/golem/emails` | Email triage + scoring |
| Jobs | `/admin/golem/jobs` | Job listings + feedback |
| Alerts | `/admin/golem/alerts` | Will become Activity Log |
| Outreach | `/admin/golem/outreach` | Recruiter pipeline |
| Night Shift | `/admin/golem/nightshift` | Autonomous work tracking |
| Content | `/admin/golem/content` | Soltome content management |

---

## Server Actions Pattern

All data fetching uses Next.js server actions in `actions/data.ts` and `jobs/actions/jobs.ts`. Follow the same pattern:

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

---

## What to Port from golems/packages/admin-ui/

| Source Component | Port To | What It Does |
|-----------------|---------|--------------|
| `Dashboard.tsx` | `page.tsx` (overview) | Cloud worker status, uptime, LLM backend, events count |
| `UsageStats.tsx` | `page.tsx` (overview) | API calls, tokens, cost breakdown by source |
| `EventLog.tsx` | `alerts/page.tsx` | Golem event timeline with actor filter |
| `OutreachPipeline.tsx` | `outreach/page.tsx` | Merge any missing features |

Convert all from client-side `supabase.from()` calls to Next.js server actions.

---

## Cross-Plan Communication

A separate Claude session is working on `golems/packages/autonomous` (backend). It will:

1. **Phase 1:** Wire Haiku into email/job scoring, fix Railway deployment
2. **Phase 2:** Improve scraping quality, create `scrape_activity` table
3. **Phase 3:** Create `email_senders` table, implement unsubscribe API

When backend phases complete, the user will tell you. You can then proceed with admin Phases 2 and 3.
