// Proof capture for the portfolio redesign. Run against scripts/portfolio-preview.ts.
// node docs/portfolio-redesign/capture.mjs <outDir> [routes...]
// Serves committed fixture artwork for remote image URLs (same map as e2e/support/browser.ts)
// and blocks every other off-origin request. Records console errors + horizontal overflow.
import { chromium } from "playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE || "http://127.0.0.1:45320";
const out = process.argv[2];
const routes = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/projects", "/projects/brainlayer", "/about", "/contact"];
const assets = new Map(Object.entries(JSON.parse(readFileSync("e2e/fixtures/assets.json", "utf8"))));
const widths = [
  { w: 1440, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
  { w: 320, h: 640 },
];
mkdirSync(out, { recursive: true });
// Scroll through once so in-view reveals (the /about timeline) render before full-page shots.
async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.6)) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}
const report = [];
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
for (const { w, h } of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    const key = url.pathname === "/_next/image" ? url.searchParams.get("url") || "" : url.pathname;
    const a = assets.get(key) || assets.get(url.href) || assets.get(key.split("#")[0]);
    if (a) return route.fulfill({ body: readFileSync(join("e2e/fixtures", a.file)), contentType: a.contentType });
    if (url.origin === new URL(BASE).origin) return route.continue();
    return route.abort();
  });
  for (const r of routes) {
    const errors = [];
    const onConsole = (m) => m.type() === "error" && errors.push(m.text().slice(0, 160));
    const onErr = (e) => errors.push("pageerror: " + String(e).slice(0, 160));
    page.on("console", onConsole);
    page.on("pageerror", onErr);
    const res = await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await scrollThrough(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "-")) + `-${w}`;
    if (w !== 320 || process.env.ALL320) await page.screenshot({ path: join(out, name + ".png"), fullPage: true });
    report.push({ route: r, width: w, status: res?.status(), overflowPx: overflow, consoleErrors: errors });
    page.off("console", onConsole);
    page.off("pageerror", onErr);
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.map((r) => [r.route, r.width, r.status, r.overflowPx, r.consoleErrors.length])));
