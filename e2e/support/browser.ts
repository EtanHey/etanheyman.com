import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import assets from "../fixtures/assets.json";

const assetMap = new Map(Object.entries(assets));

export async function installFixtureRoutes(page: Page) {
  await page.route("**/*", async (route) => {
    if (route.request().method() !== "GET") return route.abort();
    if (process.env.BASE_URL) return route.continue();
    const url = new URL(route.request().url());
    const asset =
      assetMap.get(
        url.pathname === "/_next/image"
          ? url.searchParams.get("url") || ""
          : url.pathname,
      ) || assetMap.get(url.href);
    if (asset)
      return route.fulfill({
        body: readFileSync(join("e2e/fixtures", asset.file)),
        contentType: asset.contentType,
      });
    if (url.origin === "http://127.0.0.1:45320") return route.continue();
    return route.abort();
  });
}
