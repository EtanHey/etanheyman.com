# Home project image proof

The remote SVG returned HTTP 200 with `application/octet-stream` and `nosniff` on 2026-11-21; the live card used that URL directly. The repository logo is byte-identical to that download and the existing E2E fixture. No database writes were made.

Screenshots render the real Next home page with the public project snapshot at 1440 and 390 CSS pixels. Before captures replay the observed remote headers; after captures serve the repository asset. Diff PNGs show pixel differences.

`e2e/home-project-image.spec.ts` checks the working local asset and HTTP 404 recovery for SVG previews, Next Image raster previews, and fallback logos. Run `npx playwright test e2e/home-project-image.spec.ts`; prefix with `F1_CAPTURE=before` or `F1_CAPTURE=after` to capture the card.

Base `0d27a715`: 8 failures. Fixed code: 8 passes (19.8 s), including pre-hydration SVG failures.
