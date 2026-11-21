import { expect, test, type Locator } from "@playwright/test";
import { readFileSync } from "node:fs";
import { installFixtureRoutes } from "./support/browser";

const remoteLogo =
  "https://utfs.io/f/INJgjiKdCVD58uDU9DAIn2T6V3tGJ04IDmEAWcCOu15jfYrX";
const localLogo = "/images/projects/cantaloupe-ai.svg";
const wrongMimeResponse = {
  body: readFileSync("e2e/fixtures/assets/cantaloupe-ai.svg"),
  contentType: "application/octet-stream",
  headers: { "X-Content-Type-Options": "nosniff" },
};

async function expectNoBrokenImages(container: Locator) {
  await expect
    .poll(() =>
      container
        .locator("img:visible")
        .evaluateAll((images) =>
          images
            .filter(
              (image) =>
                image instanceof HTMLImageElement &&
                (!image.complete || image.naturalWidth === 0),
            )
            .map((image) => image.getAttribute("src")),
        ),
    )
    .toEqual([]);
}

test("Cantaloupe card shows a working image despite the remote MIME type", async ({
  page,
}, testInfo) => {
  const width = testInfo.project.name.startsWith("desktop") ? 1440 : 390;
  await page.setViewportSize({ width, height: 900 });
  await installFixtureRoutes(page, testInfo.project.use.baseURL);
  await page.route(remoteLogo, (route) => route.fulfill(wrongMimeResponse));
  await page.goto("/");
  const card = page.locator('#projects a[href="/projects/cantaloupe-ai"]');
  await card.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      card.locator("img").evaluate((image: HTMLImageElement) => image.complete),
    )
    .toBe(true);
  if (process.env.F1_CAPTURE)
    await card.screenshot({
      path: `artifacts/home-project-image/${process.env.F1_CAPTURE}-${width}.png`,
      animations: "disabled",
    });
  await expectNoBrokenImages(card);
  await expect(card.locator("img")).toHaveAttribute("src", localLogo);
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
    await expectNoBrokenImages(card);
    await expect(card.locator("[data-image-fallback]")).toContainText(
      await card.locator("h3").innerText(),
    );
  });
}

test("a remote preview with HTTP 200 and wrong MIME recovers to a name tile", async ({
  page,
}, testInfo) => {
  await installFixtureRoutes(page, testInfo.project.use.baseURL);
  let failures = 0;
  await page.route(
    /INJgjiKdCVD5dgL1oQwBeTRNZszV7OFcQ4t3YqSak2ux59Dr/,
    (route) => {
      failures++;
      return route.fulfill(wrongMimeResponse);
    },
  );
  await page.goto("/");
  const card = page.locator('#projects a[href="/projects/mayart-candles"]');
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => failures).toBeGreaterThan(0);
  await expectNoBrokenImages(card);
  await expect(card.locator("[data-image-fallback]")).toContainText(
    await card.locator("h3").innerText(),
  );
});

test("a viewBox-only SVG remains visible on the project card and sticky nav", async ({
  page,
}, testInfo) => {
  await installFixtureRoutes(page, testInfo.project.use.baseURL);
  // Exercise browsers which report zero intrinsic width for a successfully decoded SVG.
  await page.addInitScript(() => {
    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      "naturalWidth",
    );
    if (!descriptor?.get) throw new Error("naturalWidth getter unavailable");
    const original = descriptor.get;
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      configurable: true,
      get() {
        return this.src.includes("cmuxlayer-logo.svg")
          ? 0
          : original.call(this);
      },
    });
  });
  await page.goto("/projects");
  const card = page
    .locator('a[href="/projects/cmuxlayer"]')
    .filter({ has: page.locator("h3") });
  await card.scrollIntoViewIfNeeded();
  const image = card.locator("img");
  await expect(image).toBeVisible();
  await image.evaluate((image: HTMLImageElement) => image.decode());
  await card.hover();
  await expect(image).toBeVisible();
  await expect(card.locator("[data-image-fallback] span")).toHaveCount(0);
  await page.goto("/projects/cmuxlayer");
  const navLogo = page.locator("nav img").filter({ visible: true });
  await expect(navLogo).toBeVisible();
  await navLogo.evaluate((image: HTMLImageElement) => image.decode());
});

test("Cantaloupe project hero and absolute OpenGraph image use the working logo", async ({
  page,
  request,
}, testInfo) => {
  const width = testInfo.project.name.startsWith("desktop") ? 1440 : 390;
  await page.setViewportSize({ width, height: 900 });
  await installFixtureRoutes(page, testInfo.project.use.baseURL);
  await page.route(remoteLogo, (route) => route.fulfill(wrongMimeResponse));
  await page.goto("/projects/cantaloupe-ai");
  const hero = page.locator("main > section").first();
  const logo = hero.locator("img");
  await expect
    .poll(() => logo.evaluate((image: HTMLImageElement) => image.complete))
    .toBe(true);
  if (process.env.F1_CAPTURE)
    await hero.screenshot({
      path: `artifacts/home-project-image/project-${process.env.F1_CAPTURE}-${width}.png`,
      animations: "disabled",
    });
  await expectNoBrokenImages(hero);
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImage).toMatch(/^https:\/\//);
  expect(ogImage).not.toContain("utfs.io");
  if (!ogImage) throw new Error("Missing OpenGraph image");
  const absoluteImage = new URL(ogImage);
  expect(absoluteImage.pathname).toBe(localLogo);
  // metadataBase is the canonical production host; verify the path on this build.
  const imageResponse = await request.get(
    new URL(absoluteImage.pathname, testInfo.project.use.baseURL).href,
  );
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()["content-type"]).toMatch(/^image\//);
  await testInfo.attach("project-og-image", {
    body: JSON.stringify({
      ogImage,
      checkedURL: imageResponse.url(),
      status: imageResponse.status(),
      contentType: imageResponse.headers()["content-type"],
    }),
    contentType: "application/json",
  });
  // Cantaloupe is not a minisite: its layout intentionally has no project nav.
  await expect(
    page.locator('nav img[alt="Cantaloupe AI - Recruitment Platform logo"]'),
  ).toHaveCount(0);
});
