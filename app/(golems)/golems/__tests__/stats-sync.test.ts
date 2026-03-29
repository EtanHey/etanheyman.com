import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("golems stats sync", () => {
  it("keeps the FAQ and llm mirror aligned with the audited golems test counts", () => {
    const root = process.cwd();
    const stats = JSON.parse(
      readFileSync(join(root, "app/(golems)/golems/lib/golems-stats.json"), "utf8"),
    );
    const faq = readFileSync(join(root, "content/golems/faq.md"), "utf8");
    const llm = readFileSync(join(root, "content/golems/llm.md"), "utf8");
    const journey = readFileSync(join(root, "content/golems/journey.md"), "utf8");

    expect(stats.tests.passing).toBe(1179);
    expect(stats.tests.files).toBe(84);
    expect(stats.packages.count).toBe(12);

    expect(faq).toContain("**1,179 tests** across 84 test files.");
    expect(llm).toContain("**1,179 tests** across 84 test files.");

    expect(journey).toContain("1,179 tests across 12 packages");
    expect(journey).toContain("**1,179 pass**");
    expect(journey).toContain("12 packages, 1,179 tests");

    expect(llm).toContain("1,179 tests across 12 packages");
    expect(llm).toContain("**1,179 pass**");
    expect(llm).toContain("12 packages, 1,179 tests");
  });
});
