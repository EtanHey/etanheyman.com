/* eslint-disable @typescript-eslint/no-require-imports -- standalone Playwright proof script */
// Run with the site on http://localhost:3100. Captured the proof in ../ for this redesign.
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:800},recordVideo:{dir:'vid',size:{width:1280,height:800}}});
const p=await ctx.newPage();const B='http://localhost:3100';
await p.goto(B+'/golems',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const btn=p.getByRole('button',{name:'Erase the aleph'});await btn.hover();await p.waitForTimeout(400);await btn.click();await p.waitForTimeout(1400);
await p.getByRole('button',{name:'Restore the aleph'}).click();await p.waitForTimeout(1200);
await p.evaluate(()=>document.querySelector('#skills').scrollIntoView({behavior:'smooth'}));await p.waitForTimeout(1200);
for (const g of ['Run agents','Think and write','All']){await p.getByRole('button',{name:g,exact:true}).click();await p.waitForTimeout(900);}
await p.goto(B+'/golems/skills',{waitUntil:'networkidle'});await p.waitForTimeout(600);
await p.getByLabel('Search names and descriptions').pressSequentially('review',{delay:110});await p.waitForTimeout(700);
await p.getByText('No suite yet').click();await p.waitForTimeout(900);
await p.getByRole('button',{name:'Clear filters'}).click();await p.waitForTimeout(700);
await p.goto(B+'/golems/skills/pr-loop',{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.getByRole('tab',{name:'Overview'}).focus();for(let i=0;i<3;i++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(800);}
await p.waitForTimeout(500);await ctx.close();await b.close();})();
