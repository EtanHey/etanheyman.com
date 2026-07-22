# VoiceLayer Showcase v3 Real Content Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Replace PR #108's reconstructed Claude/Codex pane bodies with authentic captured content while applying only path-, secret-, client-, and cost-level redaction.

**Architecture:** Remotion plays locally staged, ignored source recordings as the desktop base. A small targeted-redaction component applies source-specific, frame-bounded masks and `/Users/you` replacements. Existing VoiceBar notch and editorial annotations remain composited above the source. The sanitizer checks the narrow privacy policy against source code, tracked assets, OCR samples, and rendered outputs.

**Tech Stack:** React, TypeScript, Remotion, ffmpeg/ffprobe, macOS Vision OCR, Vitest, Next.js.

---

### Task 1: Establish failing authenticity and policy tests

**Files:**
- Modify: `app/(portfolio)/projects/[slug]/__tests__/voicelayer-showcase.test.ts`
- Modify: `remotion/voicelayer/__tests__/model.test.ts`

1. Assert that production code no longer contains `PrivacyDesktop`, `SafePane`, `SessionRail`, `SeamMask`, or synthetic transcript arrays.
2. Assert that both compositions use real source footage plus targeted redactions.
3. Replace blanket redaction-zone assertions with narrow path/secret/client/cost policy assertions.
4. Run the scoped tests and confirm they fail for the intended v2 behavior.

### Task 2: Audit source ranges and map redactions

**Files:**
- Inspect: `public/demos/source-private/*.mp4`
- Modify: `scripts/prepare-voicelayer-demo-sources.mjs` if better source ranges are required
- Create/modify: `remotion/voicelayer/redactions.ts`

1. Extract contact sheets and full-resolution frames across every selected source range.
2. Inspect the real desktop, menu bar, pane content, and current notch behavior.
3. OCR representative frames without emitting private values into tracked files.
4. Define only the exact source-space rectangles and time ranges needed for user paths, secrets, client names, and currency figures.

### Task 3: Remove pane reconstruction and render the real desktop

**Files:**
- Modify: `remotion/voicelayer/components/RealDesktop.tsx`
- Modify: `remotion/voicelayer/VoiceLayerShowcase.tsx`
- Modify: `remotion/voicelayer/model.ts`
- Create/modify: `remotion/voicelayer/components/TargetedRedactions.tsx`

1. Delete the reconstructed session rail, pane shells, safe-line arrays, and blanket pane covers.
2. Keep `SourceVideo`, genuine captured menu-bar treatment, source notch mask, and polished VoiceBar overlay.
3. Add minimal time-bounded redaction rectangles and path replacement labels.
4. Run scoped tests until green.

### Task 4: Narrow the sanitizer

**Files:**
- Modify: `scripts/check-voicelayer-demo-sanitization.mjs`

1. Retain checks for real local user paths and path aliases that reveal them.
2. Retain credential-shaped string, client-name blocklist, and cost/spend checks.
3. Remove bans on real pane content, tool calls, diffs, reasoning, token counts, terminal titles, public repo names, and agent names.
4. Verify ignored raw staging files remain untracked.

### Task 5: Render and inspect both cuts

**Files:**
- Update: `public/demos/voicelayer-hero.mp4`
- Update: `public/demos/voicelayer-making-of.mp4`

1. Prepare local sources and run the sanitizer before rendering.
2. Render the 30-second hero and 90-second making-of compositions.
3. Extract frames from every chapter and visually confirm real Mac chrome, real pane content, correct notch compositing, and narrow masks.
4. Run OCR/sanitization against both complete outputs and confirm no protected strings remain.
5. Verify duration, dimensions, frame rate, audio absence, and playable decodes with `ffprobe` and `ffmpeg`.

### Task 6: Verify, document, and publish to PR #108

**Files:**
- Modify: the external orchestrator collaboration seam for this showcase

1. Run scoped tests, build, full test suite, sanitization, video QA, and staged review.
2. Record the exact redacted fields versus content deliberately kept real in the seam.
3. Commit the reviewed change on the active showcase branch and update its associated PR.
4. Update the PR description/comment with v3 evidence and request the required reviews.
5. Do not merge.
