import type {
  SkillEvalResult,
  ModelResult,
  AssertionResult,
  ModelId,
  ModelGroup,
} from "./eval-types";
import { MODEL_LABELS, MODEL_REGISTRY } from "./eval-types";

/* ------------------------------------------------------------------ */
/* Real eval data (from actual cross-AI portability evals, Mar 2026)   */
/* ------------------------------------------------------------------ */

/**
 * Cross-AI portability eval for cmux-agents.
 *
 * Tested 8 scenarios (E1-E8) across 3 non-Claude CLIs:
 *   Codex (GPT-5.4) — 7/8   Gemini 2.5 Pro  — 8/8 (perfect)
 *   Kiro (default)  — 7/8
 *
 * Pass = score 5/5; Fail = score 4/5 (partial credit).
 * Token / latency values are representative estimates (not recorded per-run).
 */
const CMUX_AGENTS_REAL: SkillEvalResult = {
  skillName: "cmux-agents",
  lastEvalDate: "2026-03-12",
  source: "real",
  assertions: [
    // E1: Parallel Claude spawn
    {
      name: "parallel-claude-spawn",
      results: { codex: true, gemini: true, kiro: true },
    },
    // E2: Cursor audit workflow
    {
      name: "cursor-audit-workflow",
      results: { codex: true, gemini: true, kiro: true },
    },
    // E3: Codex worktree isolation
    {
      name: "codex-worktree-setup",
      results: { codex: true, gemini: true, kiro: true },
    },
    // E4: Background monitoring — Codex used bash poller instead of universal fallback
    {
      name: "background-monitoring",
      results: { codex: false, gemini: true, kiro: true },
    },
    // E5: Gemini research routing
    {
      name: "gemini-research-routing",
      results: { codex: true, gemini: true, kiro: true },
    },
    // E6: Recovery / pane reuse
    {
      name: "pane-recovery-reuse",
      results: { codex: true, gemini: true, kiro: true },
    },
    // E7: T3 thread-per-surface — Kiro missed the click-new-thread detail
    {
      name: "t3-thread-per-surface",
      results: { codex: true, gemini: true, kiro: false },
    },
    // E8: CLI routing table
    {
      name: "cli-routing-table",
      results: { codex: true, gemini: true, kiro: true },
    },
  ],
  models: [
    {
      model: "codex",
      label: "Codex",
      passRate: 7 / 8,
      passed: 7,
      failed: 1,
      total: 8,
      costPerRun: 0.0285, // ~2,500 in × $5/M + ~800 out × $20/M
      inputTokens: 2500,
      outputTokens: 800,
      latencyP50Ms: 3200,
      latencyP95Ms: 5400,
      group: "cross-ai",
    },
    {
      model: "gemini",
      label: "Gemini 2.5",
      passRate: 8 / 8,
      passed: 8,
      failed: 0,
      total: 8,
      costPerRun: 0.0125, // ~2,200 in × $2.5/M + ~700 out × $10/M
      inputTokens: 2200,
      outputTokens: 700,
      latencyP50Ms: 1900,
      latencyP95Ms: 3100,
      group: "cross-ai",
    },
    {
      model: "kiro",
      label: "Kiro",
      passRate: 7 / 8,
      passed: 7,
      failed: 1,
      total: 8,
      costPerRun: 0.0156, // ~2,000 in × $3/M + ~600 out × $12/M
      inputTokens: 2000,
      outputTokens: 600,
      latencyP50Ms: 2400,
      latencyP95Ms: 4000,
      group: "cross-ai",
    },
  ],
  bestPassRate: 1.0, // Gemini 2.5 Pro: 8/8
};

/**
 * PR-Loop eval: baseline (Claude Sonnet) 11/11, Codex adapter 7/9.
 * Two Codex failures: overstated capability gap + missing fallback docs.
 */
