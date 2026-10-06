import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import EvalStatusPanel, {
  NOT_EVALUATED_LABEL,
} from "../[name]/EvalStatusPanel";

/**
 * Guards /golems/skills against publishing eval numbers that have no real
 * data source behind them. In 2026-10 the site showed 38 seeded-random mock
 * panels and 3 withdrawn March numbers labelled "Opus 4.6" etc. Until
 * provenance-stamped results (model_effective) are wired in, every skill
 * must render the neutral "not evaluated" state and nothing else.
 */

const SKILLS_ROUTE = join(__dirname, "..");
const LIB_DIR = join(__dirname, "../../lib");

const OLD_MODEL_LABELS = ["Opus 4.6", "Sonnet 4.6", "Haiku 4.5"];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === "__tests__" ? [] : sourceFiles(full);
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

describe("EvalStatusPanel", () => {
  it("renders the neutral not-evaluated state with no numbers", () => {
    const html = renderToStaticMarkup(createElement(EvalStatusPanel));
    expect(html).toContain(NOT_EVALUATED_LABEL);
    expect(html).not.toMatch(/\d+(\.\d+)?\s*%/);
    for (const label of OLD_MODEL_LABELS) {
      expect(html).not.toContain(label);
    }
  });
});

describe("skills pages have no eval result source", () => {
  it("the mock/withdrawn eval data modules are gone", () => {
    expect(existsSync(join(LIB_DIR, "eval-data.ts"))).toBe(false);
    expect(existsSync(join(LIB_DIR, "eval-types.ts"))).toBe(false);
    expect(existsSync(join(SKILLS_ROUTE, "[name]/EvalDashboard.tsx"))).toBe(
      false,
    );
  });

  it("skill pages render no assertion counts", () => {
    // Written assertions are not run assertions; next to "Not yet evaluated"
    // a count reads as test evidence (golemsLead ruling, 2026-10-06).
    for (const page of ["page.tsx", "[name]/page.tsx"]) {
      const src = readFileSync(join(SKILLS_ROUTE, page), "utf-8");
      expect(src, `${page} renders assertions`).not.toMatch(/assertion/i);
    }
  });

  it("no skills/lib source renders pass rates, grades or old model labels", () => {
    const files = [...sourceFiles(SKILLS_ROUTE), ...sourceFiles(LIB_DIR)];
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const src = readFileSync(file, "utf-8");
      for (const label of OLD_MODEL_LABELS) {
        expect(src, `${file} contains "${label}"`).not.toContain(label);
      }
      expect(src, `${file} renders a pass rate`).not.toMatch(
        /passRate|bestPassRate|pass rate/i,
      );
      expect(src, `${file} renders a grade`).not.toMatch(/GRADE_MAP/);
      expect(src, `${file} labels data as mock`).not.toMatch(
        /source\s*[:=]+\s*["']mock["']/,
      );
    }
  });
});
