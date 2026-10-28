import { expect, test } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

test("home hydrates without page errors or hydration console errors", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  const hydrationErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /418|hydrat|cannot be a descendant/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await installFixtureRoutes(page);
  const response = await page.goto("/", { waitUntil: "load" });
  expect(response?.status()).toBe(200);

  // This cover only renders after its client effect detects the scrollable page.
  // Effects run after hydration commits, so any hydration error has been reported by now.
  await expect(
    page.locator("div.pointer-events-none.absolute.bottom-0.left-0.h-fit.w-full"),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", { name: "Golems Ecosystem" }),
  ).toBeVisible();

  expect.soft(pageErrors, "uncaught page errors").toEqual([]);
  expect.soft(hydrationErrors, "hydration console errors").toEqual([]);
});
