import { expect, test } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

test("production projects route serves a card with a decoded fixture image", async ({
  page,
}) => {
  await installFixtureRoutes(page);
  const response = await page.goto("/projects", { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  const card = page
    .getByRole("link")
    .and(page.locator('a[href="/projects/cantaloupe-ai"]'))
    .filter({ has: page.getByRole("heading", { level: 3 }) });
  await expect(card).toBeVisible();
  const image = card.locator("img").first();
  await image.scrollIntoViewIfNeeded();
  const intrinsic = await image.evaluate(async (img: HTMLImageElement) => {
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight };
  });
  expect(intrinsic.width).toBeGreaterThan(0);
  expect(intrinsic.height).toBeGreaterThan(0);
});
