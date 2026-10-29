# Production audit — source preparation

Status: SOURCE_READY_RUNTIME_NOT_RUN. This independent slice depends on PR136's
`@playwright/test` 1.56.1 integration; the prepared main base does not include it.
No install, build, browser, test, discovery, lint, hook or remote action was run.
PR136's fixture smoke/config/source remain untouched. The production config has
no web server, fixture imports, interception, browser channel or executable override.
The dedicated config selects `production-audit.prod.ts`; the fixture suite's
`**/*.spec.ts` match excludes it. The spec also rejects fixture/local base URLs
before navigating. Actual discovery isolation remains to be verified after
PR136 dependency integration.

## Future execution (lead schedules after dependency/capacity clearance)

```sh
PROD_BASE_URL=https://etanheyman.com npx playwright test --config playwright.production.config.ts
```

Only that exact origin or `https://www.etanheyman.com` is accepted; do not add a
trailing slash, credentials, port, path, query or fragment. No default exists.
Use the integrated dependency and already provisioned bundled headless Chromium.
The config does not download browsers. One worker, zero retries, 30s per test,
10s navigation, 5s landmark expectations, 3s scroll/decode bounds; preserve failures.

Five routes (`/`, `/projects`, `/projects/brainlayer`, `/golems/docs`, and
`/golems/docs/architecture`) run at desktop 1280×800 and mobile 390×844/DPR3/touch.
Readiness means load, visible main and route landmark, then real image scrolling
and decoding. Portfolio landmarks are their named H1s; docs require a visible
article; architecture additionally requires an accessible visible H1.
No network-idle waits, sleeps, retry loops, forms, credentials or content edits.

Each invocation uses a timestamp+UUID directory under `docs.local/production-audit/`,
with one internal run ID inherited by Playwright children. Do not export or reuse
`PORTFOLIO_AUDIT_RUN_ID` between CLI invocations; a fresh invocation generates a new
ID so it does not clear the earlier run. Runner/worker artifact alignment still
requires execution verification. Each test writes and attaches
`production-audit.json` under that run’s `results`; the HTML report is under its
sibling `report` directory. `test.afterEach` collects the still-live page and
writes evidence before fixture teardown, including after a test-body timeout. Failures retain screenshots/traces. JSON includes raw console,
page and resource errors, document headers actually exposed, CSP instrumentation
and events, headings, images, target/device/timestamps and collection failures.
The final HTTP200 document must have an enforced CSP response header.
Enforced and report-only CSP headers/events are separate evidence; unavailable
document/instrumentation evidence fails and never becomes a zero-violation pass.
SVG images and data/possible placeholders still decode and require natural sizes;
hidden images are inventoried without loading them. Inline SVGs are counted, not
decoded; Mermaid count is diagnostic, with no historical count assertion.

This is a bounded observation, not proof that deferred/interactivity errors never
occur. No deployment SHA is inferred from `x-vercel-id`, ETag or Next build data;
raw exposed identifiers remain evidence. Only an exposed 40-hex `x-vercel-git-commit-sha`,
`x-git-commit-sha` or `x-deployment-sha` populates source deployment SHA; else UNKNOWN.
Reported local build9389c4e/ChromeBeta157 findings and lost PR16 raw JSON are
historical leads only, not current production findings. Prior timeout/retry failure
remains historical; this preparation neither reruns nor clears it.

## Follow-up acceptance

- Lead integrates PR136, reviews source/types/config isolation and schedules capacity.
- Run the exact command once; retain all ten test outcomes, JSON, failed traces/screenshots.
- Inspect CSP read status/headers/events, image failures, architecture H1 and actual
  deployment evidence; report failures and unknowns without retries or cause guesses.
