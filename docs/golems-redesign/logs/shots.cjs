/* eslint-disable @typescript-eslint/no-require-imports -- standalone Playwright proof script */
// Run with the site on http://localhost:3100. Captured the proof in ../ for this redesign.
// usage: node shots.js <outDir> [base]
const { chromium } = require('playwright');
const out = process.argv[2]; const base = process.argv[3] || 'http://localhost:3100';
const routes = [['home','/golems'],['skills','/golems/skills'],['skill','/golems/skills/pr-loop'],['docs','/golems/docs/getting-started']];
const widths = [1440, 768, 390];
(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const [name, path] of routes) {
    for (const w of [...widths, 320]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
      page.on('pageerror', e => errors.push('pageerror: ' + e.message.slice(0, 160)));
      const res = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 120000 });
      await page.waitForTimeout(2500);
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight }));
      if (w !== 320) {
        await page.screenshot({ path: `${out}/${name}-${w}-top.png` });
        // full page, capped
        await page.screenshot({ path: `${out}/${name}-${w}-full.png`, fullPage: true });
      }
      report.push({ route: path, width: w, status: res.status(), overflowX: m.sw > m.cw, scrollWidth: m.sw, height: m.h, consoleErrors: errors });
      await ctx.close();
    }
  }
  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})();
