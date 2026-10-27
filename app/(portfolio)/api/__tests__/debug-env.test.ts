import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("debug environment route", () => {
  it("does not expose a route module", () => {
    expect(
      existsSync(new URL("../debug-env/route.ts", import.meta.url)),
    ).toBe(false);
  });
});
