import skillsManifest from "./skills-manifest.json";

// AIDEV-NOTE: Every public skill number is derived from the generated skills
// manifest. These count eval *definitions* (evals.json), never results — no
// result is published until provenance-stamped runs exist.
const skills = Object.values(
  skillsManifest.skills as Record<
    string,
    { evalCount: number; assertionCount: number }
  >,
);

export const skillStats = {
  count: skillsManifest.skillCount,
  withEvalSuites: skills.filter((s) => s.evalCount > 0).length,
  assertions: skills.reduce((sum, s) => sum + s.assertionCount, 0),
};
