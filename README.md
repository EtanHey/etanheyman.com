# Proof artifacts for fix/whatsapp-name-encoding (not for merge)

Captured on the M1 Pro (P3 run 3, 2026-10-28T08:40-08:46Z) in fixture mode
(e2e/support/server.ts + installFixtureRoutes), base 0c7ad06 vs base + the
three-line config change in commit 5071463 (identical bytes, SHA-256 1859df7e...).
Headless Chromium 1194. Desktop 1280x800 DPR1; mobile 390x844 DPR3 touch.

- comparisons/*.png: before (left) vs after (right), SEARCH and MESSAGES tabs.
- before/, after/: raw screenshots.
- after/interaction-*.gif: terminal tab interaction on the fixed source.
