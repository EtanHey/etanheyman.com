# V-H2-48 + V-BODY-14 typography proof (artifacts only, not for merge)

Code: branch `fix/typography-h2-body`, commit `f30335c` on base `1b06e1d` (main).
Host: M4 Max (MacBook-Pro.local). Load gate checked before each heavy step (1-min load 5.3–11.7, swap free ≥ 1313 MB).

## Elements identified (computed style, before → after)

Inventory: every visible `h1, h2, p` outside header/nav/footer on `/`, `/projects`, `/projects/brainlayer`, `/about`, `/contact` at 1440, 1280 and 390 (`before-production-inventory.json`, `after-fixture-inventory.json`).
The only 42px element is the home "Golems Ecosystem" H2. The only 15px body paragraphs at 390 are the three intros below. The other 15px `p` nodes at 390 are the numeric stat values ("0") inside project cards, which are labels, not body copy. They are left alone.

| Element | Source | 1440 | 1280 | 390 |
|---|---|---|---|---|
| Home "Golems Ecosystem" H2 | `app/components/GolemsEcosystem.tsx` | 42/42 → **48/48** | 42/42 → **48/48** | 26/26 → 26/26 (unchanged) |
| Home Golems intro `p` | same file | 18/23.4 → 18/23.4 | 18/23.4 → 18/23.4 | 15/19.5 → **14/18.2** |
| /projects intro `p` | `app/(portfolio)/projects/page.tsx` | 20/24 → 20/24 | 20/24 → 20/24 | 15/18 → **14/16.8** |
| Project detail intro `p` | `app/(portfolio)/projects/[slug]/page.tsx` | 17/27.625 → 17/27.625 | 17/27.625 → 17/27.625 | 15/24.375 → **14/22.75** |

Values are font-size/line-height in px. The H2 now uses the same responsive ladder as the homepage CTA H2 ("Let's build something."), which already reached `xl:text-[48px]`. Nutmeg is unchanged.

## Tests
- RED at base: `red-base-summary.txt`, 5 failed (42≠48 ×2, 15≠14 ×3), 1 passed (mobile H2 stays 26), 6 skipped (other project).
- GREEN at head: `green-head-summary.txt`, 6 passed, 6 skipped.

## Screenshots
- `shots/<id>-<vp>-before.png`: production www.etanheyman.com, captured 2026-10-28 18:09 UTC.
- `shots/<id>-<vp>-base.png`: fixture mode at base `1b06e1d` (same data as after).
- `shots/<id>-<vp>-after.png`: fixture mode at head.
- `sbs/`: production before vs fixture after. Desktop pairs are stacked and 390 pairs sit side by side.
- `sbs-fixture/`: fixture base vs fixture head, using the same data.
- `diff/`: pixel diff of fixture base vs fixture head; counts are in `diff-summary.txt`.

Production BrainLayer copy differs from the fixture snapshot, so for the detail intro `sbs-fixture/` and `diff/` give the same-data comparison.

## Wrapping, line length, overflow
- Desktop /projects and detail intros: 0 changed pixels at 1440 and 1280, so there are no desktop side effects.
- Home H2 at 48px stays on one line at 1280 (960px column) and 1440 (1120px column).
- Home intro at 390: still 3 lines. The 15px break "multi-/agent" becomes a clean "multi-agent" at 14px.
- /projects intro at 390: still 3 lines. Detail intro at 390: 13 lines, the same as base in fixture.
- `scrollWidth` is identical before and after (402 at 390, 1292 at 1280, 1452 at 1440). The +12px is the pre-existing V-OVERFLOW-12 defect, which this change does not touch or worsen.

GIF: none. No animation or interaction changed.
