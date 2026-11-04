# Golems site redesign: proof pack

Task marker: `cloud-credit-20261104-golems-site-redesign`. Scope: `app/(golems)/golems/` only. The portfolio, shared root files, framework config, content and database were not edited.

## Direction

**Subject.** Golems is a monorepo of agent skills and tooling. Its strongest credibility asset is honesty about evals: 37 of 57 skills have eval scenarios written and none has results on current models. The redesign puts that fact at the centre of the site instead of hiding it.

**Concept: emet.** In the golem story the word *emet* (אמת, "truth") on its forehead brings the clay to life. Erase the aleph and it reads *met* (מת, "dead"). The hero's one interactive moment is erasing that aleph. It is the honesty principle the eval ledger follows.

| Token | Value | Role |
| --- | --- | --- |
| slip | `#dedfd8` | page ground (grey-green clay slip; deliberately not cream) |
| raised / sunk | `#e9eae4` / `#d2d4cc` | surfaces, footer |
| ink | `#1b2321` | text, kiln surface for code (11.96:1 on slip) |
| ash | `#4f5651` | secondary text (5.63:1 on slip) |
| cobalt | `#2340a0` | links, primary action, "written" mark (6.77:1) |
| ochre | `#7a4e07` | "fixtures" mark/text (≥4.5:1 on slip and raised) |
| glaze | `#8fa6ff` | accent and focus ring on kiln (6.93:1) |

Type: Young Serif (display, a sturdy hand-formed serif), IBM Plex Sans/Mono (body, code), Frank Ruhl Libre 900 (Hebrew inscription). Status marks use shape as well as colour: filled square = scenarios written, filled dot = fixtures, hollow ring = not yet run, dash = no suite.

### Directions compared (`directions/`)

| Sketch | Idea | Verdict |
| --- | --- | --- |
| A, slip and cobalt (`direction-a.png`) | Light stoneware ground, chunky serif, dark kiln tile for the emet inscription, ledger strip | **Chosen.** Distinct from today's site and from the default AI looks; the ledger reads as evidence. |
| B, kiln night (`direction-b.png`) | Evolve the current amber-on-black terminal site | Safe, but it is the "near-black + single warm accent" default and keeps the old identity. |
| C, clay tablet (`direction-c.png`) | Terracotta ground, incised condensed caps, tablet grid | Memorable, but poor long-form readability for docs and a card grid. |

## Reference study: UNPERFORMED

The brief asked for at least three live public references viewed in a real browser. The cloud environment's network policy refused every one I tried (2026-11-04, about 06:56Z): `charm.sh`, `oxide.computer`, `bun.sh`, `inspect.aisi.org.uk` and `emilkowal.ski` returned 403 on CONNECT in Playwright Chromium, and server-side fetches could not resolve them. I recorded no observations and did not invent any. To run this study, allow those hosts in the environment's network settings and re-run the Playwright scripts in `logs/` against them.

## Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| Hero: three MCP-server cards with stale stats (313K+ chunks, 45 tools, test totals from an April stats file) | Hero states what Golems is; evidence strip derived only from the generated manifest (57 / 37 / 15 / none published) | The journey doc already contradicted the old numbers (805,430 chunks in Sept); the brief forbids invented or stale figures |
| Eval evidence hidden behind green "N evals" pills | Ledger columns for scenarios written and fixtures, plus a written → run → published ladder that stays honestly empty past step one | Shows real eval work without implying results |
| `npx golems-cli install` / `golems-cli skills install <name>` | `git clone … && bun install`, then `bun packages/golem-skills/src/index.ts skills install <name>` | Matches `getting-started.md`; no published global CLI is documented |
| Skill page "Changelog": invented "v1.0, initial release" entry | "Record" tab listing manifest facts plus a link to the real git history | Removes a fabricated version history |
| Docs pages had no visible title (sr-only h1) and a duplicate breadcrumb | Visible Young Serif title, breadcrumb trimmed when section equals title | Orientation for readers |
| Architecture doc rendered the same SVG twice on desktop | Rendered once (content image); mobile fallback kept and fixed for contrast | Bug fix |
| `SkillsShowcase` was a client component importing the 876 KB manifest | Server components pre-compute rows; clients get small props | `/golems` first-load JS 422 kB → 110 kB, docs 595 kB → 291 kB (`logs/bundle-*.txt`) |
| Copy buttons hidden until hover on desktop | Always visible, `aria-live` confirmation | Keyboard and touch users can find them |
| Tabs: click only | ARIA tabs with Arrow, Home and End keys and roving tabindex | Keyboard navigation pattern |
| Mobile menu closed only via overlay | Escape closes it from anywhere | Expected dialog-like behaviour |
| `transition-all`, translate-on-hover cards, fade-in on every line of a fake terminal | One orchestrated hero rise (600 ms, strong ease-out), 160 ms press scale, colour-only hovers, 420 ms clip-path aleph erase | Motion only where it explains something; reduced motion keeps opacity, drops movement |
| Nested `<main>` on skill pages | Single `<main id="golems-main">` with a skip link | Landmark correctness |

## Proof (observed in this session)

- **Screenshots**: `baseline/` (origin/main via the dev server) and `candidate/` (production build via `next start`) at 1440, 768 and 390: viewport top as PNG, full page as JPEG (top, skills content, story, footer).
- **320 px smoke** (`logs/candidate-routes.json`): every route measured, no horizontal overflow.
- **Console**: 0 console errors or page errors on 4 routes × 4 widths.
- **axe-core** (`logs/axe-log.txt`), wcag2a/aa, wcag21aa and best-practice: 0 violations on 8 routes at 1440 and 390, after fixing what it found (scrollable code regions not focusable, low-contrast shell comments, the legacy mobile diagram).
- **Keyboard** (`logs/proof-log.txt`): first Tab reaches the skip link; tab order is header → nav → external links → CTAs; Enter toggles the emet button (`aria-pressed=true`); skill tabs follow Arrow and End keys; Escape closes the mobile menu.
- **Reduced motion**: with `prefers-reduced-motion: reduce` the aleph uses an opacity-only 200 ms transition (no clip path) and the hero rise runs at 1e-05 s (`interaction/reduced-motion-erased-1440.png`).
- **Interaction GIF**: `interaction/interaction.gif` (emet toggle, ledger-excerpt filters, ledger search and filter, keyboard tab switching).
- **Contrast**: token pairs computed with the WCAG formula (table above), plus axe colour-contrast.
