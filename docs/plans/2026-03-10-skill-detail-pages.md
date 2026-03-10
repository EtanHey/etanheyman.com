# Skill Detail Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `/golems/skills/[name]` detail pages that render SKILL.md content, eval results, install prompt, and trust signals for each of the 55 golem skills.

**Architecture:** Generate a skills manifest JSON from the golems repo (reads SKILL.md + evals.json per skill). Server component renders each skill page using MDXRemote for markdown content. SkillCards in the existing SkillsShowcase become links to detail pages.

**Tech Stack:** Next.js 15 server components, MDXRemote, gray-matter, existing golems design system (dark theme, amber/green accents).

---

### Task 1: Generate Skills Manifest Script

**Files:**
- Create: `scripts/generate-skills-manifest.ts`
- Create: `app/(golems)/golems/lib/skills-manifest.json`

**Step 1: Write the manifest generation script**

```typescript
// scripts/generate-skills-manifest.ts
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const SKILLS_DIR = join(process.env.HOME || '~', 'Gits/golems/skills/golem-powers');
const OUTPUT = join(__dirname, '../app/(golems)/golems/lib/skills-manifest.json');

// Category map from SkillsShowcase.tsx (reuse exactly)
const CATEGORY_MAP: Record<string, string> = {
  commit: 'Development', 'pr-loop': 'Development', worktrees: 'Development',
  'test-plan': 'Development', lsp: 'Development', coderabbit: 'Development',
  'critique-waves': 'Development',
  'cmux-agents': 'Operations', cmux: 'Operations', railway: 'Operations',
  '1password': 'Operations', github: 'Operations', convex: 'Operations',
  'golem-install': 'Operations',
  brainlayer: 'Research & Context', research: 'Research & Context',
  context7: 'Research & Context', 'github-research': 'Research & Context',
  catchup: 'Research & Context', obsidian: 'Research & Context',
  content: 'Content & Communication', 'voice-sessions': 'Content & Communication',
  'video-showcase': 'Content & Communication', 'presentation-builder': 'Content & Communication',
  'youtube-pipeline': 'Content & Communication',
  'never-fabricate': 'Quality', 'large-plan': 'Quality', archive: 'Quality',
  'writing-skills': 'Quality', skills: 'Quality',
  coach: 'Domain', 'interview-practice': 'Domain', prd: 'Domain',
  brave: 'Domain', 'figma-loop': 'Domain', 'cli-agents': 'Domain',
};

interface SkillEval {
  id: number;
  name?: string;
  prompt: string;
  expected_output: string;
  assertions: { name: string; description: string; type?: string }[];
}

interface SkillManifestEntry {
  name: string;
  command: string;
  description: string;
  category: string;
  content: string;         // raw SKILL.md markdown (without frontmatter)
  frontmatter: Record<string, unknown>;
  evalCount: number;
  assertionCount: number;
  hasFixtures: boolean;
  evals: { name: string; assertionCount: number; assertions: string[] }[];
  workflows: string[];
  lastModified: string;
}

function generateManifest() {
  const skills: Record<string, SkillManifestEntry> = {};
  const dirs = readdirSync(SKILLS_DIR).filter(d =>
    statSync(join(SKILLS_DIR, d)).isDirectory()
  );

  for (const dir of dirs) {
    const skillDir = join(SKILLS_DIR, dir);
    const skillMdPath = join(skillDir, 'SKILL.md');
    if (!existsSync(skillMdPath)) continue;

    const raw = readFileSync(skillMdPath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);

    // Read evals
    const evalsPath = join(skillDir, 'evals', 'evals.json');
    let evalData: SkillEval[] = [];
    let hasFixtures = false;
    if (existsSync(evalsPath)) {
      const evalsRaw = JSON.parse(readFileSync(evalsPath, 'utf-8'));
      evalData = evalsRaw.evals || [];
      hasFixtures = existsSync(join(skillDir, 'evals', 'fixtures'));
    }

    // Read workflows
    const workflowsDir = join(skillDir, 'workflows');
    const workflows = existsSync(workflowsDir)
      ? readdirSync(workflowsDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
      : [];

    const totalAssertions = evalData.reduce((sum, e) => sum + (e.assertions?.length || 0), 0);

    skills[dir] = {
      name: dir,
      command: `/${dir}`,
      description: frontmatter.description || content.match(/^[^#\n].+/m)?.[0]?.trim() || '',
      category: CATEGORY_MAP[dir] || 'Other',
      content,
      frontmatter,
      evalCount: evalData.length,
      assertionCount: totalAssertions,
      hasFixtures,
      evals: evalData.map((e, i) => ({
        name: e.name || `eval-${i + 1}`,
        assertionCount: e.assertions?.length || 0,
        assertions: (e.assertions || []).map(a => a.name),
      })),
      workflows,
      lastModified: statSync(skillMdPath).mtime.toISOString().split('T')[0],
    };
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    skillCount: Object.keys(skills).length,
    skills,
  };

  writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest: ${Object.keys(skills).length} skills → ${OUTPUT}`);
}

