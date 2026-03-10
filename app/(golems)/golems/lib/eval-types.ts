export type ModelId = "opus" | "sonnet" | "haiku";

export interface ModelResult {
  model: ModelId;
  label: string;
  passRate: number; // 0–1
  passed: number;
  failed: number;
  total: number;
  costPerRun: number; // USD
  inputTokens: number;
  outputTokens: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
}

export interface AssertionResult {
  name: string;
  opus: boolean;
  sonnet: boolean;
  haiku: boolean;
}

export interface SkillEvalResult {
  skillName: string;
  lastEvalDate: string;
  models: ModelResult[];
  assertions: AssertionResult[];
  bestPassRate: number;
}

/* ── Visual constants ──────────────────────────────────────── */

export const MODEL_COLORS: Record<ModelId, string> = {
  opus: "#a78bfa",
  sonnet: "#60a5fa",
  haiku: "#34d399",
};

export const MODEL_BG: Record<ModelId, string> = {
  opus: "#a78bfa18",
  sonnet: "#60a5fa18",
  haiku: "#34d39918",
};

export const MODEL_LABELS: Record<ModelId, string> = {
  opus: "Opus 4.6",
  sonnet: "Sonnet 4.6",
  haiku: "Haiku 4.5",
};

/** Four-tier color system (SnitchBench-inspired) */
export function passRateColor(rate: number): string {
  if (rate >= 0.9) return "#28c840";
  if (rate >= 0.7) return "#eab308";
  if (rate >= 0.4) return "#f97316";
  return "#ef4444";
}

export function passRateLabel(rate: number): string {
  if (rate >= 0.9) return "Excellent";
  if (rate >= 0.7) return "Good";
  if (rate >= 0.4) return "Fair";
  return "Needs Work";
}
