import { describe, it, expect } from "vitest";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { homedir } from "os";
import { execFileSync } from "child_process";
import { tmpdir } from "os";

/**
 * Guards the skills manifest that powers /golems/skills against going stale.
 *
 * The manifest is generated from ~/Gits/golems/skills/golem-powers by
 * scripts/generate-skills-manifest.ts (run via `npm run generate:skills`,
 * wired into `prebuild`). Structural checks always run; parity checks
 * against the live skills directory only run on machines that have the
 * golems repo checked out (i.e. not on Vercel/CI).
 */

const SKILLS_DIR = join(homedir(), "Gits/golems/skills/golem-powers");
const MANIFEST_PATH = join(
  __dirname,
  "../../app/(golems)/golems/lib/skills-manifest.json",
);
const PACKAGE_JSON_PATH = join(__dirname, "../../package.json");

const FRESHNESS_DAYS = 45;

interface ManifestSkill {
  name: string;
  command: string;
  description: string;
  category: string;
}

interface Manifest {
  generatedAt: string;
  skillCount: number;
  skills: Record<string, ManifestSkill>;
}

interface PackageJson {
  scripts?: Record<string, string>;
}

const manifest: Manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
const packageJson: PackageJson = JSON.parse(
  readFileSync(PACKAGE_JSON_PATH, "utf-8"),
);
const skillsDirAvailable = existsSync(SKILLS_DIR);

function liveSkillDirs(): string[] {
  return readdirSync(SKILLS_DIR)
    .filter((d) => {
      const dir = join(SKILLS_DIR, d);
      return statSync(dir).isDirectory() && existsSync(join(dir, "SKILL.md"));
    })
    .sort();
}

describe("skills-manifest.json (structural)", () => {
  it("skillCount matches the number of skill entries", () => {
    expect(manifest.skillCount).toBe(Object.keys(manifest.skills).length);
  });

  it("every entry has a non-empty name", () => {
    for (const [key, skill] of Object.entries(manifest.skills)) {
      expect(skill.name, `manifest entry "${key}" has empty name`).toBeTruthy();
      expect(skill.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty description", () => {
    const missing = Object.entries(manifest.skills)
      .filter(([, s]) => !s.description || s.description.trim().length === 0)
      .map(([key]) => key);
    expect(
      missing,
      `manifest entries with empty description: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every entry has a category", () => {
    for (const [key, skill] of Object.entries(manifest.skills)) {
      expect(
        skill.category,
        `manifest entry "${key}" has empty category`,
      ).toBeTruthy();
    }
  });
});

describe("skills manifest automation", () => {
  it("wires manifest regeneration into the build", () => {
    expect(packageJson.scripts?.["generate:skills"]).toBe(
      "tsx scripts/generate-skills-manifest.ts",
    );
    expect(packageJson.scripts?.prebuild).toContain("generate:skills");
  });
});

describe("generate-skills-manifest.ts", () => {
  it("keeps a skill when evals.json has malformed evals/assertions shapes", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "skills-manifest-"));
    const skillsDir = join(tempDir, "skills");
    const skillDir = join(skillsDir, "malformed-evals");
    const evalsDir = join(skillDir, "evals");
    const outputPath = join(tempDir, "skills-manifest.json");

    mkdirSync(evalsDir, { recursive: true });
    writeFileSync(
      join(skillDir, "SKILL.md"),
      `---\nname: malformed-evals\ndescription: Fixture skill\n---\n\n# Fixture\n`,
    );
    writeFileSync(
      join(evalsDir, "evals.json"),
      JSON.stringify({ evals: { not: "an-array" } }),
    );

    execFileSync("npx", ["tsx", "scripts/generate-skills-manifest.ts"], {
      cwd: join(__dirname, "../.."),
      env: {
        ...process.env,
        SKILLS_MANIFEST_SKILLS_DIR: skillsDir,
        SKILLS_MANIFEST_OUTPUT: outputPath,
      },
      stdio: "pipe",
    });

    const generated: Manifest = JSON.parse(readFileSync(outputPath, "utf-8"));
    expect(generated.skillCount).toBe(1);
    expect(generated.skills["malformed-evals"]).toMatchObject({
      description: "Fixture skill",
      evalCount: 0,
      assertionCount: 0,
      evals: [],
    });
  });

  it("filters malformed assertion entries without skipping the skill", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "skills-manifest-"));
    const skillsDir = join(tempDir, "skills");
    const skillDir = join(skillsDir, "malformed-assertions");
    const evalsDir = join(skillDir, "evals");
    const outputPath = join(tempDir, "skills-manifest.json");

    mkdirSync(evalsDir, { recursive: true });
    writeFileSync(
      join(skillDir, "SKILL.md"),
      `---\nname: malformed-assertions\ndescription: Assertion fixture\n---\n\n# Fixture\n`,
    );
    writeFileSync(
      join(evalsDir, "evals.json"),
      JSON.stringify([
        {
          name: "mixed-assertions",
          assertions: [null, "bad", {}, { name: "" }, { name: "valid" }],
        },
      ]),
    );

    execFileSync("npx", ["tsx", "scripts/generate-skills-manifest.ts"], {
      cwd: join(__dirname, "../.."),
      env: {
        ...process.env,
        SKILLS_MANIFEST_SKILLS_DIR: skillsDir,
        SKILLS_MANIFEST_OUTPUT: outputPath,
      },
      stdio: "pipe",
    });

    const generated: Manifest = JSON.parse(readFileSync(outputPath, "utf-8"));
    expect(generated.skillCount).toBe(1);
    expect(generated.skills["malformed-assertions"]).toMatchObject({
      evalCount: 1,
      assertionCount: 1,
      evals: [
        {
          name: "mixed-assertions",
          assertionCount: 1,
          assertions: ["valid"],
        },
      ],
    });
  });
});

describe.skipIf(!skillsDirAvailable)(
  "skills-manifest.json (parity with live skills dir)",
  () => {
    it("covers every skills/golem-powers dir that has a SKILL.md", () => {
      const live = liveSkillDirs();
      const inManifest = Object.keys(manifest.skills).sort();
      const missing = live.filter((d) => !inManifest.includes(d));
      const extra = inManifest.filter((d) => !live.includes(d));
      expect(
        missing,
        `skills on disk but missing from manifest (rerun: npm run generate:skills): ${missing.join(", ")}`,
      ).toEqual([]);
      expect(
        extra,
        `manifest entries with no matching skill dir on disk: ${extra.join(", ")}`,
      ).toEqual([]);
      expect(manifest.skillCount).toBe(live.length);
    });

    it(`generatedAt is fresh (within ${FRESHNESS_DAYS} days)`, () => {
      const generated = new Date(manifest.generatedAt).getTime();
      expect(Number.isNaN(generated), "generatedAt is not a valid date").toBe(
        false,
      );
      const ageDays = (Date.now() - generated) / (1000 * 60 * 60 * 24);
      expect(
        ageDays,
        `manifest is ${Math.floor(ageDays)} days old (generatedAt: ${manifest.generatedAt}) — rerun: npm run generate:skills`,
      ).toBeLessThan(FRESHNESS_DAYS);
    });
  },
);
