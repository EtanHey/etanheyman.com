# F-418 round-five capture record

Status: **F418_CAPTURE_DONE**. Capture-only; criteria recorded without assertions or early stops. This is a recording receipt, not merge, deployment or product approval.

Head: **6d0e3209cfc322df6a59b592ade2f51a824ed12a**
PR: https://github.com/EtanHey/etanheyman.com/pull/143
Before: production `https://www.etanheyman.com/`, HTTP 200; base **169f317**, deployment identity provided by the lead. No independent Vercel command was run.
After: fixture `http://127.0.0.1:45320/`, HTTP 200, exact clean head above.
Start UTC: 2026-10-28T13:28:25Z
Capture UTC: 2026-10-28T13:30:08.556Z to 2026-10-28T13:33:09.663Z
End/cleanup UTC: 2026-10-28T13:35:59.620353+00:00
M4 Max only; M1 untouched.

## Main artifacts

| Viewport | Before, production | After, fixture | Before left / after right | Pixel diff |
|---|---|---|---|---|
| 1280×800, DPR1 | [desktop1280x800-before.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-before.png) | [desktop1280x800-after.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-after.png) | [desktop1280x800-side-by-side.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-side-by-side.png) | [desktop1280x800-diff.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-diff.png) |
| 390×844, DPR3, mobile/touch | [m390390x844-before.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/m390390x844-before.png) | [m390390x844-after.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/m390390x844-after.png) | [m390390x844-side-by-side.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/m390390x844-side-by-side.png) | [m390390x844-diff.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/m390390x844-diff.png) |

Mobile comparison at CSS resolution for inspection: [m390390x844-side-by-side-css.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/m390390x844-side-by-side-css.png).

GIFs, encoded using the installed `/opt/homebrew/bin/ffmpeg`, no installs:

- [desktop1280x800-hover.gif](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-hover.gif) — 960×366, 20 frames / 2 s.
- [m390390x844-hover.gif](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/m390390x844-hover.gif) — 390×862, 20 frames / 2 s.
- [desktop1280x800-keyboard-focus.gif](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-keyboard-focus.gif) — after, 960×366, 10 frames / 1 s.
- [desktop1280x800-before-keyboard-focus.gif](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-before-keyboard-focus.gif) — additional production focus comparison, same size/frame count/duration.

GIFs show neutral → card hover → portfolio hover, or name focus → portfolio focus. Contexts use reduced motion, matching repo Playwright options. The GIFs are 10-fps state recordings, not a real-time animation timing benchmark. Raw PNG frames are retained. Source GIF samples were decoded and inspected.

## Desktop keyboard recording — no visibility assertion

Real Tab presses reached the external link at focus entry 15, then the portfolio link immediately at entry 16, on BOTH sources. Before targets the old whole-card anchor; after targets the product-name anchor.

| Target | Source | :focus-visible | Outline style | Width | Color | Offset |
|---|---|---|---|---|---|---|
| External name/card | Production before | true | auto | 0px | oklab(0.708 0 0 / 0.5) | 0px |
| External name | Fixture after | true | auto | 0px | oklab(0.708 0 0 / 0.5) | 0px |
| View in portfolio | Production before | true | auto | 1px | oklab(0.708 0 0 / 0.5) | 1px |
| View in portfolio | Fixture after | true | auto | 1px | oklab(0.708 0 0 / 0.5) | 1px |

Full values, element rectangles, active-element records and complete Tab sequences:

- [desktop1280x800-before-focus.json](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-before-focus.json)
- [desktop1280x800-after-focus.json](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-after-focus.json)

Focused screenshots were saved after persisting the JSON:

| Focus | Before | After | Side-by-side | Diff |
|---|---|---|---|---|
| External | [desktop1280x800-before-focus-name.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-before-focus-name.png) | [desktop1280x800-after-focus-name.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-after-focus-name.png) | [desktop1280x800-focus-name-side-by-side.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-focus-name-side-by-side.png) | [desktop1280x800-focus-name-diff.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-focus-name-diff.png) |
| Portfolio | [desktop1280x800-before-focus-portfolio.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-before-focus-portfolio.png) | [desktop1280x800-after-focus-portfolio.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-after-focus-portfolio.png) | [desktop1280x800-focus-portfolio-side-by-side.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-focus-portfolio-side-by-side.png) | [desktop1280x800-focus-portfolio-diff.png](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/desktop1280x800-focus-portfolio-diff.png) |

**Observed focus result:** screenshots visibly show the native focus ring on BOTH external targets despite computed outline width 0px. The earlier width>0 predicate was therefore insufficient to decide visible focus. `steps.keyboard.visibleName=false` in the raw capture JSON is that computed predicate, not a screenshot verdict; it did not stop this run.

The visible change is ring geometry: before, the ring surrounds the entire 304×239 card; after, it surrounds the 130.922×28 name text box. Both portfolio rings surround the same 129.125×16 link box. No code was changed to obtain these states.

