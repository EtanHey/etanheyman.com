import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import matter from "gray-matter";

const SKILLS_DIR = join(
  process.env.SKILLS_MANIFEST_SKILLS_DIR ||
    join(process.env.HOME || "", "Gits/golems/skills/golem-powers"),
);
const OUTPUT =
  process.env.SKILLS_MANIFEST_OUTPUT ||
  join(import.meta.dirname, "../app/(golems)/golems/lib/skills-manifest.json");

// Legacy hand-curated categories for the original skill set. New skills
// should set `category:` in their SKILL.md frontmatter; anything not
// covered falls back to "Other".
const CATEGORY_MAP: Record<string, string> = {
  commit: "Development",
  "pr-loop": "Development",
  worktrees: "Development",
  "test-plan": "Development",
  lsp: "Development",
  coderabbit: "Development",
  "critique-waves": "Development",
  "cmux-agents": "Operations",
  cmux: "Operations",
  railway: "Operations",
  "1password": "Operations",
  github: "Operations",
  convex: "Operations",
  "golem-install": "Operations",
  brainlayer: "Research & Context",
  research: "Research & Context",
  context7: "Research & Context",
  "github-research": "Research & Context",
  catchup: "Research & Context",
  obsidian: "Research & Context",
  content: "Content & Communication",
  "voice-sessions": "Content & Communication",
  "video-showcase": "Content & Communication",
  "presentation-builder": "Content & Communication",
  "youtube-pipeline": "Content & Communication",
  "never-fabricate": "Quality",
  "large-plan": "Quality",
  archive: "Quality",
  "writing-skills": "Quality",
  skills: "Quality",
  "community-gems": "Research & Context",
  coach: "Domain",
  "interview-practice": "Domain",
  prd: "Domain",
  brave: "Domain",
  "figma-loop": "Domain",
  "cli-agents": "Domain",
};

interface SkillEvalAssertion {
  name: string;
  description: string;
  type?: string;
}

interface SkillEval {
  id: number;
  name?: string;
  prompt: string;
  expected_output: string;
  assertions: SkillEvalAssertion[];
}

/**
 * Files that mark a skill as vendored from somewhere else. A skill that
 * merely got *installed* into golem-powers (third-party, upstream-owned)
 * carries one of these; a skill authored in the golems repo does not.
 */
const PROVENANCE_FILES = ["PROVENANCE.md", "UPSTREAM.md", "ATTRIBUTION.md"];

/**
 * Frontmatter keys that, when present, declare an external origin.
 */
const EXTERNAL_ORIGIN_KEYS = ["upstream", "source_repo", "sourceRepo"];

interface PublishDecision {
  publish: boolean;
  reason?: string;
}

/**
 * The portfolio site publishes a PUBLIC page per manifest entry
 * (/golems/skills and /golems/skills/[name]). Only skills authored in the
 * golems repo may be published — installing a third-party skill must never
 * silently queue a public page for someone else's work.
 *
 * A skill is treated as NOT publishable when:
 *   1. it carries a provenance/attribution file naming an upstream source, or
 *   2. its frontmatter declares an external origin (`upstream:`/`source_repo:`), or
 *   3. it opts out explicitly with `publish: false`.
 */
function publishDecision(
  skillDir: string,
  frontmatter: Record<string, unknown>,
): PublishDecision {
  if (frontmatter.publish === false) {
    return { publish: false, reason: "frontmatter publish: false" };
  }

  for (const key of EXTERNAL_ORIGIN_KEYS) {
    const value = frontmatter[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return { publish: false, reason: `frontmatter ${key}: ${value.trim()}` };
    }
  }

  for (const file of PROVENANCE_FILES) {
    if (existsSync(join(skillDir, file))) {
      return { publish: false, reason: `third-party (${file} present)` };
    }
  }

  return { publish: true };
}

function resolveCategory(
  dir: string,
  frontmatter: Record<string, unknown>,
): string {
  const fmCategory = frontmatter.category;
  if (typeof fmCategory === "string" && fmCategory.trim().length > 0) {
    return fmCategory.trim();
  }
  return CATEGORY_MAP[dir] || "Other";
}

function normalizeEvalData(dir: string, evalsRaw: unknown): SkillEval[] {
  if (Array.isArray(evalsRaw)) {
    return evalsRaw as SkillEval[];
  }

  if (
    evalsRaw &&
    typeof evalsRaw === "object" &&
    Array.isArray((evalsRaw as { evals?: unknown }).evals)
  ) {
    return (evalsRaw as { evals: SkillEval[] }).evals;
  }

  console.warn(
    `[skills-manifest] WARN: ${dir}/evals/evals.json has no evals array — treating as no evals`,
  );
  return [];
}

