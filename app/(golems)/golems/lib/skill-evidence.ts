import skillsManifest from "./skills-manifest.json";

// AIDEV-NOTE: The only eval evidence this site can show is what the generated
// manifest records: how many eval scenarios a skill's evals/evals.json defines
// and whether fixtures ship with it. Nothing here is a result. Every skill's
// run status is "not yet run on current models" until provenance-stamped runs
// (model_effective recorded) exist; see skills/[name]/EvalStatusPanel.tsx.

export interface ManifestSkill {
  name: string;
  command: string;
  description: string;
  category: string;
  evalCount: number;
  hasFixtures: boolean;
  workflows: string[];
  lastModified: string;
}

export type SuiteState = "written" | "none";

export const manifestSkills = Object.values(
  skillsManifest.skills as unknown as Record<string, ManifestSkill>,
).sort((a, b) => a.name.localeCompare(b.name));

export const manifestGeneratedAt = skillsManifest.generatedAt;

export function suiteState(skill: Pick<ManifestSkill, "evalCount">): SuiteState {
  return skill.evalCount > 0 ? "written" : "none";
}

export function suiteLabel(skill: Pick<ManifestSkill, "evalCount">): string {
  if (skill.evalCount === 0) return "No eval suite yet";
  return `${skill.evalCount} scenario${skill.evalCount === 1 ? "" : "s"} written`;
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const evidenceTotals = {
  skills: manifestSkills.length,
  withSuite: manifestSkills.filter((s) => s.evalCount > 0).length,
  withFixtures: manifestSkills.filter((s) => s.hasFixtures).length,
};
