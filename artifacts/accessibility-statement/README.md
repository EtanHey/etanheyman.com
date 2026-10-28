# Accessibility statement proof

Status: implementation verified locally; independent lead review and deployment pending. Do not merge from the worker seat.

Source head: `aabc3363cd6c623c86c66d66f144400bdaa009fb`.
Before runtime: `0d80afd25fbde4daba79338e933d028abb7b199d` portfolio source.
The source manifest records SHA-256 for each changed file. This separate artifacts-only commit does not contain application source.

## Runtime and admission

Apple M4 Max, macOS arm64, MacBook-Pro.local. Captured 29 October 2026, Asia/Jerusalem. The statement's requested last-updated date remains 28 October 2026.

Only the repository's `playwright.config.ts` was used: production Next build/start, GET-only fixture REST on 45319, site on 45320, bundled Chromium Headless Shell 141.0.7390.37 (revision 1194), desktop 1280x800 and mobile 390x844/DPR3, reduced motion, one worker, zero retries. No real backend credentials or data were used.

Ports were free at admission and after completion. Initial admitted load was 10.17 with 1365.81 MB swap free. A later unrelated system-load rise delayed proof; no unrelated process was stopped. Before final capture, load was 6.82 and swap free 1445.81 MB. The wait remained within the 20-minute budget.

## Reviewable images

- [Desktop page before: actual 404](before/page-desktop1280x800.png)
- [Desktop page after](after/page-desktop1280x800.png)
- [390 CSS px page before: actual 404, captured at DPR3](before/page-m390390x844.png)
- [390 CSS px page after, CSS pixel scale](after/page-m390390x844.png)
- [1280 footer before](before/footer-desktop1280x800.png)
- [1280 footer after](after/footer-desktop1280x800.png)
- [Desktop page pixel difference](diffs/page-desktop1280x800.png)
- [390 page pixel difference](diffs/page-m390390x844.png)
- [1280 footer pixel difference](diffs/footer-desktop1280x800.png)
- [Diff measurements](diffs/measurements.json)

Differences compare the old 404 with the new page and show the intended change, not a zero-difference baseline assertion. Images of different heights are padded white at the bottom. The mobile before image is normalized from DPR3 to 390x844 using Lanczos solely for the difference calculation; its original is preserved. Desktop footer differences compare equal 1280x178 canvases.

GIF: none: no animation or interaction changed

## Verification and adverse evidence

- Unit RED: two tests failed before implementation: missing page module and the rendered footer's `/privacy` link.
- [Original fixture RED](logs/e2e-red-original.log): four failures, `/accessibility` returned 404 and footer privacy count was 1, at both widths.
- [Final fixture GREEN](logs/e2e-green.log): four passed. Real production-binary responses, one H1, title, no horizontal overflow, contact navigation, footer removal and working Accessibility link.
- [Vitest](logs/vitest.log): 21 files, 173 tests passed. The mandatory commit hook reran the suite and also passed 173 tests.
- [TypeScript](logs/tsc.log): `npx tsc --noEmit` exited 0 with no diagnostics.
- [Lint](logs/lint.log): exited 0, 0 errors, 29 warnings, all in unchanged files.
- [Local CodeRabbit](logs/coderabbit-local.log): 0 findings across the four files. This ran before the later screenshot-readiness adjustment to the E2E test; it is advisory and does not count as independent review.

The first browser launch failed because pinned revision 1194 was absent. The initial Node 26 installer stalled after downloading; [Node 22 installation](logs/browser-install-node22.log) completed successfully. This is an observed recovery, not a proven diagnosis of the installer stall.

Initial screenshots caught loading shells despite later passing functional assertions. They were rejected. Capture now waits for the rendered H1; screenshots linked above were visually inspected. The before-capture attempt also expected the portfolio 404 heading but the unmatched route actually renders Next's default `404` heading; [that adverse log](logs/e2e-before-capture.log) is preserved. Its automatic failure screenshots show the fully rendered 404 and are the linked page-before images. The final test waits for the visible H1 without assuming its text before asserting status 200.

Optional mobile footer-only locator captures were incomplete and are not presented as proof. The inspected full-page 390 after image includes the complete footer; the contracted standalone before/after footer proof is at 1280.

## Copy evidence and limits

Source scan of `app` and `components` found 15 JSX `<img>`/`<Image>` elements and no missing `alt` attributes. Portfolio route sources contain one H1 each (contact's is visually hidden). The global stylesheet has `prefers-reduced-motion`; the statement deliberately limits that claim to CSS animations. Existing focus and overflow work is present in source and dedicated E2E tests, with this new page's overflow checked at both widths. No full-site, third-party or assistive-technology audit was performed. This proof is local deterministic-fixture evidence; hosted deployment remains unverified.

## Surface sweep

- Entry points — Checked: direct `/accessibility`, footer link from `/projects`, contact link to `/contact`; all passed at both widths.
- Clients — Checked: configured desktop Chromium and mobile Chromium emulation. Native mobile browsers and assistive technologies were not audited; this is a local implementation handoff.
- Providers — N/A: the static statement introduces no backend provider; fixture-backed `/projects` is used only to reach the shared footer.
- Contracts — Checked: Next server route, Metadata title/description/canonical, footer href and one H1; unit tests plus real production runtime.
- Reverse states — Checked: before route 404 and obsolete privacy link, after no privacy link and working route; no new mutable state.
- Connection modes — Checked: local production build against deterministic public fixtures. Hosted deployment is outside this unmerged worker handoff.
- Docs — Checked: statement copy and limitations; no other help or API contract changes.

## Cleanup receipt

RETAINED: T3-managed worktree `/Users/etanheyman/.t3/worktrees/etanheyman.com/t3-f208f2ba`, owner portfolio-polish lead, held for independent review and merge. Source branch and proof branch are preserved remotely. Test servers exited and ports 45319/45320 are free. Persistent scratch `/Users/etanheyman/Gits/etanheyman.com/docs.local/scratch/accessibility-t3-f208f2ba` preserves rejected captures and installer evidence for lead harvest. The worker does not remove or settle its active worktree.
