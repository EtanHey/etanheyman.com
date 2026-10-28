import { expect, test, type Page } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

const routes = ["/", "/projects", "/projects/brainlayer", "/about"];
const coverSelector =
  'div.pointer-events-none.absolute.left-0.h-fit.w-full[aria-hidden="true"]';

async function measure(page: Page, route: string) {
  await installFixtureRoutes(page);
  const response = await page.goto(route, { waitUntil: "load" });
  expect(response?.status()).toBe(200);

  // The bottom cover renders from a client effect once the page is scrollable.
  await page.waitForFunction(
    () =>
      document.body.scrollHeight <= window.innerHeight ||
      document.querySelector(
        "div.pointer-events-none.absolute.bottom-0.left-0.h-fit.w-full",
      ) !== null,
  );

  return page.evaluate((selector) => {
    const root = document.documentElement;
    const clipped = (element: Element) => {
      for (
        let parent = element.parentElement;
        parent && parent !== document.body;
        parent = parent.parentElement
      ) {
        if (getComputedStyle(parent).overflowX !== "visible") return true;
      }
      return false;
    };
    // Elements whose box reaches past the layout width without an ancestor clipping them.
    const offenders = [...document.querySelectorAll("body *")]
      .filter(
        (element) =>
          element.getBoundingClientRect().right + window.scrollX >
            root.clientWidth && !clipped(element),
      )
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: element.getAttribute("class") ?? "",
        right: Math.round(element.getBoundingClientRect().right),
        inCover: element.closest(selector) !== null,
      }));
    return {
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      innerWidth: window.innerWidth,
      offenders,
    };
  }, coverSelector);
}

for (const route of routes) {
  test(`${route} background cover adds no horizontal overflow`, async ({
    page,
  }) => {
    const result = await measure(page, route);
    expect(
      result.offenders.filter((offender) => offender.inCover),
      "background cover elements past the layout width",
    ).toEqual([]);
  });

  test(`${route} has no horizontal document overflow`, async ({ page }) => {
    // AIDEV-NOTE: the about tech-icon grid (rotate-[10deg], xl:-mr-24) is a separate
    // offender from the background glows. Remove this once its own fix lands.
    test.fail(
      route === "/about",
      "about tech-icon grid overflows the layout width",
    );
    const result = await measure(page, route);
    const message = `scrollWidth ${result.scrollWidth}, clientWidth ${result.clientWidth}, innerWidth ${result.innerWidth}; offenders: ${JSON.stringify(result.offenders, null, 2)}`;
    // Mobile emulation widens innerWidth to fit overflowing content, so clientWidth is the real bound.
    expect(result.scrollWidth, message).toBeLessThanOrEqual(result.clientWidth);
    expect(result.scrollWidth, message).toBeLessThanOrEqual(result.innerWidth);
  });
}
