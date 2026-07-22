# VoiceLayer Showcase v2 Review Disposition

Status: COMPLETE — 9 CodeRabbit findings evaluated; 8 fixed and 1 accepted with a user-fidelity constraint.

- MAJOR: Make every redaction surface fully opaque — ACCEPTED WITH CONSTRAINT. The source-measured title, prompt, status, and rail masks remain near-opaque, while pane bodies use a 28px backdrop blur plus 0.66 dark substitution surface. A fully opaque pane was tried and explicitly rejected by Etan because it flattened the real Claude/Codex visual grammar. Final encoded frames must pass Vision OCR and banned-pattern scanning before delivery.
- MAJOR: Scan the published page and terminal showcase surfaces — FIXED. The sanitizer extracts and scans only the VoiceLayer slices so unrelated project copy cannot create false positives.
- MINOR: Fail fast when `stateAtFrame` receives no states — FIXED with a clear error and regression test.
- MINOR: Invalidate staged proxies when the FFmpeg recipe changes — FIXED by always regenerating the four short ignored proxies.
- MINOR: Tie the page integration assertion to the `voicelayer` slug branch — FIXED with a bounded structural assertion.
- MINOR: Assert that the showcase actually renders the real-footage/privacy components — FIXED.
- MINOR: Compare declared and installed Remotion packages by package name — FIXED.
- MINOR: Fade the context menu at the state boundary — FIXED with an `end` prop and mirrored fade-out.
- MAJOR: Strip inherited metadata and chapters from private-source proxy exports — FIXED with explicit FFmpeg `-map_metadata -1` and `-map_chapters -1` arguments.
