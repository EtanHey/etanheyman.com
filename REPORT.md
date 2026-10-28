# Proof: card-wide keyboard focus ring (fix/eco-card-focus-ring)

- Before: https://www.etanheyman.com/ (production), captured 2026-10-28 ~18:58 UTC. Its ecosystem copy ("28 tools", "16 MCP tools") matches main 69871e4; that production serves exactly 69871e4 was not independently verified.
- After: fixture build (`e2e/support/server.ts`) at head 1737ac0.
- Chromium headless shell (Playwright 1.56.1), reducedMotion=reduce. 1280x800 @1x; 390x844 @3x, mobile + touch.
- Screenshots are of the "Golems Ecosystem" section only.

## States
| File stem | What |
|---|---|
| `*-resting` | Page loaded, mouse at 0,0 |
| `*-hover` (1280 only) | Mouse over the BrainLayer card centre for 1.2 s |
| `*-mousedown` | Mouse pressed on the BrainLayer card centre (focuses the link, no `:focus-visible`) |
| `*-focus-name` | Tab pressed until the BrainLayer link is focused (15 presses in both builds) |

## Pixel diffs (ImageMagick `compare -metric AE`, before vs after)
See `pixel-diff.txt`. Resting, hover and mouse-press are identical (0 differing pixels, exact) at 1280 and 390. Only the keyboard-focus frames differ: the name-only ring is gone and the card ring is added.

## Focus state, from capture-results.json
- Before, BrainLayer link focused: link `outline-style: auto` (ring around the name text), `::after` outline none.
- After: link outline none; `::after` outline `solid 2px rgb(255, 255, 255)`, offset -2px, on the overlay that covers the card's padding box.
- Mouse press, both builds: link focused, `:focus-visible` false, no outline anywhere.

`corner-zoom-1280.png` is the after card's top-left corner at 8x: the ring follows the 15px inner radius inside the 1px card border.

GIF: `keyboard-focus-1280-before-after.gif`, six Tab stops through the three cards on production, then the same six on this head (0.9 s per frame).
