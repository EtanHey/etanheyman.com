/* eslint-disable @typescript-eslint/no-require-imports -- standalone Playwright proof script */
// Run with the site on http://localhost:3100. Captured the proof in ../ for this redesign.
const { chromium } = require('playwright'); const fs=require('fs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
(async()=>{const b=await chromium.launch();
for (const w of [1440,390]) for (const r of ['/golems','/golems/skills','/golems/skills/pr-loop','/golems/skills/eli5','/golems/docs/getting-started','/golems/docs/architecture','/golems/docs/journey','/golems/docs/heritage/ralph']) {
 const p=await b.newPage({viewport:{width:w,height:900}}); await p.goto('http://localhost:3100'+r,{waitUntil:'networkidle',timeout:180000}); await p.waitForTimeout(800);
 await p.addScriptTag({content:axeSrc});
 const v=await p.evaluate(async()=>(await axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21aa','best-practice']})).violations.map(v=>`${v.id}(${v.impact})x${v.nodes.length}: ${v.nodes[0].target.join(' ').slice(0,90)}`));
 console.log(w, r, v.length?v:'0 violations'); await p.close();}
await b.close();})();
