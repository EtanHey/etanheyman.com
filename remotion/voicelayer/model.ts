export const DEMO_FPS = 30;
export const DEMO_WIDTH = 1920;
export const DEMO_HEIGHT = 1080;

export const NOTCH_GEOMETRY = {
  coreWidth: 185,
  topHeight: 32,
  hoverLeadingWingWidth: 48,
  hoverTrailingWingWidth: 74,
  recordingLeadingWingWidth: 74,
  waveformWingWidth: 78,
  compactLeadingWingWidth: 48,
  compactTrailingWingWidth: 104,
  teleprompterWidth: 465,
  teleprompterHeight: 196,
  waveformWidth: 46,
  waveformHeight: 24,
  waveformCoreGap: 24,
  waveformOuterInset: 8,
} as const;

export const COLORS = {
  recording: "#E54D4D",
  speaking: "#4A90D9",
  idle: "#AEAEB2",
  desktop: "#070A12",
  editor: "#101521",
  editorRaised: "#161C2A",
  text: "#F7F8FC",
  muted: "#8D95A8",
} as const;

export type NotchVisualState =
  | "idle"
  | "recording"
  | "transcribing"
  | "speaking"
  | "hover";

export type HeroStateId =
  | "ready"
  | "recording"
  | "transcribing"
  | "paste"
  | "teleprompter"
  | "context-menu";

export type MakingOfStateId =
  | "dictate-problem"
  | "qa-frame"
  | "brief-agents"
  | "parallel-fixes"
  | "review-prs"
  | "verified";

export type DemoState<TId extends string = string> = {
  id: TId;
  start: number;
  end: number;
  label: string;
  notch: NotchVisualState;
};

export const HERO_STATES: readonly DemoState<HeroStateId>[] = [
  {
    id: "ready",
    start: 0,
    end: 90,
    label: "VoiceBar ready",
    notch: "idle",
  },
  {
    id: "recording",
    start: 90,
    end: 330,
    label: "Hold F5 · recording",
    notch: "recording",
  },
  {
    id: "transcribing",
    start: 330,
    end: 420,
    label: "Release · transcribing",
    notch: "transcribing",
  },
  {
    id: "paste",
    start: 420,
    end: 540,
    label: "Pasted once at the cursor",
    notch: "idle",
  },
  {
    id: "teleprompter",
    start: 540,
    end: 780,
    label: "voice_speak · teleprompter",
    notch: "speaking",
  },
  {
    id: "context-menu",
    start: 780,
    end: 900,
    label: "Right-click VoiceBar",
    notch: "hover",
  },
] as const;

export const MAKING_OF_STATES: readonly DemoState<MakingOfStateId>[] = [
  { id: "dictate-problem", start: 0, end: 360, label: "01 · Dictate the problem", notch: "recording" },
  { id: "qa-frame", start: 360, end: 750, label: "02 · Find the exact frame", notch: "transcribing" },
  { id: "brief-agents", start: 750, end: 1_200, label: "03 · Brief focused lanes", notch: "idle" },
  { id: "parallel-fixes", start: 1_200, end: 1_740, label: "04 · Fix in parallel", notch: "idle" },
  { id: "review-prs", start: 1_740, end: 2_250, label: "05 · Review the PRs", notch: "speaking" },
  { id: "verified", start: 2_250, end: 2_700, label: "06 · Replay at 120 fps", notch: "hover" },
] as const;

export const HERO_DURATION_FRAMES = 900;
export const MAKING_OF_DURATION_FRAMES = 2_700;

export const REDACTION_ZONES = [
  { id: "session-rail", opacity: 0.94, blur: 28 },
  { id: "header-left", opacity: 0.96, blur: 28 },
  { id: "header-right", opacity: 0.96, blur: 28 },
  { id: "pane-left", opacity: 0.66, blur: 28 },
  { id: "pane-right", opacity: 0.66, blur: 28 },
  { id: "terminal-status", opacity: 0.98, blur: 28 },
] as const;

export const PASTED_TRANSCRIPT =
  "Ship the smallest verified fix, then run the focused checks.";

export const HERO_TERMINAL_LINES = [
  "VoiceLayer acceptance · local Mac",
  "",
  "✓ VoiceBar connected",
  "✓ F5 relay available",
  "✓ active cursor captured",
  "",
  "Say what should happen next:",
] as const;

export const SPEAK_REQUEST =
  'voice_speak({ text: "The verified preview is ready." })';

export const TELEPROMPTER_TEXT =
  "The waveform now stays aligned with the camera core, and the cursor receives the transcript once.";

export const TELEPROMPTER_WORDS = TELEPROMPTER_TEXT.split(/\s+/);

export const RECORDING_LEVELS = [
  0.18, 0.46, 0.82, 0.58, 0.91, 0.38, 0.72, 0.55, 0.29, 0.68, 0.87, 0.42,
] as const;

export const PLAYBACK_LEVELS = [
  0.24, 0.64, 0.42, 0.78, 0.92, 0.57, 0.36, 0.73, 0.48, 0.84, 0.61, 0.31,
] as const;

export function stateAtFrame<TId extends string>(
  frame: number,
  states: readonly DemoState<TId>[],
): DemoState<TId> {
  if (states.length === 0) {
    throw new Error("At least one demo state is required");
  }

  return (
    states.find((state) => frame >= state.start && frame < state.end) ??
    states[states.length - 1]
  );
}

export function progressInState(frame: number, state: DemoState): number {
  return Math.max(
    0,
    Math.min(1, (frame - state.start) / (state.end - state.start)),
  );
}