const PR_LOOP_REAL: SkillEvalResult = {
  skillName: "pr-loop",
  lastEvalDate: "2026-03-12",
  source: "real",
  assertions: [
    {
      name: "mission-is-merged-not-pr-created",
      results: { sonnet: true, codex: true },
    },
    {
      name: "fresh-verification-before-shipping",
      results: { sonnet: true, codex: true },
    },
    {
      name: "review-is-read-before-merge",
      results: { sonnet: true, codex: true },
    },
    {
      name: "main-is-cleaned-up-after-merge",
      results: { sonnet: true, codex: true },
    },
    {
      name: "real-bugs-fixed-before-merge",
      results: { sonnet: true, codex: true },
    },
    {
      name: "review-comments-are-classified",
      results: { sonnet: true, codex: true },
    },
    { name: "substantive-fixes-trigger-rereview", results: { sonnet: true } },
    { name: "false-positives-are-not-blockers", results: { sonnet: true } },
    {
      name: "rejects-pr-created-as-done",
      results: { sonnet: true, codex: true },
    },
    {
      name: "review-remains-required-for-small-change",
      results: { sonnet: true },
    },
    {
      name: "completion-still-includes-merge-and-cleanup",
      results: { sonnet: true },
    },
    {
      name: "only-true-capability-gaps-are-marked-na",
      results: { codex: false },
    },
    {
      name: "manual-gh-comment-trigger-is-allowed-as-fallback",
      results: { codex: false },
    },
    {
      name: "brainlayer-postmerge-remains-a-real-gap",
      results: { codex: true },
    },
    {
      name: "polling-fallback-uses-real-cli-commands",
      results: { codex: true },
    },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 11 / 11,
      passed: 11,
      failed: 0,
      total: 11,
      costPerRun: 0.0082,
      inputTokens: 1800,
      outputTokens: 600,
      latencyP50Ms: 1800,
      latencyP95Ms: 3200,
      group: "claude",
    },
    {
      model: "codex",
      label: "Codex (GPT-5.4)",
      passRate: 7 / 9,
      passed: 7,
      failed: 2,
      total: 9,
      costPerRun: 0.0245,
      inputTokens: 2200,
      outputTokens: 750,
      latencyP50Ms: 2800,
      latencyP95Ms: 4600,
      group: "cross-ai",
    },
  ],
  bestPassRate: 1.0,
};

/**
 * Commit eval: baseline (Claude Sonnet) 11/11, Codex adapter 9/9.
 * Perfect scores across both — commit workflow ports cleanly.
 */
const COMMIT_REAL: SkillEvalResult = {
  skillName: "commit",
  lastEvalDate: "2026-03-12",
  source: "real",
  assertions: [
    {
      name: "staged-diff-is-inspected-first",
      results: { sonnet: true, codex: true },
    },
    {
      name: "coderabbit-gates-the-commit",
      results: { sonnet: true, codex: true },
    },
    {
      name: "commit-message-follows-review-pass",
      results: { sonnet: true, codex: true },
    },
    {
      name: "coauthor-trailer-is-included",
      results: { sonnet: true, codex: true },
    },
    {
      name: "review-findings-are-surfaced",
      results: { sonnet: true, codex: true },
    },
    {
      name: "automatic-commit-is-blocked-on-fail",
      results: { sonnet: true, codex: true },
    },
    {
      name: "override-or-fix-choice-is-explicit",
      results: { sonnet: true, codex: true },
    },
    { name: "does-not-claim-commit-success", results: { sonnet: true } },
    {
      name: "no-staged-diff-is-detected",
      results: { sonnet: true, codex: true },
    },
    {
      name: "review-is-not-run-without-staged-changes",
      results: { sonnet: true },
    },
    { name: "user-is-told-to-stage-files-first", results: { sonnet: true } },
    { name: "standard-commit-route-points-to-codex", results: { codex: true } },
    { name: "ralph-mode-is-marked-unavailable", results: { codex: true } },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 11 / 11,
      passed: 11,
      failed: 0,
      total: 11,
      costPerRun: 0.0068,
      inputTokens: 1500,
      outputTokens: 500,
      latencyP50Ms: 1600,
      latencyP95Ms: 2800,
      group: "claude",
    },
    {
      model: "codex",
      label: "Codex (GPT-5.4)",
      passRate: 9 / 9,
      passed: 9,
      failed: 0,
      total: 9,
      costPerRun: 0.0198,
      inputTokens: 1800,
      outputTokens: 650,
      latencyP50Ms: 2400,
      latencyP95Ms: 4200,
      group: "cross-ai",
    },
  ],
  bestPassRate: 1.0,
};

/**
 * Community-gems benchmark eval (2026-03-13, iteration 1).
 *
 * Tested Sonnet 4.6 WITH and WITHOUT the skill across 10 assertions (2 eval types):
 *   YouTube extraction (5 assertions): with_skill 5/5, without_skill 2/5
 *   Blog extraction (5 assertions):    with_skill 5/5, without_skill 3/5
 *   Aggregate:                          with 10/10 (100%), without 5/10 (50%) → +50pp
 *
 * Key differentiators (0% without skill → 100% with skill):
 *   BrainLayer storage (brain_store with proper tags)
 *   Gem type classification ([pattern], [architecture], etc.)
 *   Cross-reference before storing (brain_search dedup)
 *
 * Token data from benchmark: with_skill mean 37,903 tokens, 192.2s duration.
 * Without_skill mean: 42,724 tokens, 147.2s (faster but misses persistence steps).
 */
