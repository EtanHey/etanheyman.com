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

  // Exercise a React handler so assertions cannot pass before hydration runs.
  const card = page.locator(".group\\/eco").first();
  await card.dispatchEvent("mouseover");
  await expect(card.locator(":scope > div").first()).not.toHaveCSS(
    "box-shadow",
    "none",
  );
  await expect(
    page.getByRole("heading", { name: "Golems Ecosystem" }),
  ).toBeVisible();

  expect.soft(pageErrors, "uncaught page errors").toEqual([]);
  expect.soft(hydrationErrors, "hydration console errors").toEqual([]);
});
