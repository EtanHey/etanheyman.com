# Portfolio E2E runtime

Status: source prepared; production/browser runtime NOT_RUN.

On the authorized execution host, install with `npm ci` and
`npx playwright install chromium`, then run `npm run test:e2e`.
Do not build, install browsers or execute E2E on the M4 during the resource hold.

The production webServer starts GET-only fixture REST at 127.0.0.1:45319,
then installed Next CLI `build` and `start` at :45320. It uses the committed
skills manifest, refuses .env files and passes only minimal environment/dummy
service values. No application fixture switch or real credentials.
`support/browser.ts` supplies saved public assets to browser GET requests.

Both bundled headless Chromium projects use one worker and zero retries:
desktop1280x800 and m390390x844 (mobile/touch/DPR3). The small smoke loads
/projects and decodes one real image via stable href/DOM img selection.
Reports and failures remain in ignored docs.local/e2e.
Adapter probe: `node --import tsx --test e2e/support/rest.test.ts`.

`BASE_URL=https://preview.example npm run test:e2e` starts no local servers
and substitutes no target assets/data; its smoke requires the same public card.
That is external-target evidence, not deterministic fixture or site acceptance.
Fixtures retain the historical 17-row public snapshot, 14 assets and provenance;
one SVG has documented CRLF-only normalization. No private backing data copied.

Full card/overflow/focus/hydration/no-JS/screenshot gates and Linux CI/baseline
workflow belong to the next infra slice, preserved at commit 7abd6d3. Their
known REDs/unrun states remain open. Smoke never grants visual/site acceptance.

`npm run test:e2e:adapters` checks REST and browser-route isolation without Chromium.
