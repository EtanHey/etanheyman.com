import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { installFixtureRoutes } from "./support/browser";

const remoteLogo =
  "https://utfs.io/f/INJgjiKdCVD58uDU9DAIn2T6V3tGJ04IDmEAWcCOu15jfYrX";

test("Cantaloupe uses a working repository image despite the remote MIME type", async ({
  page,
}, testInfo) => {
  const width = testInfo.project.name.startsWith("desktop") ? 1440 : 390;
  await page.setViewportSize({ width, height: 900 });
  await installFixtureRoutes(page, testInfo.project.use.baseURL);
  // Real remote response: SVG bytes, but application/octet-stream + nosniff.
  await page.route(remoteLogo, (route) =>
    route.fulfill({
      body: readFileSync("e2e/fixtures/assets/cantaloupe-ai.svg"),
      contentType: "application/octet-stream",
      headers: { "X-Content-Type-Options": "nosniff" },
    }),
  );
  await page.goto("/");
  const card = page.locator('#projects a[href="/projects/cantaloupe-ai"]');
  await card.scrollIntoViewIfNeeded();
  const image = card.locator("img");
  await expect(image).toBeAttached();
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.complete))
    .toBe(true);
  if (process.env.F1_CAPTURE) {
    await card.screenshot({
      path: `artifacts/home-project-image/${process.env.F1_CAPTURE}-${width}.png`,
      animations: "disabled",
    });
  }
  await expect(image).toHaveAttribute(
    "src",
    "/images/projects/cantaloupe-ai.svg",
  );
  expect(
    await image.evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
});

for (const { slug, pattern } of [
  {
    slug: "cantaloupe-ai",
    pattern:
      /cantaloupe-ai\.svg|INJgjiKdCVD58uDU9DAIn2T6V3tGJ04IDmEAWcCOu15jfYrX/,
  },
  {
    slug: "mayart-candles",
    pattern: /INJgjiKdCVD5dgL1oQwBeTRNZszV7OFcQ4t3YqSak2ux59Dr/,
  },
  { slug: "brainlayer", pattern: /\/logos\/brainlayer\.svg/ },
]) {
  test(`${slug}: a 404 image becomes a name tile with no broken images`, async ({
    page,
  }, testInfo) => {
    await installFixtureRoutes(page, testInfo.project.use.baseURL);
    let failures = 0;
    await page.route(pattern, (route) => {
      failures++;
      return route.fulfill({
        status: 404,
        contentType: "text/plain",
        body: "Not found",
      });
    });
    await page.goto("/");
    const card = page.locator(`#projects a[href="/projects/${slug}"]`);
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => failures).toBeGreaterThan(0);
    await expect(card.locator("[data-image-fallback]")).toBeVisible();
    await expect(card.locator("[data-image-fallback]")).toContainText(
      await card.locator("h3").innerText(),
    );
    for (const image of await card.locator("img:visible").all()) {
      expect(
        await image.evaluate((img: HTMLImageElement) => img.naturalWidth),
      ).toBeGreaterThan(0);
    }
  });
}
