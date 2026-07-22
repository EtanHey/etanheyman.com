# VoiceLayer v2.1.17 Real-Footage Showcase Design

## Status

Approved by `docs.local/handoffs/showcase-demo-v2-real-footage-boot.md` and Etan's explicit choices: real footage, hard redaction, and two cuts. This document supersedes the synthetic-desktop v1 design.

## Outcome

The VoiceLayer project page gets two silent, privacy-safe films built from the real QA recordings:

- a roughly 30-second hero cut showing F5 recording, truthful waveform motion, transcription, cursor paste, the karaoke teleprompter, and the shipped right-click menu;
- a roughly 90-second making-of cut showing the workflow from dictated problem through frame-level QA, agent briefing, parallel fixes, review, and the corrected notch.

Remotion is the editor and compositor. The real 3456×2234 Mac capture remains the base layer so the Apple menu bar, screen proportions, cmux layout, and terminal geometry stay authentic. The synthetic v1 desktop and slide-deck progress furniture are removed.

## Source and framing

The compositions use these reference-only local recordings:

- `rightclick-clip.mov` for the real Mac/cmux environment, cursor movement, and right-click context;
- `verdict-clip-2316.mov` for the QA and verification rhythm;
- `2026-07-13-teleprompter-live-test.mov` for real teleprompter-era desktop motion.

The 3456×2234 capture is contained inside the 1920×1080 delivery frame without cropping, preserving the Apple menu bar, bottom model/status rows, and the source aspect ratio. Narrow pillarbox areas stay solid black. The privacy layer uses source-measured geometry after that transform: a 278-pixel session rail and the Claude/Codex seam at x=1098 in the output frame. Local source files are exposed to Remotion through an ignored staging directory; raw recordings are never copied into git or public output.

## Privacy boundary: hard redaction

All source audio is muted. The actual captured macOS chrome, cmux window, split borders, purple session rail, prompt boxes, and status geometry remain visible. Text-bearing pane interiors receive a strong 28-pixel backdrop blur plus high-opacity, density-matched replacement text; small title/status regions get the same treatment. Claude panes retain Claude's indented tool-call/result grammar and bottom status rows; Codex panes retain Codex's run/view/edit receipts, diff blocks, composer, and model/path footer. The privacy layer follows each source-measured pane instead of flattening the desktop into generic panels. This preserves the recorded texture and motion while preventing the original prose from surviving visually or through OCR.

The output must contain none of the following:

- real terminal text, commands, prompts, window titles, usernames, machine names, or source paths;
- BrainLayer memory payloads, agent chain-of-thought/reasoning, internal decisions, clients, private projects, costs, token counts, or spend figures;
- `/Users/etanheyman/...`, which is represented only as `/Users/you/...` when a path is necessary.

Public product and repository names such as VoiceLayer, BrainLayer, and cmux are allowed. Final MP4s, posters, sampled frames, Remotion source, and the web component are scanned. A second rendered-frame audit uses OCR where available and rejects the same terms plus currency/token/cost language. The ignored source-staging directory is excluded from asset scans but separately asserted to be ignored and untracked.

## Shipped VoiceBar fidelity

The existing high-quality v1 notch model remains the visual foundation: fixed 185×32 camera core, content-fit glass wings, 46×24 seven-bar waveform viewport, red recording state, blue processing/playback state, and the 465×196 teleprompter. It is composited over the fixed source notch region whenever the source predates the final polish.

The context menu uses the actual shipped v2.1.17 labels from `PillContextMenuController`: Settings, Hide for 1 hour, Recent Transcripts, Paste last transcript, Copy last transcript, Transcription Tools, and Preferences.

## Editorial structure

### Hero — 30 seconds

The film stays inside the real desktop and uses only a tiny upper-left state label when clarity requires it. The action is continuous: ready, F5 hold, animated recording waveform, blue transcription, a single generic sentence pasted at the active cursor, teleprompter playback with karaoke word emphasis, and the native right-click menu. There is no outro card, bottom caption strip, or progress indicator.

### Making-of — 90 seconds

The same real desktop becomes an editorial timeline. Replacement terminal content shows a concrete but generic VoiceLayer bug report, a qa-video frame finding, a lead handing bounded work to Codex lanes, test/review receipts, two PRs, and a final verified notch. Brief chapter labels and restrained callouts explain causality without turning the desktop into a slide deck.

## Website integration

The project page embeds the hero first and offers a clearly labeled making-of directly beneath it. Both use native responsive `<video>` elements with poster fallback, muted inline playback, and controls; only the short hero autoplays and loops. Remotion remains a pinned development dependency and does not enter the client bundle.

The VoiceLayer terminal showcase remains grounded in shipped surfaces: MCP `voice_speak`, F5 dictation, and the real `voicelayer doctor` command from `src/cli/voicelayer.sh`. Retired fictional CLI modes stay forbidden by tests.

## Delivery

The branch is rebased on the actual current `origin/main`, verified, committed, pushed, and opened as a PR against `main`. It is not merged or deployed. The PR and the cross-repo seam explicitly record source clips, redaction behavior, output sizes, verification, and the observed status of PR #107.
