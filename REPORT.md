# Proof: desktop intro paragraphs on the 18px scale (fix/desktop-intro-scale)

- Before: https://www.etanheyman.com/ (production), captured 2026-10-28 19:09–19:10 UTC. That production serves main 69871e4 was not independently verified.
- After: fixture build (`e2e/support/server.ts`) at head c063f33.
- Chromium headless shell (Playwright 1.56.1), reducedMotion=reduce. 1440x900 and 1280x800 @1x; 390x844 @3x, mobile + touch.
- Each screenshot is the viewport from the top to 32px below the intro paragraph.

## Computed intro paragraph (capture-results.json)
| Width | Route | Before (production) | After (head) |
|---|---|---|---|
| 1440 | /projects | 20px / line-height 24px | 18px / 21.6px |
| 1440 | /projects/brainlayer | 17px / 27.625px | 18px / 29.25px |
| 1280 | /projects | 20px / 24px | 18px / 21.6px |
| 1280 | /projects/brainlayer | 17px / 27.625px | 18px / 29.25px |
| 390 | /projects | 14px / 16.8px | 14px / 16.8px |
| 390 | /projects/brainlayer | 14px / 22.75px | 14px / 22.75px |

Line heights are the existing `leading-[1.2]` and `leading-relaxed` (1.625) times the size.

## Diffs (`pixel-diff.txt`, ImageMagick, 5% fuzz)
- Production vs head (`side-by-side-*`, `diff-*`): at 1440 and 1280 the differences start at the paragraph's top row. Everything above it is identical. /projects/brainlayer's description comes from the live database in production and from the fixture snapshot on head, so that diff also includes different text.
- In-situ A/B on the head build (`insitu-*`): the old size is set inline on the paragraph, then removed. This isolates the change on identical content. /projects: 7,201 px, all inside the paragraph box (bbox 1093x21 at y 235). /projects/brainlayer: 35,183 px from y 331 down. The paragraph grows from 248.6px to 263.2px (one more line at 620px width), and the badge row below moves down by that 14.6px.
- 390: /projects is **0 differing pixels** from production. /projects/brainlayer is identical above y≈406 CSS px (the paragraph starts at 400.5). Below that the only difference is the database vs fixture description text. Computed size and line height are the same in both builds.

GIF: none. No animation or interaction changed.