## Checks a, b and d, both viewports — recordings

| Check | Desktop | Mobile/touch |
|---|---|---|
| a. Description/body opens external popup | PASS, mouse click | PASS, real touch tap |
| Popup URL | https://brainlayer.etanheyman.com/ | https://brainlayer.etanheyman.com/ |
| b. Portfolio navigates original tab | PASS, click | PASS, tap |
| Destination | /projects/brainlayer | /projects/brainlayer |
| Additional portfolio popups | 0 | 0 |
| d. Card glow | PASS | PASS with emulated mouse hover |
| Computed glow | rgba(99,102,241,0.25) 0px 0px 40px 0px | same |
| Lift | PASS, translate 0px -4px | none; below md, no lift expected |
| Portfolio hover | true; text alpha 0.7 | true; text alpha 0.7 |
| Fixture pageerrors | 0 | 0 |
| Fixture console errors matching /418\|hydrat\|descendant/ | 0 | 0 |

External popup navigation was fulfilled locally with empty HTTP 200 responses; `interceptedExternal` records one intercepted BrainLayer URL per fixture viewport. No external product request left those contexts. Production was used for public GETs and keyboard Tabs only; no production click/navigation activation.

Production retains the known old hydration error: 2 React #418 pageerrors over its two desktop loads, and 1 over its mobile load. They were recorded without stopping. The accepted round-four RED/GREEN tests were not rerun here.

## Every observed before/after visual difference and capture limit

1. **Neutral desktop: no pixel differences** — 0 / 624,640 pixels, identical 1280×488 section images.
2. **Neutral mobile: no pixel differences** — 0 / 3,025,620 pixels, identical 1170×2586 section images.
3. **External focus: ring moves from the card perimeter to the name perimeter.** 6,921 changed pixels (1.108%); bounding box [157,190,467,435] in the section image. Content/layout outside that first-card focus region is unchanged.
4. **Portfolio focus: visually the same link-ring geometry.** Only 4 pixels differ, in the first-card icon area [188,220,222,221]; maximum channel delta is R=2, G=2, B=3. Cause undetermined; no visible link-ring change observed.
5. **Mobile captures include the same sticky navigation overlay** on both sources, obscuring part of the subtitle/top card region. The mobile hover GIF also includes a small scroll repositioning before the hover state. Those are preserved capture conditions; equality applies to recorded pixels, not occluded content. Computed mobile translate is none, so that recorded scroll shift is not evidence of a mobile hover lift.
6. An initial image-display view appeared to omit text in some focus images. Raw PNG comparisons disprove that as a file/site difference: the complete top 1280×180 heading region is byte-identical across all six desktop neutral/focus PNGs. See [header-pixel-check.json](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/header-pixel-check.json). The apparent display loss is not reported as a product defect.

Pixel counts and bounding boxes: [pixel-comparison.json](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/pixel-comparison.json). All neutral/focus pairs, all four focused screenshots, and GIF sample panels were opened and inspected. Diff PNGs are exact RGB differences; x4 variants aid inspection. No pixel difference was repaired or rerun.

## Execution, load and cleanup

- One `capture.mjs` run: exit **0**, all four source/viewport visits completed, no fatal error. Each recording step stores pass/fail/completed separately. No criterion assertion stopped capture.
- Fixture build/start used unmodified `e2e/support/server.ts`. Browser routing used `installFixtureRoutes`. No wrapper Playwright config, tests or tracked files changed.
- `media.py`: exit **0**, four before/after pairs composited/diffed.
- Four installed ffmpeg encodes: exit **0** each, decoded dimensions/frame counts/durations validated in [gif-results.json](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/gif-results.json).
- All 18 required artifact paths were verified present and readable: [inventory.json](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/inventory.json).
- Before each build/start/capture/media command the same M4 gate sampled load/swap. Total wait **120.011 s**, within 1200 s; all launch gates had load<12 and swap free≥1024 MB. Holds at load 12.40 and 13.74 were respected. Full samples: [load-samples.log](/Users/etanheyman/Gits/orchestrator/docs.local/huddle/2026-10-26/post-huddle/leads/portfolio-polish/f418-proof-m4-r5/load-samples.log).
- One heavy command at a time. No other lane's process was killed, paused or reniced.
- Final head **6d0e3209cfc322df6a59b592ade2f51a824ed12a**, status empty. `lsof -nP -iTCP:45319 -iTCP:45320 -iTCP:45401 -sTCP:LISTEN`: exit **1**, empty stdout/stderr — all own servers stopped; browser closed.
- No tracked-code changes, commit, push, PR comment/edit, merge, Vercel command or install. Media remains local for the lead to attach.

Worktree RETAINED for portfolio-polish lead review. Evidence is outside it. No self-removal/settle. SHA256SUMS covers all evidence files except the manifest itself.

TASK_DONE
