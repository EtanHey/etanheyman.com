# V-OVERFLOW-12 proof (artifacts only, not for merge)

Fix: `overflow-x-clip` on the two background-cover wrappers in
`app/components/navigation/mobileBgCover.tsx` (PR head `dced213`).

## How these were captured

- **Before:** production `https://www.etanheyman.com/`, captured 2026-10-28 ~18:18Z with headless
  Chromium (Playwright 1.56.1). The brief states production serves main `d1ec96c`; that was not
  independently verified.
- **After:** the repo's fixture server (`e2e/support/server.ts`, Next build + start) at `dced213`.
- **In-situ A/B:** the same fixture page at head, captured twice: once as built, and once with
  `overflow-x-clip` removed from the two covers in the DOM. Same build and data, so this is the exact
  pixel comparison for "glow unchanged".
- Viewports: 1440x900 and 1280x800 desktop (DPR 1); 390x844 mobile (isMobile, touch, DPR 3).
  `Math.random` is pinned to 0.5 so the bottom glows' random offsets match between runs.

## Numbers (`measurements-*.json`)

| Viewport | Before (production) scrollWidth / clientWidth | After (head) scrollWidth / clientWidth |
|---|---|---|
| 1440 | 1452 / 1440 | 1440 / 1440 |
| 1280 | 1292 / 1280 | 1280 / 1280 |
| 390 mobile | 402 / 390 (innerWidth 402) | 390 / 390 (innerWidth 390) |

At 390 mobile, a horizontal touch swipe (CDP `synthesizeScrollGesture`, 7 × 40px) moved
`visualViewport.offsetLeft` to **12px before** and kept it at **0px after**; see `swipe-390-before-after.gif`.

## Pixel diffs (`pixel-diff.txt`, ImageMagick `compare -metric AE`)

- In-situ A/B, viewport top and bottom at 1440 and 1280: **0 differing pixels**.
- In-situ A/B, full page over the shared width (base cropped to 1440/1280/390 CSS px): **0 differing
  pixels** at all three widths (`insitu-full-page-diff-*.png`). The before full page is 12 CSS px
  wider; that strip is the overflow itself.
- Production vs fixture (`side-by-side-*.png`, third panel is the diff): differences come from
  fixture data (for example "28 tools" in production vs "44 tools" in the fixture), not the glows.
- 390 bottom frames differ by about 46% in both comparisons. That's a vertical scroll offset: before
  the fix, the mobile layout viewport is 402px wide and therefore taller, so "scroll to bottom"
  stops about 26px higher. The full-page comparison above shows the content is identical.

## Spec (`e2e/horizontal-overflow.spec.ts`, repo `playwright.config.ts`)

- RED at base `d1ec96c` (spec only): 14 failed, 2 passed. The 2 passes are the `/about` document
  checks, which are marked `test.fail` (expected failure).
- GREEN at head `dced213`: 16 passed (16 incl. the 2 `/about` expected failures) across
  desktop1280x800 and m390390x844.

## Remaining offender (not fixed here)

`/about` tech-icon grid (`app/(portfolio)/about/page.tsx:87`, `rotate-[10deg] xl:-mr-24`) still widens
the page: scrollWidth 1522 at 1440, 1441 at 1280, 436 at 390. It's pinned with `test.fail` in the spec
and needs its own PR.