function assertionNames(evalItem: Partial<SkillEval>): string[] {
  if (!Array.isArray(evalItem.assertions)) {
    return [];
  }

  return evalItem.assertions
    .map((assertion) =>
      assertion &&
      typeof assertion === "object" &&
      typeof assertion.name === "string"
        ? assertion.name
        : "",
    )
    .filter(Boolean);
}

function generateManifest() {
  if (!existsSync(SKILLS_DIR)) {
    console.warn(
      `[skills-manifest] Skills dir not found (${SKILLS_DIR}) — skipping regeneration, keeping committed manifest.`,
    );
    return;
  }

  const skills: Record<string, unknown> = {};
  const skipped: string[] = [];
  const notPublished: string[] = [];
  const dirs = readdirSync(SKILLS_DIR).filter((d) =>
    statSync(join(SKILLS_DIR, d)).isDirectory(),
  );

  for (const dir of dirs) {
    const skillDir = join(SKILLS_DIR, dir);
    const skillMdPath = join(skillDir, "SKILL.md");
    if (!existsSync(skillMdPath)) continue;

    try {
      const raw = readFileSync(skillMdPath, "utf-8");
      let frontmatter: Record<string, unknown> = {};
      let content = raw;
      try {
        const parsed = matter(raw);
        frontmatter = parsed.data;
        content = parsed.content;
      } catch {
        // Malformed YAML frontmatter — strip it manually
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (fmMatch) {
          content = fmMatch[2];
          // Try to extract name/description from the raw YAML lines
          const nameMatch = fmMatch[1].match(/^name:\s*(.+)$/m);
          const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);
          if (nameMatch) frontmatter.name = nameMatch[1].trim();
          if (descMatch) frontmatter.description = descMatch[1].trim();
        }
      }

      // Publish gate: only golems-authored skills get a public page.
      const decision = publishDecision(skillDir, frontmatter);
      if (!decision.publish) {
        notPublished.push(`${dir} (${decision.reason})`);
        continue;
      }

      // Read evals
      const evalsPath = join(skillDir, "evals", "evals.json");
      let evalData: SkillEval[] = [];
      let hasFixtures = false;
      if (existsSync(evalsPath)) {
        try {
          const evalsRaw = JSON.parse(readFileSync(evalsPath, "utf-8"));
          evalData = normalizeEvalData(dir, evalsRaw);
          hasFixtures = existsSync(join(skillDir, "evals", "fixtures"));
        } catch (err) {
          console.warn(
            `[skills-manifest] WARN: ${dir}/evals/evals.json is malformed — treating as no evals (${err instanceof Error ? err.message : err})`,
          );
        }
      }

      // Read workflows
      const workflowsDir = join(skillDir, "workflows");
      const workflows = existsSync(workflowsDir)
        ? readdirSync(workflowsDir)
            .filter((f) => f.endsWith(".md"))
            .map((f) => f.replace(".md", ""))
        : [];

      const totalAssertions = evalData.reduce(
        (sum, e) => sum + assertionNames(e).length,
        0,
      );

      // Extract first non-heading, non-empty line as description fallback
      const descriptionFallback =
        content.match(/^(?!#|\s*$).+/m)?.[0]?.trim() || "";

      skills[dir] = {
        name: dir,
        command: `/${dir}`,
        description: (frontmatter.description as string) || descriptionFallback,
        category: resolveCategory(dir, frontmatter),
        content,
        evalCount: evalData.length,
        assertionCount: totalAssertions,
        hasFixtures,
        evals: evalData.map((e, i) => {
          const namedAssertions = assertionNames(e);
          return {
            name: e.name || `eval-${i + 1}`,
            assertionCount: namedAssertions.length,
            assertions: namedAssertions,
          };
        }),
        workflows,
        lastModified: statSync(skillMdPath).mtime.toISOString().split("T")[0],
      };
    } catch (err) {
      skipped.push(dir);
      console.warn(
        `[skills-manifest] WARN: failed to process ${dir}/SKILL.md — skipping (${err instanceof Error ? err.message : err})`,
      );
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    skillCount: Object.keys(skills).length,
    skills,
  };

  writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log(
    `Generated manifest: ${Object.keys(skills).length} skills → ${OUTPUT}`,
  );
  if (notPublished.length > 0) {
    console.log(
      `[skills-manifest] Not published (not golems-authored / opted out): ${notPublished.join(", ")}`,
    );
  }
  if (skipped.length > 0) {
    console.warn(
      `[skills-manifest] Skipped ${skipped.length} skill(s) due to errors: ${skipped.join(", ")}`,
    );
  }
}

generateManifest();
