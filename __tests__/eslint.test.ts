import { readFileSync } from "node:fs";
import path from "node:path";
import { ESLint } from "eslint";
import { beforeAll, describe, expect, it, vi } from "vitest";

// Type-aware projectService startup can exceed Vitest's defaults on a loaded host.
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });

let eslint: ESLint;
const fixture = readFileSync(
  path.resolve("__tests__/fixtures/async-auth-guard.ts.txt"),
  "utf8",
);
const route = "app/(portfolio)/api/auth/[...nextauth]/route.ts";

describe("async auth guard lint", () => {
  beforeAll(() => {
    eslint = new ESLint();
  });

  it("rejects floating, voided, and conditional requireOwner promises", async () => {
    const [result] = await eslint.lintText(fixture, { filePath: route });
    expect(
      result.messages
        .filter((message) => message.severity === 2)
        .map((message) => message.ruleId),
    ).toEqual([
      "@typescript-eslint/no-floating-promises",
      "@typescript-eslint/no-floating-promises",
      "@typescript-eslint/no-misused-promises",
    ]);
  });

  it("accepts the same guard calls when awaited", async () => {
    const [result] = await eslint.lintText(
      fixture.replaceAll("requireOwner()", "await requireOwner()"),
      { filePath: route },
    );
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBe(0);
  });

  it.each([
    route,
    "app/(portfolio)/contact/actions.ts",
    "app/(portfolio)/layout.tsx",
    "middleware.ts",
    "lib/auth/require-owner.ts",
    "app/lib/auth.ts",
  ])("enforces both rules as errors in %s", async (filePath) => {
    const config = await eslint.calculateConfigForFile(filePath);
    expect(config.rules["@typescript-eslint/no-floating-promises"]).toEqual([
      2,
      { ignoreVoid: false },
    ]);
    expect(config.rules["@typescript-eslint/no-misused-promises"]).toEqual([2]);
    expect(config.languageOptions.parserOptions.projectService).toBe(true);
  });

  it("does not enable type-aware rules in client components", async () => {
    const config = await eslint.calculateConfigForFile(
      "app/components/example.tsx",
    );
    expect(
      config.rules["@typescript-eslint/no-floating-promises"],
    ).toBeUndefined();
    expect(
      config.rules["@typescript-eslint/no-misused-promises"],
    ).toBeUndefined();
    expect(config.rules["react-hooks/rules-of-hooks"]).toEqual([2]);
  });

  it.each([
    "app/(golems)/golems/docs/[...slug]/page.tsx",
    "app/(golems)/golems/skills/[name]/page.tsx",
  ])("limits the MDX hook warning exception to %s", async (filePath) => {
    const config = await eslint.calculateConfigForFile(filePath);
    expect(config.rules["react-hooks/rules-of-hooks"]).toEqual([1]);
  });
});
