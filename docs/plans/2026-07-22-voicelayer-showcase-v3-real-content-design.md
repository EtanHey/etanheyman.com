# VoiceLayer Showcase v3 — Real Content Design

## Status

Approved by the v3 handoff on 2026-07-22. This supersedes the v2 reconstructed-pane privacy treatment.

## Problem

The v2 cuts used real desktop recordings as a base but covered the Claude Code and Codex pane bodies with React recreations. That removed the exact evidence the demo needs: real typography, density, spinners, diffs, tool calls, token counters, repo names, agent names, and timing. The result read as a mockup even though the Mac chrome was genuine.

## Approaches Considered

1. Keep the reconstructed harnesses and tune their styling. Rejected because a recreation cannot faithfully match the captured tools or their cadence.
2. Keep real footage but apply broad pane or full-frame blur. Rejected because it destroys the authentic work evidence and repeats the same product problem in a different visual form.
3. Use the real captured desktop unchanged except for narrow, timed redactions. Chosen. Remotion remains a compositing and annotation layer, not a terminal simulator.

## Approved Treatment

- The source recordings are the visual truth. Keep actual Claude Code and Codex content, tool calls, diffs, spinners, token counts, typography, density, cadence, repo names, agent names, and real Mac chrome.
- Preserve a genuine captured macOS menu bar in both cuts. When a chapter source lacks it, use the already-captured menu-bar strip from the hero source, never a fabricated menu bar.
- Keep the polished current VoiceBar notch composite over recordings that predate the final notch look.
- Redact only:
  - captured user-root paths, replaced visually with `/Users/you`;
  - genuine credentials and API tokens;
  - client names;
  - session cost or spend figures.
- Redactions are small source-aligned overlays with explicit time ranges. They may obscure only the sensitive glyph run, never an entire pane.
- Raw recordings remain in the ignored `public/demos/source-private/` staging directory and are never committed.
- Deliver a roughly 30-second hero cut and roughly 90-second making-of cut, both muted and rendered at 1920×1080.

## Safety and Verification

- Sample the selected source ranges before implementation and record every sensitive region that needs a timed mask.
- Run OCR over rendered samples and final outputs for paths, credential-shaped strings, client names, and currency values.
- Visually inspect representative frames from every chapter, including the top strip, to verify that the real menu bar and real pane bodies remain visible.
- The sanitizer must not reject real tool calls, diffs, agent reasoning, token counts, terminal titles, repo names, or agent names.
