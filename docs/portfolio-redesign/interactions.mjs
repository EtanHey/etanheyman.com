// Interaction + accessibility proof for the portfolio redesign.
// node docs/portfolio-redesign/interactions.mjs <outDir>   (preview server on :45320)
// Writes interactions.json and focus/hover/menu screenshots, plus motion videos (webm).
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE || "http://127.0.0.1:45320";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const assets = new Map(Object.entries(JSON.parse(readFileSync("e2e/fixtures/assets.json", "utf8"))));
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const result = {};

async function routeAssets(page) {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const key = url.pathname === "/_next/image" ? url.searchParams.get("url") || "" : url.pathname;
    const a = assets.get(key) || assets.get(url.href) || assets.get(key.split("#")[0]);
    if (a) return route.fulfill({ body: readFileSync(join("e2e/fixtures", a.file)), contentType: a.contentType });
    return url.origin === new URL(BASE).origin ? route.continue() : route.abort();
  });
}
// Wait past globals.css's reduced-motion 0.01ms transition before reading styles.
const describeFocus = async (page) => {
  await page.waitForTimeout(60);
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
      href: el.getAttribute("href"),
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
    };
  });
};

// 1. Keyboard path through the home page at desktop width.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await routeAssets(page);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const stops = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    stops.push(await describeFocus(page));
    if (i === 0) await page.screenshot({ path: join(out, "focus-skip-link-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 160 } });
    if (stops[i]?.text?.startsWith("Golems skills"))
      await page.screenshot({ path: join(out, "focus-plate-1440.png"), clip: { x: 700, y: 220, width: 740, height: 500 } });
  }
  result.keyboardHome1440 = stops;
  // Skip link moves focus to main.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  result.skipLinkTarget = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
  await ctx.close();
}

// Hover state on a plate (pointer: fine): moves with motion allowed, stays put when reduced.
for (const motion of ["no-preference", "reduce"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: motion });
  const page = await ctx.newPage();
  await routeAssets(page);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.hover('.pf-plate:has-text("VoiceLayer")');
  await page.waitForTimeout(400);
  result[`plateHoverTransform_${motion}`] = await page.evaluate(
    () => getComputedStyle(document.querySelectorAll(".pf-plate")[2]).transform,
  );
  if (motion === "no-preference")
    await page.screenshot({ path: join(out, "hover-plate-1440.png"), clip: { x: 700, y: 220, width: 740, height: 500 } });
  await ctx.close();
}

// 2. Mobile menu: open by keyboard, focus trapped, Escape closes and restores focus.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", hasTouch: true });
  const page = await ctx.newPage();
  await routeAssets(page);
  await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[role="dialog"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(out, "menu-open-390.png") });
  const inside = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    inside.push(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
  }
  const current = await page.evaluate(() =>
    [...document.querySelectorAll('[role="dialog"] [aria-current="page"]')].map((a) => a.textContent),
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  result.mobileMenu = {
    dialogOpened: true,
    focusStayedInsideFor8Tabs: inside.every(Boolean),
    ariaCurrentInMenu: current,
    dialogClosedOnEscape: (await page.locator('[role="dialog"]').count()) === 0,
    focusReturnedTo: await describeFocus(page),
  };
  await ctx.close();
}

// 3. Reduced motion: the hero settle animation is opacity-only and the plates do not move.
for (const motion of ["reduce", "no-preference"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: motion });
  const page = await ctx.newPage();
  await routeAssets(page);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  result[`settle_${motion}`] = await page.evaluate(() => {
    const el = document.querySelector(".pf-settle");
    const cs = getComputedStyle(el);
    return { animationName: cs.animationName, animationDuration: cs.animationDuration };
  });
  await ctx.close();
}

// 4. Contrast of the palette pairs actually used (WCAG 2.x relative luminance).
{
  const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = (h) => {
    const [r, g, b] = hex(h).map(lin);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [x, y] = [L(a), L(b)].sort((m, n) => n - m);
    return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
  };
  const pairs = {
    "ice on ink (body text)": ["e7f5fe", "00003f"],
    "sky on ink (secondary text)": ["88cff8", "00003f"],
    "sky on deeper (skills surface)": ["88cff8", "000a55"],
    "ice on deep (plates)": ["e7f5fe", "002072"],
    "sky on deep (plate notes)": ["88cff8", "002072"],
    "white on signal (buttons, band text)": ["ffffff", "0a6acb"],
    "ice on signal (top plate text)": ["e7f5fe", "0a6acb"],
    "ice on ink (band ink button label)": ["e7f5fe", "00003f"],
    "ink button edge on signal (non-text 3:1)": ["00003f", "0a6acb"],
    "old brand blue with white text (for comparison)": ["ffffff", "0f82eb"],
    "marigold on ink (focus ring, non-text 3:1)": ["ffc24b", "00003f"],
    "ink focus ring inside band (non-text 3:1)": ["00003f", "0a6acb"],
  };
  result.contrast = Object.fromEntries(Object.entries(pairs).map(([k, [a, b]]) => [k, ratio(a, b)]));
}

// 5. Motion recordings: hero settle + plate hover at desktop; menu open/close at 390.
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: "no-preference",
    recordVideo: { dir: join(out, "video-desktop"), size: { width: 1280, height: 720 } },
  });
  const page = await ctx.newPage();
  await routeAssets(page);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  for (const name of ["Golems skills", "cmuxLayer", "VoiceLayer", "BrainLayer"]) {
    await page.hover(`.pf-plate:has-text("${name}")`);
    await page.waitForTimeout(450);
  }
  await page.mouse.move(200, 600);
  await page.waitForTimeout(400);
  await page.keyboard.press("Tab");
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(260);
  }
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(900);
  await ctx.close();
}
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
    hasTouch: true,
    recordVideo: { dir: join(out, "video-mobile"), size: { width: 390, height: 844 } },
  });
  const page = await ctx.newPage();
  await routeAssets(page);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Menu" }).click();
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: "Close" }).click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Menu" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("dialog").getByRole("link", { name: "Work" }).click();
  await page.waitForURL("**/projects");
  await page.waitForTimeout(1200);
  await ctx.close();
}

await browser.close();
writeFileSync(join(out, "interactions.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
