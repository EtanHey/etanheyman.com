import { describe, expect, it } from "vitest";
import { flattenNav, getDocsNav } from "../docs-nav";

describe("golems docs nav", () => {
  it("exposes Heritage as a data-driven docs section with Ralph metadata", () => {
    const nav = getDocsNav();
    const heritage = nav.find((item) => item.slug === "heritage");

    expect(heritage?.title).toBe("Heritage");
    expect(heritage?.children?.length).toBeGreaterThanOrEqual(1);

    const ralph = heritage?.children?.find(
      (item) => item.slug === "heritage/ralph",
    );

    expect(ralph).toMatchObject({
      title: "Ralph",
      type: "tool",
      retired: true,
    });
  });

  it("keeps archived docs out of live navigation", () => {
    const slugs = flattenNav(getDocsNav()).map((doc) => doc.slug);

    expect(slugs).not.toContain("_archived/interview-practice");
    expect(slugs).not.toContain("_archived/cloud-worker");
    expect(slugs).not.toContain("_archived/content-pipelines");
    expect(slugs).not.toContain("_archived/golems/job-golem");
    expect(slugs).not.toContain("_archived/golems/recruiter");
  });
});