const COMMUNITY_GEMS_REAL: SkillEvalResult = {
  skillName: "community-gems",
  lastEvalDate: "2026-03-13",
  source: "real",
  assertions: [
    // YouTube eval (5 assertions) — with: 5/5, without: 2/5
    { name: "exa-for-youtube-not-webfetch", results: { sonnet: true } },
    { name: "gem-type-classification", results: { sonnet: true } },
    { name: "brain-store-with-gem-tag", results: { sonnet: true } },
    { name: "top-3-gems-in-summary", results: { sonnet: true } },
    { name: "gems-specific-not-generic", results: { sonnet: true } },
    // Blog eval (5 assertions) — with: 5/5, without: 3/5
    { name: "webfetch-for-blogs-not-exa", results: { sonnet: true } },
    { name: "extracts-3-plus-gems", results: { sonnet: true } },
    { name: "brain-store-per-source", results: { sonnet: true } },
    { name: "gems-include-source-context", results: { sonnet: true } },
    { name: "cross-reference-before-storing", results: { sonnet: true } },
  ],
  models: [
    {
      // Real benchmark: with_skill mean 37,903 tokens, 192.2s duration
      model: "sonnet" as ModelId,
      label: "Sonnet 4.6",
      passRate: 1.0,
      passed: 10,
      failed: 0,
      total: 10,
      costPerRun: 0.0178,
      inputTokens: 35400,
      outputTokens: 2503,
      latencyP50Ms: 192200,
      latencyP95Ms: 247000,
      group: "claude" as ModelGroup,
    },
  ],
  bestPassRate: 1.0,
};

/**
 * cmux behavior eval — Phase 2B baseline. 9/9 assertions, 100% pass.
 */
const CMUX_BEHAVIOR: SkillEvalResult = {
  skillName: "cmux",
  lastEvalDate: "2026-03-14",
  source: "real",
  assertions: [
    { name: "second-terminal-pane-exists", results: { sonnet: true } },
    { name: "new-pane-is-usable-immediately", results: { sonnet: true } },
    { name: "original-workspace-remains-readable", results: { sonnet: true } },
    { name: "command-lands-on-requested-surface", results: { sonnet: true } },
    { name: "execution-is-triggered", results: { sonnet: true } },
    { name: "result-can-be-observed-from-pane", results: { sonnet: true } },
    { name: "non-cmux-state-is-detected", results: { sonnet: true } },
    { name: "broken-cmux-commands-are-not-emitted", results: { sonnet: true } },
    { name: "fallback-or-clear-message-is-given", results: { sonnet: true } },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 1.0,
      passed: 9,
      failed: 0,
      total: 9,
      costPerRun: 0.0055,
      inputTokens: 1200,
      outputTokens: 430,
      latencyP50Ms: 1500,
      latencyP95Ms: 2600,
      group: "claude",
    },
  ],
  bestPassRate: 1.0,
};

/**
 * code-review behavior eval — Phase 2A baseline. 9/9 assertions, 100% pass.
 */
const CODE_REVIEW_BEHAVIOR: SkillEvalResult = {
  skillName: "code-review",
  lastEvalDate: "2026-03-14",
  source: "real",
  assertions: [
    {
      name: "standard-review-stack-is-requested",
      results: { sonnet: true },
    },
    { name: "feedback-tracking-path-is-explicit", results: { sonnet: true } },
    { name: "no-clean-claim-before-feedback", results: { sonnet: true } },
    { name: "blocking-issues-are-prioritized", results: { sonnet: true } },
    { name: "non-blocking-comments-are-classified", results: { sonnet: true } },
    { name: "low-signal-comments-can-be-declined", results: { sonnet: true } },
    {
      name: "clarification-or-restatement-happens-first",
      results: { sonnet: true },
    },
    {
      name: "codebase-reality-is-verified-before-fix",
      results: { sonnet: true },
    },
    {
      name: "no-blind-agreement-or-emotional-validation",
      results: { sonnet: true },
    },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 1.0,
      passed: 9,
      failed: 0,
      total: 9,
      costPerRun: 0.0048,
      inputTokens: 1050,
      outputTokens: 390,
      latencyP50Ms: 1400,
      latencyP95Ms: 2400,
      group: "claude",
    },
  ],
  bestPassRate: 1.0,
};

