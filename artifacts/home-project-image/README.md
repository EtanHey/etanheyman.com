# Project image proof

The remote SVG returned HTTP 200 with `application/octet-stream` and `nosniff` on 2026-11-21. The repository logo is byte-identical to the download and existing E2E fixture. No database writes were made.

Screenshots render the real Next production build against the public project snapshot at 1440 and 390 CSS pixels. Before captures replay the observed remote headers; after captures serve the repository asset. `project-*` files capture the Cantaloupe project hero; other PNGs capture its home card. Diff PNGs show pixel differences.

Guard: `npx playwright test e2e/home-project-image.spec.ts`. Prefix with `F1_CAPTURE=before` or `F1_CAPTURE=after` to capture both surfaces.

Exact base `0d27a715`: 12 visible-image failures and 2 valid-SVG controls passed. Fixed code: 14 cases passed, including 404 previews/logos, HTTP 200 wrong-MIME recovery, pre-hydration failures, viewBox-only SVG retention through hover with zero intrinsic width simulated, project hero and absolute OpenGraph image.

`project-og.json` records the rendered canonical OG URL and its corresponding 200 `image/svg+xml` response on the running PR build. Cantaloupe has no minisite configuration and no project nav; the existing cmuxlayer nav supplies the valid-SVG check.
