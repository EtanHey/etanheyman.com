export type ClaudeModelId = "opus" | "sonnet" | "haiku";
export type CrossAIModelId = "codex" | "gemini" | "cursor" | "kiro";
export type ModelId = ClaudeModelId | CrossAIModelId;

export type ModelGroup = "claude" | "cross-ai";

export interface ModelConfig {
  id: ModelId;
  label: string;
  color: string;
  bg: string;
  group: ModelGroup;
}

export interface ModelResult {
  model: ModelId;
  label: string;
  passRate: number; // 0-1
  passed: number;
  failed: number;
  total: number;
  costPerRun: number; // USD
  inputTokens: number;
  outputTokens: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  group: ModelGroup;
}

export interface AssertionResult {
  name: string;
  /** undefined = not tested for that model (e.g. partial eval run) */
  results: Partial<Record<ModelId, boolean>>;
}

export interface SkillEvalResult {
  skillName: string;
  lastEvalDate: string;
  models: ModelResult[];
  assertions: AssertionResult[];
  bestPassRate: number;
  /**
   * "real"         = actual eval run data for all sections
   * "real-adapter" = adapter section is real data, behavior section is generated estimate
   * "mock"         = all data is seeded PRNG estimate
   */
  source?: "real" | "real-adapter" | "mock";
}

/* -- Model registry -------------------------------------------------- */

export const MODEL_REGISTRY: ModelConfig[] = [
  // Claude models
  {
    id: "opus",
    label: "Opus 4.6",
    color: "#a78bfa",
    bg: "#a78bfa18",
    group: "claude",
  },
  {
    id: "sonnet",
    label: "Sonnet 4.6",
    color: "#60a5fa",
    bg: "#60a5fa18",
    group: "claude",
  },
  {
    id: "haiku",
    label: "Haiku 4.5",
    color: "#34d399",
    bg: "#34d39918",
    group: "claude",
  },
  // Cross-AI models
  {
    id: "codex",
    label: "Codex",
    color: "#f97316",
    bg: "#f9731618",
    group: "cross-ai",
  },
  {
    id: "gemini",
    label: "Gemini 2.5",
    color: "#4285f4",
    bg: "#4285f418",
    group: "cross-ai",
  },
  {
    id: "cursor",
    label: "Cursor",
    color: "#a855f7",
    bg: "#a855f718",
    group: "cross-ai",
  },
  {
    id: "kiro",
    label: "Kiro",
    color: "#ec4899",
    bg: "#ec489918",
    group: "cross-ai",
  },
];

export function getModelConfig(id: ModelId): ModelConfig {
  return MODEL_REGISTRY.find((m) => m.id === id) ?? MODEL_REGISTRY[0];
}

/* -- Visual constants (derived from registry) ----------------------- */

export const MODEL_COLORS: Record<string, string> = Object.fromEntries(
  MODEL_REGISTRY.map((m) => [m.id, m.color]),
);

export const MODEL_BG: Record<string, string> = Object.fromEntries(
  MODEL_REGISTRY.map((m) => [m.id, m.bg]),
);

export const MODEL_LABELS: Record<string, string> = Object.fromEntries(
  MODEL_REGISTRY.map((m) => [m.id, m.label]),
);

export const GROUP_LABELS: Record<ModelGroup, string> = {
  claude: "Behavior Baseline",
  "cross-ai": "Adapter Portability",
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
