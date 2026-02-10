# Dashboard Redesign: Per-Golem Pages

> Replace mixed dashboard pages with 3 golem-based dashboards. Each page tells user what to DO.

---

## Overview

Replace the current stats-grid overview + separate jobs/outreach pages with 3 golem-focused dashboards:
1. **RecruiterGolem** (`/admin/golem/recruiter`) — jobs + connections + action items
2. **TellerGolem** (`/admin/golem/teller`) — subscriptions + payments + spend
3. **MonitorGolem** (`/admin/golem/monitor`) — service status + events + LLM costs

**Keep as-is:** emails, alerts, nightshift pages (they're still useful independently).
**Delete:** `jobs/` directory, `outreach/` directory (merged into recruiter).

---

## Branch

Create branch `feature/dashboard-golem-redesign` from master.

---

## File Structure After Changes

```
app/admin/golem/
├── page.tsx                    # UPDATE — 3 golem cards instead of stat grid
├── layout.tsx                  # UPDATE — new nav items
├── recruiter/page.tsx          # NEW
├── teller/page.tsx             # NEW
├── monitor/page.tsx            # NEW
├── emails/page.tsx             # KEEP as-is
├── alerts/page.tsx             # KEEP as-is
├── nightshift/page.tsx         # KEEP as-is
├── content/page.tsx            # KEEP as-is
├── jobs/                       # DELETE entire directory
├── outreach/                   # DELETE entire directory
├── actions/
│   ├── data.ts                 # UPDATE — add getGolemOverviewStats()
│   ├── recruiter.ts            # NEW
│   ├── teller.ts               # NEW
│   └── monitor.ts              # NEW
├── components/
│   ├── (existing keep all)
│   ├── GolemCard.tsx            # NEW
│   ├── ActionItem.tsx           # NEW
│   └── ServiceStatus.tsx        # NEW
└── lib/
    ├── constants.ts             # UPDATE — add golem colors
    └── format.ts                # KEEP as-is
```

---

## Step 1: Server Actions

### `actions/recruiter.ts`

```typescript
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  const allowedUsernames = process.env.ALLOWED_GITHUB_USERNAMES?.split(',') || [];
  if (allowedUsernames.length > 0) {
    const username = (session.user as any)?.githubUsername;
    if (!username || !allowedUsernames.includes(username)) throw new Error('Forbidden');
  }
  return session;
}

export interface RecruiterDashboard {
  // Job counts by status
  jobsByStatus: { status: string; count: number }[];
  totalJobs: number;
  // Action items
  newHighScoreJobs: number;    // status=new, match_score >= 8
  staleApplications: number;   // status=applied, applied_at > 3 days ago
  // Recent high-score jobs (for the action items section)
  hotJobs: Array<{
    id: string;
    title: string;
    company: string;
    match_score: number | null;
    source: string;
    url: string;
    created_at: string;
    match_reasons: string[];
  }>;
  // Connections at applied companies
  connectionMatches: Array<{
    connectionName: string;
    position: string | null;
    company: string | null;
    jobTitle: string;
    jobCompany: string;
  }>;
}

export async function getRecruiterDashboard(): Promise<{ data: RecruiterDashboard | null; error: string | null }> {
  try {
    await requireAuth();
    const supabase = createAdminClient();

    const [allJobsRes, hotJobsRes, appliedJobsRes, connectionsRes] = await Promise.all([
      supabase.from('golem_jobs').select('status'),
      supabase.from('golem_jobs')
        .select('id, title, company, match_score, source, url, created_at, match_reasons')
        .eq('status', 'new')
        .gte('match_score', 8)
        .order('match_score', { ascending: false })
        .limit(10),
      supabase.from('golem_jobs')
        .select('id, title, company, applied_at')
        .eq('status', 'applied')
        .order('applied_at', { ascending: true }),
      supabase.from('linkedin_connections')
        .select('full_name, position, company, company_normalized'),
    ]);

    // Aggregate job statuses
    const statusMap = new Map<string, number>();
    for (const row of (allJobsRes.data || []) as { status: string | null }[]) {
      const status = row.status || 'unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    }
    const jobsByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Stale applications (applied > 3 days ago)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const staleApplications = (appliedJobsRes.data || []).filter(
      (j: any) => j.applied_at && j.applied_at < threeDaysAgo
    ).length;

    // Connection matches: find connections at companies where user has applied/saved jobs
    const appliedCompanies = (appliedJobsRes.data || []).map((j: any) => ({
      company: (j.company || '').toLowerCase(),
      title: j.title,
    }));
    const connectionMatches: RecruiterDashboard['connectionMatches'] = [];
    for (const conn of (connectionsRes.data || []) as any[]) {
      const normalized = (conn.company_normalized || conn.company || '').toLowerCase();
      if (!normalized) continue;
      for (const job of appliedCompanies) {
        if (normalized.includes(job.company) || job.company.includes(normalized)) {
          connectionMatches.push({
            connectionName: conn.full_name || 'Unknown',
            position: conn.position,
            company: conn.company,
            jobTitle: job.title,
            jobCompany: job.company,
          });
        }
      }
    }

    return {
      data: {
        jobsByStatus,
        totalJobs: allJobsRes.data?.length || 0,
        newHighScoreJobs: hotJobsRes.data?.length || 0,
        staleApplications,
        hotJobs: (hotJobsRes.data || []) as any,
        connectionMatches: connectionMatches.slice(0, 10),
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}
```

### `actions/teller.ts`

```typescript
'use server';

// Same auth pattern as recruiter.ts

export interface TellerDashboard {
  subscriptions: Array<{
    id: string;
    service_name: string;
    amount: number | null;
    currency: string | null;
    frequency: string | null;
    status: string | null;
    last_payment: string | null;
  }>;
  monthlyTotal: number;
  recentSubscriptionEmails: Array<{
    id: string;
    subject: string | null;
    from_address: string | null;
    received_at: string | null;
    score: number | null;
  }>;
}

export async function getTellerDashboard(): Promise<{ data: TellerDashboard | null; error: string | null }> {
  // 1. All subscriptions
  // 2. Recent emails with category = 'subscription' (last 30 days)
  // 3. Calculate monthly total from subscriptions
}
```

### `actions/monitor.ts`

```typescript
'use server';

// Same auth pattern

export interface MonitorDashboard {
  serviceStatuses: Array<{
    service: string;
    lastRun: string | null;
    duration_ms: number | null;
    status: string;
  }>;
  recentEvents: Array<{
    id: string;
    actor: string;
    type: string;
    data: Record<string, unknown>;
    created_at: string;
  }>;
  eventsByActor: Array<{ actor: string; count: number }>;
  llmUsage: {
    totalCalls: number;
    totalCost: number;
    byModel: Array<{ model: string; calls: number; cost: number }>;
    last7dCost: number;
  };
}

export async function getMonitorDashboard(): Promise<{ data: MonitorDashboard | null; error: string | null }> {
  // 1. Latest run per service from service_runs
  // 2. Recent events (48h) grouped by actor
  // 3. LLM usage summary from llm_usage
}
```

---

## Step 2: New Components

### `components/GolemCard.tsx`

Props: `icon: string`, `title: string`, `metrics: {label, value}[]`, `href: string`, `borderColor: string`

Dark card with colored left border (`border-l-4`), hover effect (`hover:bg-white/10`), link to golem page. Used on overview page for the 3 golem cards.

### `components/ActionItem.tsx`

Props: `icon: ReactNode`, `title: string`, `description: string`, `priority: 'urgent' | 'soon' | 'info'`, `href?: string`

Colored by priority: red (urgent), amber (soon), blue (info). Optional link.

### `components/ServiceStatus.tsx`

Props: `name: string`, `lastRun: string | null`, `duration: number | null`, `status: string`, `expectedIntervalHours: number`

Green/amber/red dot based on lastRun vs expectedInterval. Uses `formatRelativeTime` from existing `lib/format.ts`.

---

## Step 3: Pages

### `recruiter/page.tsx`

'use client' page with three sections:

**Section A: Action Items (top)**
- Cards with suggested actions sorted by urgency
- "Review X new high-score jobs" (newHighScoreJobs from data)
- "Follow up: X stale applications" (staleApplications)
- "You know [Name] at [Company]" (connectionMatches)
- Uses ActionItem component

**Section B: Jobs Pipeline (middle)**
- Status tabs: All | New (count) | Viewed | Saved | Applied | Archived
- Reuse existing job card patterns from `jobs/page.tsx`:
  - title, company, match_score with ScoreEditor
  - source badge, status badge
  - Click to expand: description, match_reasons
- Client-side filtering by status tab
- Link to apply/view external URL

**Section C: Network (bottom, collapsible)**
- connectionMatches from data
- Show: name, position, company
- "Draft message" button (link or modal)

### `teller/page.tsx`

'use client' page with two sections:

**Section A: Subscription Tracker**
- Table: service_name | amount | frequency | last_payment | status
- Color-coded: green = active, amber = payment due, red = failed
- "Total monthly: $X.XX" summary banner at top
- Note: only 2 subscriptions currently, design for scale

**Section B: Recent Subscription Emails**
- List of subscription-category emails from last 30 days
- Subject, sender, received date
- Highlight if amount in subject differs from known subscription

### `monitor/page.tsx`

'use client' page with three sections:

**Section A: Service Status grid**
- Grid of ServiceStatus cards for: email-golem, job-golem, briefing, nightshift, telegram, bedtime-guardian
- Expected intervals: email (1h), jobs (8h), briefing (24h), nightshift (24h)
- Data from service_runs table

**Section B: Recent Activity feed**
- Event feed from golem_events (last 48 hours)
- Grouped by actor with actor color from constants.ts
- Show event type label + data preview
- Reuse actorColors from constants.ts

**Section C: LLM Usage**
- Cost summary cards: total spent, total calls, by model
- Same pattern as existing LLM section on overview page
- Data from llm_usage table

---

## Step 4: Update Layout Navigation

Change navItems in `layout.tsx`:

```typescript
const navItems = [
  { href: '/admin/golem', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/golem/recruiter', label: 'Recruiter', icon: Briefcase },
  { href: '/admin/golem/teller', label: 'Teller', icon: DollarSign },
  { href: '/admin/golem/monitor', label: 'Monitor', icon: Activity },
  { href: '/admin/golem/emails', label: 'Emails', icon: Mail },
  { href: '/admin/golem/alerts', label: 'Activity', icon: Bell },
  { href: '/admin/golem/nightshift', label: 'Night Shift', icon: Moon },
];
```

Need to add `DollarSign, Activity` to lucide-react imports.

---

## Step 5: Update Overview Page

Replace the current stats grid with 3 GolemCard components:

| Card | Icon | Title | Metrics | Border Color |
|------|------|-------|---------|-------------|
| RecruiterGolem | Briefcase | RecruiterGolem | "X new jobs to review", "X applications out" | emerald |
| TellerGolem | DollarSign | TellerGolem | "$XX/mo subscriptions", "X payment alerts" | amber |
| MonitorGolem | Activity | MonitorGolem | "X services green", "$X.XX LLM spent" | violet |

Keep below: Railway status banner, recent activity feed, email categories breakdown.

The overview page needs a new server action `getGolemOverviewStats()` in `data.ts` that returns quick summary numbers for each golem card. Or reuse `getOverviewStats()` and just restructure the UI.

---

## Step 6: Delete Old Pages

```bash
rm -rf app/admin/golem/jobs/
rm -rf app/admin/golem/outreach/
```

The jobs page code is useful as reference for the recruiter page — copy the filtering/sorting patterns before deleting.

---

## Supabase Tables Reference

| Table | Rows | Key Columns | Used By |
|-------|------|-------------|---------|
| `golem_jobs` | 255 | title, company, match_score, status, source, url, match_reasons | Recruiter |
| `linkedin_connections` | 823 | full_name, company, company_normalized, position | Recruiter |
| `subscriptions` | 2 | service_name, amount, frequency, status, last_payment | Teller |
| `payments` | 0 | subscription_id, amount, paid_at | Teller |
| `emails` | 515 | subject, from_address, score, category, received_at | Teller (category=subscription) |
| `service_runs` | 17 | service, started_at, ended_at, duration_ms, status | Monitor |
| `golem_events` | 180 | actor, type, data, created_at | Monitor |
| `llm_usage` | 224 | model, source, input_tokens, output_tokens, cost_usd | Monitor |
| `golem_state` | 21 | key, value, updated_at | Monitor |

---

## Styling Rules

- Follow existing dark theme: `bg-[#00003f]`, `bg-white/5`, `text-white`, `border-white/10`
- Use existing color system from `lib/constants.ts` (scoreColor, statusConfig, actorColors, categoryColors)
- Mobile-first with `md:` breakpoints
- Existing component reuse: `PageHeader`, `SearchFilterBar`, `ScoreEditor`, `CategoryBadge`, `RelevanceButtons`, `ListDetailLayout`
- Hover states: `hover:bg-white/5` or `hover:bg-white/10`
- Loading states: `Loader2` spinner from lucide-react
- Error states: centered red text

---

## Verification

```bash
npm run build  # no build errors
npm run dev    # manual visual check
# Visit /admin/golem → 3 golem cards
# Visit /admin/golem/recruiter → jobs pipeline + action items
# Visit /admin/golem/teller → subscriptions
# Visit /admin/golem/monitor → service status + events + LLM usage
# Verify old /admin/golem/jobs returns 404
# Verify old /admin/golem/outreach returns 404
```
