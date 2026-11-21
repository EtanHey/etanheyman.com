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
      const response = await page.goto("/about", { waitUntil: "networkidle" });
      if (!response) throw new Error("About navigation returned no response");
      await expect(
        page.getByRole("heading", { name: "Etan Heyman", exact: true }),
      ).toBeVisible();
      const entrance = page.locator(
        "#career-section ol li:last-child > div > div:nth-child(2)",
      );
      if (reducedMotion === "no-preference") {
        // The last card is below the viewport: preserve its slide/tilt start.
        expect
          .soft(await entrance.evaluate((el) => getComputedStyle(el).transform))
          .not.toBe("none");
        expect
          .soft((await response.text()).match(/translateY\(30px\)/g))
          .toHaveLength(9);
      } else {
        await entrance.scrollIntoViewIfNeeded();
        await expect(entrance).toHaveCSS("opacity", "1");
        await expect(entrance).toHaveCSS("transform", "none");
      }
      await expect(errors).toEqual([]);
    });
  });
}
