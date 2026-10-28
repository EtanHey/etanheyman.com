import { expect, test, type Page } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

// Figma style guide: desktop H2=48 / P=18, mobile H2=26 / P=14.
async function fontSize(page: Page, route: string, selector: string) {
  await installFixtureRoutes(page);
  const response = await page.goto(route, { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  return element.evaluate((el) => getComputedStyle(el).fontSize);
}

test.describe("desktop section headings", () => {
  test.skip(({ isMobile }) => isMobile, "desktop scale only");

  for (const width of [1280, 1440]) {
    test(`home Golems Ecosystem h2 is 48px at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      expect(
        await fontSize(page, "/", 'h2:text-is("Golems Ecosystem")'),
      ).toBe("48px");
    });
  }
});

test.describe("phone intro body copy", () => {
  test.skip(({ isMobile }) => !isMobile, "phone scale only");

  const intros = [
    { route: "/", selector: 'h2:text-is("Golems Ecosystem") + p' },
    { route: "/projects", selector: 'h1:text-is("All Projects") + p' },
    { route: "/projects/brainlayer", selector: "main h1 + p" },
  ];

  for (const { route, selector } of intros) {
    test(`${route} intro paragraph is 14px`, async ({ page }) => {
      expect(await fontSize(page, route, selector)).toBe("14px");
    });
  }

  test("home Golems Ecosystem h2 stays 26px", async ({ page }) => {
    expect(await fontSize(page, "/", 'h2:text-is("Golems Ecosystem")')).toBe(
      "26px",
    );
  });
});