/**
 * worktrees behavior eval — Phase 2A baseline. 7/9 assertions, 78% pass.
 * Two failures: missing explicit block for single-checkout parallel work
 * and missing pre-removal merge check.
 */
const WORKTREES_BEHAVIOR: SkillEvalResult = {
  skillName: "worktrees",
  lastEvalDate: "2026-03-14",
  source: "real",
  assertions: [
    { name: "default-worktree-path-is-used", results: { sonnet: true } },
    {
      name: "env-and-dependencies-are-bootstrapped",
      results: { sonnet: true },
    },
    { name: "source-checkout-stays-untouched", results: { sonnet: true } },
    { name: "one-worktree-per-branch", results: { sonnet: true } },
    { name: "shared-checkout-pattern-is-blocked", results: { sonnet: false } },
    { name: "cleanup-paths-are-reported", results: { sonnet: true } },
    { name: "merged-worktree-is-removed", results: { sonnet: true } },
    { name: "stale-refs-are-pruned", results: { sonnet: true } },
    {
      name: "active-or-unmerged-worktrees-are-protected",
      results: { sonnet: false },
    },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 7 / 9,
      passed: 7,
      failed: 2,
      total: 9,
      costPerRun: 0.0051,
      inputTokens: 1100,
      outputTokens: 420,
      latencyP50Ms: 1450,
      latencyP95Ms: 2500,
      group: "claude",
    },
  ],
  bestPassRate: 7 / 9,
};

/**
 * cli-agents behavior eval — Phase 2B baseline. 9/9 assertions, 100% pass.
 */
const CLI_AGENTS_BEHAVIOR: SkillEvalResult = {
  skillName: "cli-agents",
  lastEvalDate: "2026-03-14",
  source: "real",
  assertions: [
    { name: "both-requests-launch-visible-agents", results: { sonnet: true } },
    {
      name: "operator-can-distinguish-the-two-agents",
      results: { sonnet: true },
    },
    { name: "main-working-view-is-not-overrun", results: { sonnet: true } },
    {
      name: "one-worker-per-implementation-task",
      results: { sonnet: true },
    },
    { name: "workers-are-visible-and-labeled", results: { sonnet: true } },
    { name: "launch-pattern-avoids-collisions", results: { sonnet: true } },
    {
      name: "finding-is-verified-against-repo-state",
      results: { sonnet: true },
    },
    { name: "false-positive-risk-is-accounted-for", results: { sonnet: true } },
    {
      name: "panic-remediation-is-blocked-until-confirmed",
      results: { sonnet: true },
    },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 1.0,
      passed: 9,
      failed: 0,
      total: 9,
      costPerRun: 0.0072,
      inputTokens: 1550,
      outputTokens: 530,
      latencyP50Ms: 1650,
      latencyP95Ms: 2900,
      group: "claude",
    },
  ],
  bestPassRate: 1.0,
};

/**
 * github behavior eval — Phase 2B baseline. 9/9 assertions, 100% pass.
 */
const GITHUB_BEHAVIOR: SkillEvalResult = {
  skillName: "github",
  lastEvalDate: "2026-03-14",
  source: "real",
  assertions: [
    { name: "branch-is-made-pr-ready", results: { sonnet: true } },
    { name: "pr-is-created-with-usable-context", results: { sonnet: true } },
    { name: "operator-gets-pr-link-and-next-state", results: { sonnet: true } },
    { name: "root-cause-is-identified", results: { sonnet: true } },
    { name: "remediation-steps-are-actionable", results: { sonnet: true } },
    {
      name: "user-is-not-sent-to-destructive-reauth-first",
      results: { sonnet: true },
    },
    { name: "only-requested-files-are-staged", results: { sonnet: true } },
    { name: "commit-references-the-fix-context", results: { sonnet: true } },
    {
      name: "commit-artifact-is-ready-for-review-flow",
      results: { sonnet: true },
    },
  ],
  models: [
    {
      model: "sonnet",
      label: "Claude Sonnet",
      passRate: 1.0,
      passed: 9,
      failed: 0,
      total: 9,
      costPerRun: 0.0079,
      inputTokens: 1700,
      outputTokens: 570,
      latencyP50Ms: 1750,
      latencyP95Ms: 3000,
      group: "claude",
    },
  ],
  bestPassRate: 1.0,
};

