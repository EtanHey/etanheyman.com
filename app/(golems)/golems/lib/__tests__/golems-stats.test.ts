import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import golemsStats from "../golems-stats.json";
import skillsManifest from "../skills-manifest.json";
import { SKILL_CATEGORIES } from "../../components/SkillsShowcase";

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
      // Withdrawn March 2026 cmux-agents cross-AI rubric scores.
      expect(src, `${file} publishes withdrawn cross-AI scores`).not.toMatch(
        /Portability Eval|GPT-5\.4/,
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
