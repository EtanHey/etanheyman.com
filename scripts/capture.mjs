// Usage: node capture.mjs <repoRoot> <baseURL> <label> <outDir> [fixture] [toggle]
// toggle: also capture the same page with overflow-x-clip removed from the hero band (in-situ base).
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [repo, base, label, outDir, fixtureArg, toggleArg] = process.argv.slice(2);
const fixture = fixtureArg === "fixture";
const toggle = toggleArg === "toggle";
const require = createRequire(join(repo, "package.json"));
const { chromium } = require("playwright");
const assets = fixture ? JSON.parse(readFileSync(join(repo, "e2e/fixtures/assets.json"), "utf8")) : {};
mkdirSync(outDir, { recursive: true });
for (let i = 0; i < 240; i++) { try { const r = await fetch(base + "/about"); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 1000)); }
const browser = await chromium.launch();
const configs = [
  { name: "1440", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: "1280", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  { name: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
];
const band = "div.self-stretch.overflow-x-clip";
const grid = "div.grid.grid-cols-6";
const results = [];
for (const c of configs) {
  // Each variant gets a fresh context and page load, so one variant's swipe can't leak into the next.
  for (const v of toggle ? ["head", "insitu-base"] : [label]) {
  const ctx = await browser.newContext({ ...c, reducedMotion: "reduce" });
  await ctx.addInitScript(() => { Math.random = () => 0.5; });
  const page = await ctx.newPage();
  if (fixture) await page.route("**/*", async route => {
    const url = new URL(route.request().url());
    const a = assets[url.pathname === "/_next/image" ? url.searchParams.get("url") || "" : url.pathname] || assets[url.href];
    if (a) return route.fulfill({ body: readFileSync(join(repo, "e2e/fixtures", a.file)), contentType: a.contentType });
    if (url.origin === base) return route.continue();
    return route.abort();
  });
  await page.goto(base + "/about", { waitUntil: "load" });
  await page.waitForSelector(grid);
  await page.waitForTimeout(1500);
    if (v === "insitu-base") await page.evaluate(sel => document.querySelector(sel).classList.remove("overflow-x-clip"), band);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const m = await page.evaluate(sel => {
      const r = document.querySelector(sel).parentElement.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
        gridRect: { left: Math.round(r.left), top: Math.round(r.top + scrollY), right: Math.round(r.right), bottom: Math.round(r.bottom + scrollY) },
        bandClass: document.querySelector("div.self-stretch")?.className ?? null,
      };
    }, grid);
    const tag = `${v}-${c.name}`;
    await page.screenshot({ path: join(outDir, `${tag}-top.png`) });
    await page.screenshot({ path: join(outDir, `${tag}-full.png`), fullPage: true });
    // Hero crop: viewport width, grid's rotated box plus 40px above/below.
    const y = Math.max(0, m.gridRect.top - 40);
    await page.screenshot({ path: join(outDir, `${tag}-grid.png`), fullPage: true, clip: { x: 0, y, width: m.clientWidth, height: m.gridRect.bottom + 40 - y } });
    if (c.name === "390") {
      // Scroll the grid into view, then swipe sideways; record how far the page drifts.
      await page.evaluate(t => window.scrollTo(0, Math.max(0, t - 200)), m.gridRect.top);
      await page.waitForTimeout(400);
      const cdp = await ctx.newCDPSession(page);
      const frames = [];
      for (let i = 0; i < 8; i++) {
        const pos = await page.evaluate(() => ({ scrollX: window.scrollX, vvLeft: window.visualViewport?.offsetLeft ?? 0, vvScale: window.visualViewport?.scale ?? 1 }));
        const f = join(outDir, `${tag}-swipe-${i}.png`);
        await page.screenshot({ path: f });
        frames.push({ i, ...pos, file: f });
        await cdp.send("Input.synthesizeScrollGesture", { x: 300, y: 300, xDistance: -40, yDistance: 0, gestureSourceType: "touch", speed: 400 });
        await page.waitForTimeout(250);
      }
      m.swipe = frames;
      await cdp.send("Input.synthesizeScrollGesture", { x: 100, y: 300, xDistance: 400, yDistance: 0, gestureSourceType: "touch", speed: 2000 });
      await page.waitForTimeout(300);
    }
    results.push({ variant: v, config: c.name, ...m });
    console.log(JSON.stringify(results.at(-1)));
  await ctx.close();
  }
}
await browser.close();
writeFileSync(join(outDir, `measurements-${label}.json`), JSON.stringify(results, null, 2));
