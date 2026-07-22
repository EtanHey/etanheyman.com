export type RedactionKind = "path" | "secret" | "client" | "cost";

export type TargetedRedaction = {
  id: string;
  cut: "hero" | "making-of";
  kind: RedactionKind;
  start: number;
  end: number;
  left: number;
  width: number;
  height: number;
  topKeyframes: readonly { frame: number; value: number }[];
  background: string;
  replacement?: string;
  color?: string;
};

const teleprompterRedactions = (
  cut: TargetedRedaction["cut"],
  offset: number,
): TargetedRedaction[] => [
  {
    id: `${cut}-shell-path`,
    cut,
    kind: "path",
    start: offset,
    end: offset + 240,
    left: 1_210,
    width: 145,
    height: 21,
    topKeyframes: [{ frame: offset, value: 92 }],
    background: "rgb(34, 36, 45)",
    replacement: "/Users/you",
    color: "rgba(220, 223, 229, .65)",
  },
  {
    id: `${cut}-codex-prompt-path`,
    cut,
    kind: "path",
    start: offset,
    end: offset + 900,
    left: 1_235,
    width: 148,
    height: 22,
    topKeyframes: [
      { frame: offset, value: 500 },
      { frame: offset + 210, value: 500 },
      { frame: offset + 240, value: 452 },
      { frame: offset + 510, value: 452 },
      { frame: offset + 540, value: 403 },
      { frame: offset + 899, value: 403 },
    ],
    background: "rgb(55, 57, 68)",
    replacement: "/Users/you",
    color: "rgba(218, 220, 226, .68)",
  },
  {
    id: `${cut}-claude-command-path`,
    cut,
    kind: "path",
    start: offset + 270,
    end: offset + 900,
    left: 413,
    width: 146,
    height: 19,
    topKeyframes: [{ frame: offset + 270, value: 635 }],
    background: "rgb(35, 37, 46)",
    replacement: "/Users/you",
    color: "rgba(231, 232, 236, .82)",
  },
  {
    id: `${cut}-session-cost`,
    cut,
    kind: "cost",
    start: offset,
    end: offset + 900,
    left: 532,
    width: 70,
    height: 21,
    topKeyframes: [{ frame: offset, value: 1_027 }],
    background: "rgb(34, 36, 45)",
  },
];

export const TARGETED_REDACTIONS: readonly TargetedRedaction[] = [
  ...teleprompterRedactions("hero", 0),
  {
    id: "making-rightclick-session-cost",
    cut: "making-of",
    kind: "cost",
    start: 0,
    end: 900,
    left: 600,
    width: 74,
    height: 20,
    topKeyframes: [{ frame: 0, value: 1_040 }],
    background: "rgb(34, 36, 45)",
  },
  {
    id: "making-verdict-session-cost",
    cut: "making-of",
    kind: "cost",
    start: 900,
    end: 1_800,
    left: 600,
    width: 74,
    height: 20,
    topKeyframes: [{ frame: 900, value: 1_040 }],
    background: "rgb(34, 36, 45)",
  },
  ...teleprompterRedactions("making-of", 1_800),
];
