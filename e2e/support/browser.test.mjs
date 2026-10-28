import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { installFixtureRoutes } from "./browser.ts";

test("fixture routes reject unmapped remote optimizer sources", async () => {
  const previous = process.env.BASE_URL;
  delete process.env.BASE_URL;
  let handler;
  const assets = JSON.parse(readFileSync("e2e/fixtures/assets.json", "utf8"));
  const [saved] = Object.keys(assets);
  try {
    await installFixtureRoutes({
      route: async (_pattern, registered) => { handler = registered; },
    });
    for (const [source, expected] of [
      [saved, "fulfill"],
      ["", "abort"],
      ["https://utfs.io/f/unrecorded-image", "abort"],
      ["//utfs.io/f/unrecorded-image", "abort"],
      ["/\\utfs.io/f/unrecorded-image", "abort"],
      ["/images/portrait.png", "continue"],
    ]) {
      let decision;
      const url = "http://127.0.0.1:45320/_next/image?url=" + encodeURIComponent(source);
      await handler({
        request: () => ({ method: () => "GET", url: () => url }),
        abort: async () => { decision = "abort"; },
        continue: async () => { decision = "continue"; },
        fulfill: async () => { decision = "fulfill"; },
      });
      assert.equal(decision, expected, source);
    }
  } finally {
    if (previous === undefined) delete process.env.BASE_URL;
    else process.env.BASE_URL = previous;
  }
});
