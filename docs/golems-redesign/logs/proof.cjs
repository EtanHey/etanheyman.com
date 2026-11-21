/* eslint-disable @typescript-eslint/no-require-imports -- standalone Playwright proof script */
// Run with the site on http://localhost:3100. Captured the proof in ../ for this redesign.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2]; const B = 'http://localhost:3100';
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const log = (...a) => console.log(...a);
async function axe(page, label) {
  await page.addScriptTag({ content: axeSrc });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
    return res.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes.slice(0, 2).map(n => n.target.join(' ')) }));
  });
  log('AXE', label, JSON.stringify(r));
}
(async () => {
  const b = await chromium.launch();
  // 1. keyboard on landing
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  let p = await ctx.newPage();
  await p.goto(B + '/golems', { waitUntil: 'networkidle' });
  await p.keyboard.press('Tab');
  log('TAB1 focused:', await p.evaluate(() => document.activeElement.textContent.trim()));
  await p.screenshot({ path: `${OUT}/kbd-skip-link-1440.png`, clip: { x: 0, y: 0, width: 700, height: 140 } });
  const seq = [];
  for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => { const e = document.activeElement; return (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 40); })); }
  log('TAB order:', JSON.stringify(seq));
  // focus on Get started
  await p.focus('text=Get started');
  await p.screenshot({ path: `${OUT}/kbd-focus-cta-1440.png`, clip: { x: 100, y: 380, width: 700, height: 200 } });
  const emet = p.getByRole('button', { name: 'Erase the aleph' });
  await emet.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(600);
  log('EMET pressed:', await p.getByRole('button', { name: 'Restore the aleph' }).getAttribute('aria-pressed'));
  await p.screenshot({ path: `${OUT}/emet-erased-1440.png`, clip: { x: 760, y: 60, width: 620, height: 520 } });
  await axe(p, '/golems');
  // landing tabs
  await p.getByRole('button', { name: 'Think and write' }).click();
  log('SHOWCASE rows after filter:', await p.locator('table tbody tr').count());
  await p.locator('#skills').screenshot({ path: `${OUT}/showcase-filter-think-1440.png` });
  await ctx.close();

  // 2. skills ledger filters
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); p = await ctx.newPage();
  await p.goto(B + '/golems/skills', { waitUntil: 'networkidle' });
  await p.getByLabel('Search names and descriptions').fill('review');
  log('LEDGER "review":', await p.locator('p[aria-live]').first().innerText());
  await p.getByText('No suite yet').click();
  log('LEDGER review+none:', await p.locator('p[aria-live]').first().innerText());
  await p.getByLabel('Search names and descriptions').fill('zzzz');
  await p.screenshot({ path: `${OUT}/ledger-empty-state-1440.png`, clip: { x: 0, y: 380, width: 1440, height: 420 } });
  await p.getByRole('button', { name: 'Clear filters' }).click();
  log('LEDGER cleared:', await p.locator('p[aria-live]').first().innerText());
  await p.getByLabel('Category').selectOption('Quality');
  log('LEDGER Quality:', await p.locator('p[aria-live]').first().innerText());
  await axe(p, '/golems/skills');
  await ctx.close();

  // 3. skill tabs keyboard
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); p = await ctx.newPage();
  await p.goto(B + '/golems/skills/pr-loop', { waitUntil: 'networkidle' });
  await p.getByRole('tab', { name: 'Overview' }).focus();
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
  log('TABS after 2x ArrowRight selected:', await p.locator('[role=tab][aria-selected=true]').innerText(), 'focused:', await p.evaluate(() => document.activeElement.textContent));
  await p.keyboard.press('End');
  log('TABS End:', await p.locator('[role=tab][aria-selected=true]').innerText());
  await p.getByRole('tab', { name: 'Eval status' }).click();
  await p.screenshot({ path: `${OUT}/skill-eval-tab-1440.png`, fullPage: false });
  await axe(p, '/golems/skills/pr-loop');
  await ctx.close();

  // 4. docs axe + mobile menu
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); p = await ctx.newPage();
  await p.goto(B + '/golems/docs/getting-started', { waitUntil: 'networkidle' });
  await axe(p, '/golems/docs/getting-started');
  await ctx.close();
  ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); p = await ctx.newPage();
  await p.goto(B + '/golems/docs/getting-started', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: 'Open navigation' }).click();
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${OUT}/mobile-menu-docs-390.png` });
  log('MENU open expanded:', await p.getByRole('button', { name: 'Close navigation' }).first().getAttribute('aria-expanded'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  log('MENU after Escape visible:', await p.locator('#mobile-nav').count());
  await ctx.close();

  // 5. reduced motion
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); p = await ctx.newPage();
  await p.goto(B + '/golems', { waitUntil: 'networkidle' });
  const rm = await p.evaluate(() => { const a = document.querySelector('.g-aleph'); const h = document.querySelector('.g-rise'); return { alephTransition: getComputedStyle(a).transitionProperty + ' ' + getComputedStyle(a).transitionDuration, alephClip: getComputedStyle(a).clipPath, riseDuration: getComputedStyle(h).animationDuration }; });
  log('REDUCED MOTION before:', JSON.stringify(rm));
  await p.getByRole('button', { name: 'Erase the aleph' }).click(); await p.waitForTimeout(400);
  log('REDUCED MOTION erased:', JSON.stringify(await p.evaluate(() => { const a = document.querySelector('.g-aleph'); return { opacity: getComputedStyle(a).opacity, clip: getComputedStyle(a).clipPath }; })));
  await p.screenshot({ path: `${OUT}/reduced-motion-erased-1440.png`, clip: { x: 760, y: 60, width: 620, height: 520 } });
  await ctx.close();
  await b.close();
})();
