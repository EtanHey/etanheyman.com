# Portfolio redesign: "layer stack"

Design exploration for the etanheyman.com portfolio (everything under `app/(portfolio)/`).
The Golems site (`app/(golems)/`, `content/golems`, `public/golems`) is untouched and
loads none of these styles.

## Brief, as understood

- **Audience:** people evaluating Etan's product, design and engineering work, or a collaboration.
- **Jobs:** understand the actual work quickly, inspect projects and skills with evidence they
  can check, then make contact.
- **Subject vernacular:** the open-source products are literally named *layers*
  (BrainLayer, VoiceLayer, cmuxLayer) and sit under a skills library (golem-powers).

## Directions compared

Three quick HTML sketches were rendered before choosing (`sketches/`, preview
`sketches/directions-a-b-c.webp`):

| Direction | Idea | Kept | Dropped because |
| --- | --- | --- | --- |
| A. Layer stack | Navy brand ground; hero draws the stack of layers Etan builds, memory at the base | **Selected** | — |
| B. Lab ledger | Blueprint-grid paper, claims table with a "check it" column | The claim/evidence ledger, used for every project row | Full broadsheet/grid page is a generated-design tell and buries the work in a table |
| C. Poster | Saturated brand blue, giant name type | The full-bleed blue contact band as the closing moment | Drops proof entirely; type-only hero says nothing about the work |

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| ink | `#00003F` | page ground (existing brand navy) |
| deep | `#002072` | raised plates |
| deeper | `#000A55` | second ground (skills section), plate shadow edge |
| signal | `#0A6ACB` | actions, contact band. One step deeper than brand `#0F82EB` so white text clears AA (5.33:1 vs 3.88:1) |
| ice | `#E7F5FE` | primary text (17.6:1 on ink) |
| sky | `#88CFF8` | secondary text (11.5:1 on ink) |
| marigold | `#FFC24B` | focus ring, selection, "checked" marker. The only warm note |

- **Type:** Nutmeg (the existing purchased brand face) for display and UI; Source Serif 4 for
  prose (descriptions, ledes). Two clearly different voices: the name and the work in Nutmeg,
  the explanation in a readable serif.
- **Layout:** left-aligned, max 1200px, 16/40/64px gutters. Work is a three-column ledger
  (name + context / description + claim status / links to check), never a card grid.
- **Motion:** one orchestrated moment (the stack settles on first paint, 520ms, 70ms stagger,
  strong ease-out). Everything else answers the visitor: plate shift on hover (pointer devices
  only), 0.97 press scale, 200ms menu sheet from its trigger corner. Reduced motion keeps
  opacity only.

## Honesty rules built into the UI

- **Claim status per project.** A filled marigold dot means the description matches, word for
  word, a blurb from the committed claim-checked migrations
  (`supabase/migrations/20261028_*`, `20261029_*`). Anything else, including an edited blurb,
  shows a hollow dot: "Description not yet checked against the repository".
- **Skills show definitions, not results.** Counts come from the generated skills manifest
  (`skillStats`): 57 skills, 37 with eval suites. The section says plainly that no run results
  are published, so nothing is a pass rate. Each featured skill shows real assertion names
  from its eval file and links to its Golems page.
- **Mockups are labelled.** The case-study terminal and chat panels say "Illustrative mockup,
  not a live recording".
- **Contradictory stats removed.** The case-study StatsBar is no longer rendered: its numbers
  (BrainLayer "12 MCP tools", cmuxLayer "21") contradict the claim-checked descriptions
  ("16 tools", "10 tools"), and it counted up from 0, so reduced-motion visitors saw "0".
- **Context labels come from the repo owner** (`Cantaloupe-Tech` → "At Cantaloupe AI",
  `WebyCreatorsTeam` → "Client work at Weby", `private` → "Private repository"), matching the
  career history already on /about. No new employer or client facts.

## Live reference study: UNPERFORMED

The environment's network policy denied every reference host from the browser
(HTTP 403 on CONNECT) and from WebFetch (DNS not allowed): rauno.me, paco.me,
emilkowalski.com, brittanychiang.com, linear.app/method, simonwillison.net, vercel.com,
stripe.com. No observations are recorded because none were made. To run it, allow those
hosts in the cloud environment's network settings.

## Reproduce

```bash
npm ci
# Build + serve with the committed public fixture snapshot and claim-checked blurb overlay.
node --import tsx scripts/portfolio-preview.ts          # :45320 (REST fixture on :45319)
# In another shell (PW_CHROMIUM only if the bundled Playwright browser is missing):
PW_CHROMIUM=/path/to/chromium node docs/portfolio-redesign/capture.mjs /tmp/after
PW_CHROMIUM=/path/to/chromium node docs/portfolio-redesign/interactions.mjs /tmp/inter
```

`before/` was captured with the same scripts from a scratch worktree of `origin/main`
at `0d27a71` (preview script copied in, nothing else changed).

## What is in this folder

| Path | Contents |
| --- | --- |
| `before/`, `after/` | Full-page captures at 1440, 768, 390 (webp) for /, /projects, /projects/brainlayer, /about, /contact, plus `report.json` (status, horizontal overflow at 1440/768/390/320, console errors) |
| `compare/` | Side-by-side panels: home top/middle/footer at 1440 and 390, case study, projects |
| `interaction/` | Desktop GIF (stack settle, plate hovers, keyboard path), mobile menu GIF, focus/hover/menu stills, `interactions.json` |
| `sketches/` | The three direction sketches (HTML + preview) |

## Verification summary (observed in this cloud session)

- `report.json`: after = 20/20 route×width loads HTTP 200, 0px overflow, 0 console errors.
  Before = overflow +77px (home @768) and +302px (case study @768); React #418 on /about at
  every width, and intermittently on /contact and /projects.
- React #418 on /about fixed at the cause (TimelineParallax read `useReducedMotion()` on first
  render). An intermittent #418 was still seen once in 146 candidate loads (/projects @320 in
  a second capture run) and could not be reproduced in 86 targeted reloads in prod and dev.
  Root cause of that intermittent one is **open**.
- Keyboard: skip link lands on `main`; tab order runs nav, hero actions, the four plates, then
  each project's evidence links with descriptive names ("Source code for BrainLayer (opens in
  a new tab)"); every stop draws a 3px marigold ring. Mobile menu: opens by keyboard, keeps
  focus inside for 8 tabs, marks the current page, closes on Escape and returns focus to
  "Menu".
- Reduced motion: hero uses `pf-fade` (opacity only); plates do not shift on hover
  (`none` vs `matrix(…, 10, 0)` with motion allowed).
- Contrast: every text pair ≥ 4.8:1; focus ring and button edges ≥ 3.67:1 (`interactions.json`).
- Golems isolation: /golems and /golems/skills load 2 CSS files each with 0 `pf-` rules; body
  classes unchanged.