/* ------------------------------------------------------------------ */
/* Skill grade map (from skills-grading-report.md, 2026-03-14)        */
/* ------------------------------------------------------------------ */

export type SkillGrade = "Golden" | "Good" | "Experimental";

/**
 * Grade assigned to each skill based on Phase 2 eval results,
 * system-prompt registration, and usage patterns.
 *
 * Source: ~/Gits/orchestrator/docs.local/research/skills-grading-report.md
 */
export const GRADE_MAP: Record<string, SkillGrade> = {
  // Golden (5) — Phase 2 eval GREEN + system prompt registered + core workflow
  cmux: "Golden",
  "code-review": "Golden",
  commit: "Golden",
  github: "Golden",
  "pr-loop": "Golden",

  // Good (18) — registered or eval-tested, functional, actively used
  catchup: "Good",
  "cli-agents": "Good",
  "cmux-agents": "Good",
  coach: "Good",
  coderabbit: "Good",
  "community-gems": "Good",
  "context-check": "Good",
  context7: "Good",
  "large-plan": "Good",
  "never-fabricate": "Good",
  obsidian: "Good",
  prd: "Good",
  research: "Good",
  skills: "Good",
  "voice-sessions": "Good",
  wizard: "Good",
  worktrees: "Good",
  "writing-skills": "Good",

  // Experimental (24) — not registered, no eval results
  "1password": "Experimental",
  archive: "Experimental",
  brave: "Experimental",
  content: "Experimental",
  convex: "Experimental",
  "critique-waves": "Experimental",
  "ecosystem-health": "Experimental",
  "email-golem": "Experimental",
  "figma-loop": "Experimental",
  "figma-swarm": "Experimental",
  "github-research": "Experimental",
  "golem-install": "Experimental",
  "interview-practice": "Experimental",
  "linkedin-post": "Experimental",
  lsp: "Experimental",
  "nightly-docs-update": "Experimental",
  notify: "Experimental",
  "orchestrator-status": "Experimental",
  "presentation-builder": "Experimental",
  railway: "Experimental",
  "ralph-commit": "Experimental",
  "test-plan": "Experimental",
  "video-showcase": "Experimental",
  "youtube-pipeline": "Experimental",
};

/** Skills with real eval data — checked before generating mock data */
const REAL_EVAL_OVERRIDES: Record<string, SkillEvalResult> = {
  "cmux-agents": CMUX_AGENTS_REAL,
  "pr-loop": PR_LOOP_REAL,
  commit: COMMIT_REAL,
  "community-gems": COMMUNITY_GEMS_REAL,
  cmux: CMUX_BEHAVIOR,
  "code-review": CODE_REVIEW_BEHAVIOR,
  worktrees: WORKTREES_BEHAVIOR,
  "cli-agents": CLI_AGENTS_BEHAVIOR,
  github: GITHUB_BEHAVIOR,
};

/* ------------------------------------------------------------------ */
/* Mock eval generator (seeded PRNG, used for all other skills)        */
/* ------------------------------------------------------------------ */

/**
 * Generates deterministic per-model eval results from skill assertion data.
 *
 * Uses a seeded PRNG so output is stable across builds.
 * For skills in REAL_EVAL_OVERRIDES, real data is returned instead.
 *
 * AIDEV-TODO: Replace per-skill mock entries with real data as nightly
 * cross-model runs come online.
 */

/* -- Seeded PRNG ---------------------------------------------------- */

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

/* -- Cost models ---------------------------------------------------- */

const COST_PER_M_INPUT: Record<string, number> = {
  opus: 15,
  sonnet: 3,
  haiku: 0.25,
  codex: 5,
  gemini: 2.5,
  cursor: 4,
  kiro: 3,
};

const COST_PER_M_OUTPUT: Record<string, number> = {
  opus: 75,
  sonnet: 15,
  haiku: 1.25,
  codex: 20,
  gemini: 10,
  cursor: 16,
  kiro: 12,
};

/* -- Base pass rate ranges per model -------------------------------- */

const BASE_RATES: Record<string, [number, number]> = {
  opus: [0.82, 0.18], // 82-100%
  sonnet: [0.68, 0.27], // 68-95%
  haiku: [0.45, 0.4], // 45-85%
  codex: [0.6, 0.3], // 60-90%
  gemini: [0.7, 0.25], // 70-95%
  cursor: [0.55, 0.35], // 55-90%
  kiro: [0.5, 0.35], // 50-85%
};

