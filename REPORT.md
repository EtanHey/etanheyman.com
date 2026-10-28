# /about overflow proof (artifacts only, not for merge)

Fix: the /about hero row is wrapped in a band (`-mx-4.5 self-stretch overflow-x-clip px-4.5
sm:-mx-20 sm:px-20`) in `app/(portfolio)/about/page.tsx`. The band cancels the page padding, so its
edges are the viewport edges, and `overflow-x-clip` trims only the part of the rotated tech-icon
grid that sits past the viewport. PR head `0f8749a`, stacked on #149 (`dced213`).

## How these were captured

- **Before:** production `https://www.etanheyman.com/about`, captured 2026-10-28 ~18:34Z with
  headless Chromium (Playwright 1.56.1) on the M4 Max (gate: 1-min load 8.84, swap free 1321 MB).
  Production is assumed to serve current main; that wasn't independently verified. /about doesn't
  read the database, so production and fixture render the same content.
- **After:** the repo's fixture server (`e2e/support/server.ts`, Next build + start) at `0f8749a`.
- **In-situ A/B:** the same fixture build, captured in two fresh browser contexts: once as built,
  and once with `overflow-x-clip` removed from the band in the DOM after load.
- Viewports: 1440x900 and 1280x800 desktop (DPR 1); 390x844 mobile (isMobile, touch, DPR 3).
  `Math.random` is pinned to 0.5. `*-grid.png` crops the viewport width around the grid's rotated
  box, plus 40px above and below.

## Numbers (`measurements-*.json`)

| Viewport | Before (production) scrollWidth / clientWidth | After (head) scrollWidth / clientWidth |
|---|---|---|
| 1440 | 1522 / 1440 | 1440 / 1440 |
| 1280 | 1441 / 1280 | 1280 / 1280 |
| 390 mobile | 436 / 390 (innerWidth 436) | 390 / 390 (innerWidth 390) |

The grid's rotated bounding box is the same in production, at head and in the in-situ base:
left 579 → right 1522 at 1440, 498 → 1441 at 1280, −64 → 434 at 390 (top/bottom identical too).
Rotation, size and position are unchanged; only the off-screen part is clipped.

At 390 mobile, a horizontal touch swipe (CDP `synthesizeScrollGesture`, 7 × 40px) moved
`visualViewport.offsetLeft` to **45px before** and kept it at **0px after**; see
`swipe-390-before-after.gif`.

## Pixel diffs (`pixel-diff.txt`, ImageMagick `compare`)

Before captures are cropped to the after width (the extra strip is the overflow itself).

- In-situ A/B, grid crop: **0 differing pixels** at 1280; 1440 and 390 differ only at
  sub-visible levels (1440: 0 pixels beyond 1% channel tolerance, PSNR 55.9 dB; 390: 0 pixels
  beyond 5%, PSNR 73.7 dB). In-situ 390 top frame: **0 differing pixels**.
- Production vs head, top and grid frames at all three widths: **0 pixels beyond 5% channel
  tolerance** (PSNR 48.5 to 51.3 dB). The exact-match differences (shown in red in the
  `side-by-side-*` diff panel) are ±1–2 levels of rasterization noise on the rotated icons'
  anti-aliased edges and shadows. The same noise shows up between two in-situ captures of
  one build, so it isn't caused by the clip.
- 390 full page: 64 pixels beyond 5%, in both comparisons. They're in the header logo
  (y ≈ 45 CSS px) and the footer (y ≈ 4465 CSS px), not the grid. Before the fix, the mobile layout
  viewport is 436px wide, and the header and footer are laid out against that width.

## Spec (`e2e/horizontal-overflow.spec.ts`, repo `playwright.config.ts`)

- RED at `dced213` with only the `/about` `test.fail` marker removed: **2 failed, 14 passed**
  (`red-base-summary.txt`). The failures are the `/about` document checks: scrollWidth 1441 vs
  clientWidth 1280 (desktop1280x800) and 436 vs 390 (m390390x844).
- GREEN at head: **16 passed** (`green-head-summary.txt`).
