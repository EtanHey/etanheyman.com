// Quick viewport/full-page shots for iteration: node docs/portfolio-redesign/shot.mjs <base> <out> <width> <route...>
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [base, out, width, ...routes] = process.argv.slice(2);
const assets = new Map(Object.entries(JSON.parse(readFileSync("e2e/fixtures/assets.json", "utf8"))));
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
const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const p = await b.newPage({ viewport: { width: +width, height: 900 }, reducedMotion: process.env.MOTION ? "no-preference" : "reduce" });
await p.route("**/*", (route) => {
  const url = new URL(route.request().url());
  const key = url.pathname === "/_next/image" ? url.searchParams.get("url") || "" : url.pathname;
  const a = assets.get(key) || assets.get(url.href) || assets.get(key.split("#")[0]);
  if (a) return route.fulfill({ body: readFileSync(join("e2e/fixtures", a.file)), contentType: a.contentType });
  return url.origin === new URL(base).origin ? route.continue() : route.abort();
});
for (const r of routes) {
  await p.goto(base + r, { waitUntil: "networkidle", timeout: 180000 });
  await p.waitForTimeout(600);
  await scrollThrough(p);
  await p.screenshot({ path: join(out, (r === "/" ? "home" : r.slice(1).replace(/[\/#]/g, "-")) + `-${width}.png`), fullPage: !!process.env.FULL });
}
await b.close();
