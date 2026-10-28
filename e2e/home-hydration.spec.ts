import { expect, test } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

test("home hydrates without page errors or hydration console errors", async ({
  page,
  isMobile,
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
  await expect(
    page.locator("div.pointer-events-none.absolute.bottom-0.left-0.h-fit.w-full"),
  ).toBeAttached();

  // A real discrete interaction exercises attached handlers on both input types.
  const navigation = page.getByRole("navigation");
  const menuButton = navigation.getByRole("button");
  if (isMobile) await menuButton.tap();
  else await menuButton.click();
  const projectsLink = navigation.getByRole("link", {
    name: "Projects",
    exact: true,
  });
  await expect(projectsLink).toBeVisible();
  await expect(projectsLink.locator("../..")).toHaveCSS("opacity", "1");
  await expect(
    page.getByRole("heading", { name: "Golems Ecosystem" }),
  ).toBeVisible();

  expect.soft(pageErrors, "uncaught page errors").toEqual([]);
  expect.soft(hydrationErrors, "hydration console errors").toEqual([]);
});
