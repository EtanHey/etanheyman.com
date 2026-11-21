import { expect, test } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`About hydration with motion=${reducedMotion}`, () => {
    test.use({ reducedMotion, contextOptions: { reducedMotion } });

    test("hydrates without page errors or hydration warnings", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          /hydration|hydrated|server rendered|React error #418/i.test(
            message.text(),
          )
        ) {
          errors.push(message.text());
        }
      });
      await installFixtureRoutes(page);
      await page.goto("/about", { waitUntil: "networkidle" });
      await expect(
        page.getByRole("heading", { name: "Etan Heyman", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("heading", { name: "My career journey" })
        .scrollIntoViewIfNeeded();
      await expect(errors).toEqual([]);
    });
  });
}
