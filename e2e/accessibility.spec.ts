import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { Locator, Page, TestInfo } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

async function capture(subject: Page | Locator, name: string, info: TestInfo) {
  const directory = process.env.ACCESSIBILITY_PROOF_DIR;
  if (!directory) return;
  await mkdir(directory, { recursive: true });
  await subject.screenshot({
    path: join(directory, `${name}-${info.project.name}.png`),
    animations: "disabled",
    scale: "css",
    ...(name === "page" ? { fullPage: true } : {}),
  });
}

test("accessibility statement resolves with one heading and contact route", async ({
  page,
}, info) => {
  await installFixtureRoutes(page);
  const response = await page.goto("/accessibility", { waitUntil: "load" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await capture(page, "page", info);
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Accessibility statement",
  );
  await expect(page).toHaveTitle("Accessibility statement | Etan Heyman");
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width);
  const contact = page.getByRole("main").getByRole("link", {
    name: "contact page",
  });
  await expect(contact).toHaveAttribute("href", "/contact");
  await contact.click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Contact Etan Heyman",
  );
});

test("footer omits privacy and its accessibility link resolves", async ({
  page,
}, info) => {
  await installFixtureRoutes(page);
  const response = await page.goto("/projects", { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("All Projects");
  await page.evaluate(() => document.fonts.ready);
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await capture(footer, "footer", info);
  await expect(footer.locator('a[href="/privacy"]')).toHaveCount(0);
  const link = footer.getByRole("link", { name: "Accessibility", exact: true });
  await expect(link).toHaveAttribute("href", "/accessibility");
  await link.click();
  await expect(page).toHaveURL(/\/accessibility$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Accessibility statement",
  );
  expect((await page.request.get("/accessibility")).status()).toBe(200);
});
