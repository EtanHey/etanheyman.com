import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import golemsStats from "../golems-stats.json";
import skillsManifest from "../skills-manifest.json";
import { SKILL_CATEGORIES } from "../../components/SkillsShowcase";
import { skillStats } from "../skill-stats";

/**
 * The landing page used to read skill count, "With Evals" and "Eval
 * Coverage" from a hand-maintained golems-stats.json (88 skills / 60% in
 * 2026-10, against 55 published). Skill numbers now come only from the
 * generated skills manifest, and no eval-coverage claim is published.
 */

const APP_DIR = join(__dirname, "../../../..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === "__tests__" ? [] : sourceFiles(full);
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

describe("golems-stats.json", () => {
  it("carries no skill or eval numbers", () => {
    expect(golemsStats).not.toHaveProperty("skills");
    expect(golemsStats).not.toHaveProperty("evals");
  });

  it("no app source reads skill or eval stats from it", () => {
    for (const file of sourceFiles(APP_DIR)) {
      const src = readFileSync(file, "utf-8");
      expect(src, `${file} reads golemsStats.skills/evals`).not.toMatch(
        /golemsStats\.(skills|evals)\b/,
      );
      expect(src, `${file} publishes an eval-coverage claim`).not.toMatch(
        /Eval Coverage|evalCoverage/,
      );
      expect(src, `${file} publishes a pass rate`).not.toMatch(
        /\d+%\s*pass rate|pass rate across/i,
      );
      // Withdrawn March 2026 cmux-agents cross-AI rubric scores.
      expect(src, `${file} publishes withdrawn cross-AI scores`).not.toMatch(
        /Portability Eval|GPT-5\.4/,
      );
    }
  });
});

describe("skillStats", () => {
  it("derives every number from the skills manifest", () => {
    const entries = Object.values(skillsManifest.skills);
    expect(skillStats.count).toBe(skillsManifest.skillCount);
    expect(skillStats.count).toBe(entries.length);
    expect(skillStats.withEvalSuites).toBe(
      entries.filter((s) => s.evalCount > 0).length,
    );
  });

  it("publishes no aggregate assertion count", () => {
    // Written assertions are not run assertions; a total reads as test
    // evidence. golemsLead ruling 2026-10-06: drop it everywhere.
    expect(skillStats).not.toHaveProperty("assertions");
    for (const file of sourceFiles(APP_DIR)) {
      const src = readFileSync(file, "utf-8");
      expect(src, `${file} renders an assertion total`).not.toMatch(
        /skillStats\.assertions|totalAssertions/,
      );
    }
    const showcase = readFileSync(
      join(__dirname, "../../components/SkillsShowcase.tsx"),
      "utf-8",
    );
    expect(showcase, "the /golems showcase renders assertions").not.toMatch(
      /assertion/i,
    );
  });
});

describe("public docs prose", () => {
  it("repeats no stale skill-count or eval-coverage claim", () => {
    const root = join(APP_DIR, "..");
    const docsDir = join(root, "content/golems");
    const files = [
      ...readdirSync(docsDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => join(docsDir, f)),
      join(root, "public/llms.txt"),
    ];
    for (const file of files) {
      const src = readFileSync(file, "utf-8");
      expect(src, `${file} repeats a stale claim`).not.toMatch(
        /eval coverage|\b88 skills|Portability Eval/i,
      );
    }
  });
});

describe("SkillsShowcase", () => {
  it("only lists skills that have a published page", () => {
    const published = Object.keys(skillsManifest.skills);
    const listed = Object.values(SKILL_CATEGORIES).flat();
    expect(listed.length).toBeGreaterThan(0);
    const missing = listed
      .map((s) => s.name)
      .filter((name) => !published.includes(name));
    expect(missing, `showcase links to unpublished skills`).toEqual([]);
  });

  it("has no empty category", () => {
    for (const [category, entries] of Object.entries(SKILL_CATEGORIES)) {
      expect(entries.length, `${category} is empty`).toBeGreaterThan(0);
    }
  });
});