generateManifest();
```

**Step 2: Run the script to generate manifest**

Run: `cd /Users/etanheyman/Gits/etanheyman.com && npx tsx scripts/generate-skills-manifest.ts`
Expected: "Generated manifest: ~54 skills → .../skills-manifest.json"

**Step 3: Verify manifest looks correct**

Read the generated `skills-manifest.json` and spot-check a few entries (commit, coach, cmux-agents).

---

### Task 2: Create Skill Detail Page

**Files:**
- Create: `app/(golems)/golems/skills/[name]/page.tsx`

**Step 1: Write the page component**

Server component that:
1. Reads skill from manifest by `name` param
2. Returns `notFound()` if skill doesn't exist
3. Renders: header with trust signals, SKILL.md content via MDXRemote, eval results table, install prompt
4. Uses existing design patterns (dark theme, amber/green accents, CopyButton)

Key sections:
- **Header**: Skill name (as command), category badge, description
- **Trust signals bar**: eval count, assertion count, fixtures badge, last modified date
- **SKILL.md content**: Rendered via MDXRemote with same options as docs pages
- **Eval Results**: Table showing each eval case with assertion count and assertion names
- **Install Prompt**: Copyable block
- **Back link**: Returns to golems page (skills section)

**Step 2: Generate metadata**

```typescript
export async function generateMetadata({ params }) {
  // Read from manifest, return title + description
}
```

**Step 3: Add generateStaticParams**

```typescript
export function generateStaticParams() {
  // Return all skill names from manifest for static generation
}
```

**Step 4: Verify the page renders**

Run: `npm run dev -- -p 3001` (no turbopack)
Visit: `http://localhost:3001/golems/skills/commit`
Expected: Full skill detail page with SKILL.md content, eval badges, install prompt.

---

### Task 3: Link SkillCards to Detail Pages

**Files:**
- Modify: `app/(golems)/golems/components/SkillsShowcase.tsx`

**Step 1: Add Link import and wrap SkillCard**

In `SkillCard` component, wrap the outer div in a `<Link href={`/golems/skills/${skill.name}`}>` so each card navigates to the detail page.

**Step 2: Verify navigation works**

Click a skill card in the SkillsShowcase → should navigate to `/golems/skills/{name}`.

---

### Task 4: Build & Verify

**Step 1: Run build**

Run: `npm run build`
Expected: All skill pages statically generated, no errors.

**Step 2: Verify several pages**

Check at least: `/golems/skills/commit`, `/golems/skills/coach`, `/golems/skills/cmux-agents`
Each should show: rendered SKILL.md, eval results, install prompt, trust signals.

**Step 3: Commit**

```bash
git checkout -b feat/skill-detail-pages
git add scripts/generate-skills-manifest.ts app/(golems)/golems/lib/skills-manifest.json app/(golems)/golems/skills/
git commit -m "feat: add skill detail pages with eval results and install prompts"
```

---

### Task 5: PR via /pr-loop

Use `/pr-loop` to create PR, get review, fix issues, merge.