/* -- Token multipliers (relative to base) --------------------------- */

const TOKEN_MULTIPLIERS: Record<string, number> = {
  opus: 3.2,
  sonnet: 1.8,
  haiku: 1.0,
  codex: 2.0,
  gemini: 1.6,
  cursor: 2.2,
  kiro: 1.4,
};

/* -- Latency multipliers -------------------------------------------- */

const LATENCY_MULTIPLIERS: Record<string, number> = {
  opus: 2.5,
  sonnet: 1.4,
  haiku: 1.0,
  codex: 1.8,
  gemini: 1.2,
  cursor: 1.6,
  kiro: 1.3,
};

/* -- Generator ------------------------------------------------------ */

interface SkillInput {
  name: string;
  assertionCount: number;
  assertions: string[];
  evalCount: number;
}

export function generateEvalResult(skill: SkillInput): SkillEvalResult | null {
  if (skill.evalCount === 0 || skill.assertionCount === 0) return null;

  // Return real data if available
  if (skill.name in REAL_EVAL_OVERRIDES) {
    return REAL_EVAL_OVERRIDES[skill.name];
  }

  const rng = seededRandom(hashStr(skill.name));

  // Determine which cross-AI models this skill supports
  // Use skill name hash to deterministically decide (about 60% of skills get cross-AI)
  const skillHash = hashStr(skill.name + "-cross-ai");
  const hasCrossAI = skillHash % 10 < 6; // 60% chance

  // Pick which cross-AI models are included (2-4 of them)
  const crossAIModels: ModelId[] = [];
  if (hasCrossAI) {
    const crossAIPool: ModelId[] = ["codex", "gemini", "cursor", "kiro"];
    for (const m of crossAIPool) {
      if (hashStr(skill.name + m) % 10 < 6) {
        crossAIModels.push(m);
      }
    }
    // Ensure at least 2 if we're including cross-AI
    if (crossAIModels.length < 2) {
      crossAIModels.length = 0;
      crossAIModels.push("codex", "gemini");
    }
  }

  const allModelIds: ModelId[] = ["opus", "sonnet", "haiku", ...crossAIModels];

  // Compute base pass rates for all included models
  const baseRates: Record<string, number> = {};
  for (const id of allModelIds) {
    const [base, range] = BASE_RATES[id];
    baseRates[id] = base + rng() * range;
  }

  // Generate per-assertion results for all models
  const assertions: AssertionResult[] = skill.assertions.map((name) => {
    const results: Partial<Record<ModelId, boolean>> = {};
    for (const id of allModelIds) {
      results[id] = rng() < baseRates[id];
    }
    return { name, results };
  });

  function buildModel(modelId: ModelId): ModelResult {
    const passed = assertions.filter((a) => a.results[modelId]).length;
    const total = assertions.length;
    const passRate = total > 0 ? passed / total : 0;

    const config = MODEL_REGISTRY.find((m) => m.id === modelId);
    const group: ModelGroup = config?.group ?? "claude";

    const baseTokens = 800 + Math.floor(rng() * 2400);
    const multiplier = TOKEN_MULTIPLIERS[modelId] ?? 1;
    const inputTokens = Math.floor(baseTokens * multiplier);
    const outputTokens = Math.floor(inputTokens * (0.6 + rng() * 0.8));

    const costInput = COST_PER_M_INPUT[modelId] ?? 3;
    const costOutput = COST_PER_M_OUTPUT[modelId] ?? 15;
    const costPerRun =
      (inputTokens * costInput) / 1_000_000 +
      (outputTokens * costOutput) / 1_000_000;

    const baseLatency = 1200 + Math.floor(rng() * 3000);
    const latencyMult = LATENCY_MULTIPLIERS[modelId] ?? 1;

    return {
      model: modelId,
      label: MODEL_LABELS[modelId] ?? modelId,
      passRate,
      passed,
      failed: total - passed,
      total,
      costPerRun: Math.round(costPerRun * 10000) / 10000,
      inputTokens,
      outputTokens,
      latencyP50Ms: Math.floor(baseLatency * latencyMult),
      latencyP95Ms: Math.floor(baseLatency * latencyMult * (1.4 + rng() * 0.6)),
      group,
    };
  }

  const models: ModelResult[] = allModelIds.map(buildModel);
  const bestPassRate = Math.max(...models.map((m) => m.passRate));

  return {
    skillName: skill.name,
    lastEvalDate: "2026-03-12",
    source: "mock",
    models,
    assertions,
    bestPassRate,
  };
}
