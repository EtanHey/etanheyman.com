# VoiceLayer Showcase v2 Implementation Plan

**Goal:** Replace the synthetic VoiceLayer showcase with two real-footage Remotion cuts that preserve the Mac while hard-redacting every private desktop surface.

**Architecture:** A local ignored source-staging script exposes selected QA recordings to Remotion. Two deterministic compositions share a real-video base, a source-measured blur-plus-substitution privacy layer that preserves Claude/Codex UI grammar, and the shipped notch model. The Next.js page embeds only rendered MP4/poster assets. Tests cover narrative timing, source staging, truthful public commands, output wiring, and sanitization.

**Tech stack:** React 19, Next.js 15, Remotion 4.0.496, TypeScript, Vitest, FFmpeg/ffprobe, macOS Vision OCR when available.

---

## Task 1: Rebase and pin the v2 contract

1. Preserve the existing v1 work, fetch, rebase the feature branch on the actual current `origin/main`, and restore the worktree.
2. Extend the focused showcase test so it requires two cuts, rejects the synthetic desktop, verifies safe local source staging, and asserts truthful shipped VoiceLayer surfaces.
3. Add pure-model tests for exact hero/making-of durations, state order, permitted copy, and the hard-redaction policy.
4. Run the focused tests and record the expected red state.

## Task 2: Stage real footage without publishing it

1. Add `scripts/prepare-voicelayer-demo-sources.mjs` with a fixed allowlist of the three approved QA recordings.
2. Add the staging destination to `.gitignore`; fail if any staged source becomes tracked.
3. Symlink or copy the local sources only for rendering and enumerate compositions to prove Remotion can read them.

## Task 3: Build the privacy-first compositor

1. Replace `SyntheticDesktop` with a muted, aspect-preserving `OffthreadVideo` base.
2. Measure the transformed source rail and pane seams, then preserve the captured chrome and split geometry; apply strong blur-plus-replacement masks only to text-bearing rail, title, body, prompt, and status regions, with Claude- and Codex-specific density-matched content.
3. Keep and adapt the current notch component for hero and making-of states.
4. Add the exact shipped context menu and a subtle cursor/paste treatment.
5. Implement a 30-second hero timeline with no progress dots or end card.
6. Implement a 90-second making-of timeline with restrained chapter labels and frame-finding/agent/PR overlays.

## Task 4: Render and integrate both cuts

1. Register `VoiceLayerHero` and `VoiceLayerMakingOf` at 1920×1080, 30fps.
2. Add scripts for two posters and two H.264 renders with source audio omitted.
3. Update `VoiceLayerDemo` to autoplay/loop the hero and expose the making-of as a controlled second film.
4. Render outputs, inspect `ffprobe` duration/codec/dimensions/audio streams, and report binary sizes before committing.

## Task 5: Enforce sanitization and visual fidelity

1. Extend the sanitizer to scan both composition trees and both final asset pairs, reject identity/path/reasoning/client/cost patterns, and assert raw source media is ignored/untracked.
2. Extract representative and dense-contact-sheet frames from each render.
3. Run OCR on sampled output frames and fail on banned terms; manually inspect the posters and every scene/state for uncovered source pixels.
4. Compare the notch and context menu against current VoiceLayer source contracts.

## Task 6: Verify and deliver by PR

1. Run focused tests, all relevant Vitest tests, TypeScript/build, Remotion composition enumeration, version parity, sanitization, `git diff --check`, ffprobe, and repository status checks.
2. Run a code-review pass and address actionable findings.
3. Commit the scoped branch; use `--no-verify` only if the documented unrelated skills-manifest hook blocks the commit, and disclose it.
4. Push and open a PR against `etanheyman.com/main`; request the repository-required Codex, Cursor, and Bugbot reviews. Do not merge or deploy.
5. Post the PR URL, source clips, render details, and exact redaction seam to the orchestrator collaboration file.
6. Store the outcome and rationale in BrainLayer, then confirm the stored memory is searchable.
