import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/projects";
import snapshot from "@/e2e/fixtures/projects.json";
import { parseClaimCheckedBlurbs } from "@/scripts/portfolio-preview";
import SiteFooter from "../../_components/SiteFooter";
import {
  CLAIM_CHECKED,
  claimStatusOf,
  contextOf,
  evidenceOf,
  getSkillsLedger,
  groupProjects,
  humanizeAssertion,
  shortTitle,
  workGroupOf,
} from "../portfolio-content";

const projects = snapshot.map((p) => ({ ...p, projectJourney: undefined })) as Project[];
const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

describe("claim-check status", () => {
  it("matches the committed claim-checked migrations word for word", () => {
    const sql = [
      "supabase/migrations/20261028_portfolio_blurbs_claim_checked.sql",
      "supabase/migrations/20261029_cmuxlayer_blurb.sql",
    ]
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    const parsed = parseClaimCheckedBlurbs(sql);
    expect([...parsed.keys()].sort()).toEqual(Object.keys(CLAIM_CHECKED).sort());
    for (const [slug, blurb] of parsed)
      expect(CLAIM_CHECKED[slug].shortDescription).toBe(blurb.short_description);
  });

  it("marks a row checked only while its text still matches", () => {
    const brain = bySlug("brainlayer");
    // The historical snapshot still holds the pre-review blurb.
    expect(claimStatusOf(brain).checked).toBe(false);
    const reviewed = { ...brain, shortDescription: CLAIM_CHECKED.brainlayer.shortDescription };
    expect(claimStatusOf(reviewed)).toEqual({ checked: true, date: "October 2026" });
    expect(claimStatusOf({ ...reviewed, shortDescription: reviewed.shortDescription + " Edited." }).checked).toBe(false);
    expect(claimStatusOf(bySlug("hand-sign-detection")).checked).toBe(false);
  });
});

describe("grouping and context", () => {
  it("places every fixture row in a named group and never drops unknown rows", () => {
    const groups = groupProjects(projects);
    expect(groups.reduce((n, g) => n + g.projects.length, 0)).toBe(projects.length);
    expect(groups.find((g) => g.id === "more")).toBeUndefined();
    expect(workGroupOf({ slug: "brand-new" })).toBe("more");
    expect(workGroupOf({ slug: null })).toBe("more");
  });

  it("derives context from the repository owner only", () => {
    expect(contextOf(bySlug("cantaloupe-ai"))).toBe("At Cantaloupe AI");
    expect(contextOf(bySlug("mayart-candles"))).toBe("Client work at Weby");
    expect(contextOf(bySlug("brainlayer"))).toBe("Open source");
    expect(contextOf(bySlug("real-estate-platform"))).toBe("Private repository");
    expect(contextOf(bySlug("casona-diez-diez"))).toBe("Public repository");
  });

  it("strips subtitles from titles", () => {
    expect(shortTitle("BrainLayer — Persistent Memory for AI Agents")).toBe("BrainLayer");
    expect(shortTitle("Cantaloupe AI - Recruitment Platform")).toBe("Cantaloupe AI");
    expect(shortTitle("Casona diez diez")).toBe("Casona diez diez");
  });
});

describe("evidence links", () => {
  it("lists only links a visitor can open", () => {
    expect(evidenceOf(bySlug("brainlayer")).map((l) => l.kind)).toEqual(["case-study", "source", "docs", "live"]);
    expect(evidenceOf(bySlug("real-estate-platform"))).toEqual([]);
    // gvi-mvp has an empty live_url string.
    expect(evidenceOf(bySlug("gvi-mvp")).map((l) => l.kind)).toEqual(["source"]);
    const golemsDocs = evidenceOf(bySlug("golems")).find((l) => l.kind === "docs");
    expect(golemsDocs).toMatchObject({ href: "/golems", external: false });
    expect(evidenceOf(bySlug("hand-sign-detection")).at(-1)?.label).toBe("Model on Hugging Face");
  });
});

describe("skills ledger", () => {
  it("reports eval definitions from the manifest, never results", () => {
    const ledger = getSkillsLedger();
    expect(ledger.total).toBeGreaterThan(0);
    expect(ledger.withEvalSuites).toBeLessThanOrEqual(ledger.total);
    expect(ledger.featured.length).toBeGreaterThan(0);
    for (const skill of ledger.featured) {
      expect(skill.evalCount).toBeGreaterThan(0);
      expect(skill.href).toBe(`/golems/skills/${skill.name}`);
      expect(skill).not.toHaveProperty("passRate");
    }
    expect(humanizeAssertion("does-not-collapse_mixed")).toBe("Does not collapse mixed");
    expect(humanizeAssertion("pr-loop-per-phase")).toBe("PR loop per phase");
  });
});

describe("footer", () => {
  it("offers accessibility and the Golems docs without a dead privacy link", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter));
    expect(html).toContain('href="/accessibility"');
    expect(html).toContain('href="/golems"');
    expect(html).not.toContain('href="/privacy"');
  });
});
