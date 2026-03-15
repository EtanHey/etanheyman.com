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
  process.env.HOME || "",
  "Gits/golems/skills/golem-powers",
);
const OUTPUT = join(
  import.meta.dirname,
  "../app/(golems)/golems/lib/skills-manifest.json",
);

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

function generateManifest() {
  const skills: Record<string, unknown> = {};
  const dirs = readdirSync(SKILLS_DIR).filter((d) =>
    statSync(join(SKILLS_DIR, d)).isDirectory(),
  );

  for (const dir of dirs) {
    const skillDir = join(SKILLS_DIR, dir);
    const skillMdPath = join(skillDir, "SKILL.md");
    if (!existsSync(skillMdPath)) continue;

    const raw = readFileSync(skillMdPath, "utf-8");
    let frontmatter: Record<string, unknown> = {};
    let content = raw;
    try {
      const parsed = matter(raw);
      frontmatter = parsed.data;
      content = parsed.content;
    } catch {
      // Malformed YAML frontmatter — strip it manually
      const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (fmMatch) {
        content = fmMatch[2];
        // Try to extract name/description from the raw YAML lines
        const nameMatch = fmMatch[1].match(/^name:\s*(.+)$/m);
        const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);
        if (nameMatch) frontmatter.name = nameMatch[1].trim();
        if (descMatch) frontmatter.description = descMatch[1].trim();
      }
    }

    // Read evals
    const evalsPath = join(skillDir, "evals", "evals.json");
    let evalData: SkillEval[] = [];
    let hasFixtures = false;
    if (existsSync(evalsPath)) {
      const evalsRaw = JSON.parse(readFileSync(evalsPath, "utf-8"));
      evalData = evalsRaw.evals || [];
      hasFixtures = existsSync(join(skillDir, "evals", "fixtures"));
    }

    // Read workflows
    const workflowsDir = join(skillDir, "workflows");
    const workflows = existsSync(workflowsDir)
      ? readdirSync(workflowsDir)
          .filter((f) => f.endsWith(".md"))
          .map((f) => f.replace(".md", ""))
      : [];

    const totalAssertions = evalData.reduce(
      (sum, e) => sum + (e.assertions?.length || 0),
      0,
    );

    // Extract first non-heading, non-empty line as description fallback
    const descriptionFallback =
      content.match(/^(?!#|\s*$).+/m)?.[0]?.trim() || "";

    skills[dir] = {
      name: dir,
      command: `/${dir}`,
      description: (frontmatter.description as string) || descriptionFallback,
      category: CATEGORY_MAP[dir] || "Other",
      content,
      evalCount: evalData.length,
      assertionCount: totalAssertions,
      hasFixtures,
      evals: evalData.map((e, i) => ({
        name: e.name || `eval-${i + 1}`,
        assertionCount: e.assertions?.length || 0,
        assertions: (e.assertions || []).map((a) => a.name).filter(Boolean),
      })),
      workflows,
      lastModified: statSync(skillMdPath).mtime.toISOString().split("T")[0],
    };
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
}

generateManifest();
