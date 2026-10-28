import { expect, test, type Page } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

async function openHome(page: Page) {
  await installFixtureRoutes(page);
  const response = await page.goto("/", { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  const link = page.getByRole("link", { name: "BrainLayer", exact: true });
  const card = link.locator(
    'xpath=ancestor::div[contains(concat(" ", @class, " "), " rounded-2xl ")][1]',
  );
  await card.scrollIntoViewIfNeeded();
  return { link, card };
}

// Reads the card's edge midpoints, 2px inside the border box (past the 1px border).
async function edgePixels(page: Page, png: Buffer) {
  const scratch = await page.context().newPage();
  try {
    return await scratch.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { width: w, height: h } = img;
      const at = (x: number, y: number) =>
        Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 3));
      const mx = Math.floor(w / 2);
      const my = Math.floor(h / 2);
      return {
        top: at(mx, 2),
        bottom: at(mx, h - 3),
        left: at(2, my),
        right: at(w - 3, my),
      };
    }, png.toString("base64"));
  } finally {
    await scratch.close();
  }
}

const isBright = (rgb: number[]) => rgb.every((channel) => channel >= 200);

test("keyboard focus on an ecosystem card outlines the whole card", async ({
  page,
}) => {
  const { link, card } = await openHome(page);

  const resting = await edgePixels(
    page,
    await card.screenshot({ scale: "css" }),
  );
  for (const [edge, rgb] of Object.entries(resting))
    expect(isBright(rgb), `resting ${edge} edge ${rgb}`).toBe(false);

  for (let presses = 0; presses < 60; presses++) {
    if (await link.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(link).toBeFocused();
  expect(await link.evaluate((el) => el.matches(":focus-visible"))).toBe(true);

  const focused = await edgePixels(
    page,
    await card.screenshot({ scale: "css" }),
  );
  for (const [edge, rgb] of Object.entries(focused))
    expect(isBright(rgb), `focused ${edge} edge ${rgb}`).toBe(true);

  // The ring belongs to the card overlay, not the name text.
  const geometry = await link.evaluate((el: HTMLElement) => {
    const card = el.closest(".rounded-2xl") as HTMLElement;
    const after = getComputedStyle(el, "::after");
    const border = getComputedStyle(card);
    const rect = card.getBoundingClientRect();
    return {
      linkOutline: getComputedStyle(el).outlineStyle,
      containedByCard: el.offsetParent === card,
      overlay: [parseFloat(after.width), parseFloat(after.height)],
      cardPaddingBox: [
        rect.width -
          parseFloat(border.borderLeftWidth) -
          parseFloat(border.borderRightWidth),
        rect.height -
          parseFloat(border.borderTopWidth) -
          parseFloat(border.borderBottomWidth),
      ],
    };
  });
  expect(geometry.linkOutline).toBe("none");
  expect(geometry.containedByCard).toBe(true);
  geometry.overlay.forEach((size, i) =>
    expect(size).toBeCloseTo(geometry.cardPaddingBox[i], 1),
  );
});

test("mouse press on an ecosystem card shows no focus ring", async ({
  page,
}) => {
  const { link, card } = await openHome(page);
  const box = (await card.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(link).toBeFocused();
  expect(await link.evaluate((el) => el.matches(":focus-visible"))).toBe(false);
  expect(
    await link.evaluate((el) => getComputedStyle(el, "::after").outlineStyle),
  ).toBe("none");
});
