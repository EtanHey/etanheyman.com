import type {
  SkillEvalResult,
  ModelResult,
  AssertionResult,
  ModelId,
} from "./eval-types";
import { MODEL_LABELS } from "./eval-types";

/**
 * Deterministic mock eval data generator.
 *
 * Generates realistic per-model (Opus/Sonnet/Haiku) eval results from
 * the basic assertion data in skills-manifest.json. Uses a seeded PRNG
 * so output is stable across builds (same skill → same numbers).
 *
 * AIDEV-TODO: Replace this module with real data from golems-cli evals
 * pipeline once Tier-3 nightly cross-model runs are active.
 */

/* ── Seeded PRNG ──────────────────────────────────────────── */

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

/* ── Cost model (approximate Claude pricing) ──────────────── */

const COST_PER_M_INPUT = { opus: 15, sonnet: 3, haiku: 0.25 } as const;
const COST_PER_M_OUTPUT = { opus: 75, sonnet: 15, haiku: 1.25 } as const;

/* ── Generator ────────────────────────────────────────────── */

interface SkillInput {
  name: string;
  assertionCount: number;
  assertions: string[];
  evalCount: number;
}

export function generateEvalResult(skill: SkillInput): SkillEvalResult | null {
  if (skill.evalCount === 0 || skill.assertionCount === 0) return null;

  const rng = seededRandom(hashStr(skill.name));

  // Model base pass rates — Opus generally highest, Haiku lowest
  const opusBase = 0.82 + rng() * 0.18; // 82–100%
  const sonnetBase = 0.68 + rng() * 0.27; // 68–95%
  const haikuBase = 0.45 + rng() * 0.4; // 45–85%

  // Generate per-assertion results
  const assertions: AssertionResult[] = skill.assertions.map((name) => {
    const r1 = rng();
    const r2 = rng();
    const r3 = rng();
    return {
      name,
      opus: r1 < opusBase,
      sonnet: r2 < sonnetBase,
      haiku: r3 < haikuBase,
    };
  });

  function buildModel(model: ModelId): ModelResult {
    const passed = assertions.filter((a) => a[model]).length;
    const total = assertions.length;
    const passRate = total > 0 ? passed / total : 0;

    // Token counts vary by model — Opus uses more reasoning tokens
    const baseTokens = 800 + Math.floor(rng() * 2400);
    const multiplier = model === "opus" ? 3.2 : model === "sonnet" ? 1.8 : 1;
    const inputTokens = Math.floor(baseTokens * multiplier);
    const outputTokens = Math.floor(inputTokens * (0.6 + rng() * 0.8));

    const costPerRun =
      (inputTokens * COST_PER_M_INPUT[model]) / 1_000_000 +
      (outputTokens * COST_PER_M_OUTPUT[model]) / 1_000_000;

    // Latency — Opus slowest, Haiku fastest
    const baseLatency = 1200 + Math.floor(rng() * 3000);
    const latencyMultiplier =
      model === "opus" ? 2.5 : model === "sonnet" ? 1.4 : 1;

    return {
      model,
      label: MODEL_LABELS[model],
      passRate,
      passed,
      failed: total - passed,
      total,
      costPerRun: Math.round(costPerRun * 10000) / 10000,
      inputTokens,
      outputTokens,
      latencyP50Ms: Math.floor(baseLatency * latencyMultiplier),
      latencyP95Ms: Math.floor(
        baseLatency * latencyMultiplier * (1.4 + rng() * 0.6),
      ),
    };
  }

  const models: ModelResult[] = [
    buildModel("opus"),
    buildModel("sonnet"),
    buildModel("haiku"),
  ];

  const bestPassRate = Math.max(...models.map((m) => m.passRate));

  return {
    skillName: skill.name,
    lastEvalDate: "2026-03-09",
    models,
    assertions,
    bestPassRate,
  };
}
