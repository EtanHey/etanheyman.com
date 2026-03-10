import Link from "next/link";
import skillsManifest from "../lib/skills-manifest.json";

interface SkillData {
  name: string;
  command: string;
  description: string;
  category: string;
  evalCount: number;
  assertionCount: number;
  hasFixtures: boolean;
  workflows: string[];
}

const skills = Object.values(
  skillsManifest.skills as Record<string, SkillData>,
);

const categories = [...new Set(skills.map((s) => s.category))].sort();

export const metadata = {
  title: "Skills Library — Golems",
  description: `${skills.length} reusable Claude Code skills with eval coverage and one-command install.`,
};

export default function SkillsIndexPage() {
  const grouped = categories.map((cat) => ({
    category: cat,
    skills: skills
      .filter((s) => s.category === cat)
      .sort((a, b) => b.assertionCount - a.assertionCount),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-16 md:px-6 md:pt-10">
      <div className="mb-6">
        <Link
          href="/golems"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-[#a89078] transition-colors hover:text-[#e59500]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Golems Home
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#f0ebe0] md:text-4xl">
        Skills Library
      </h1>
      <p className="mb-10 text-[#b0a89c]">
        {skills.length} reusable Claude Code skills. Click any skill for docs,
        eval results, and install prompt.
      </p>

      {grouped.map(({ category, skills: catSkills }) => (
        <section key={category} className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-[#e59500]">{category}</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {catSkills.map((skill) => (
              <Link
                key={skill.name}
                href={`/golems/skills/${skill.name}`}
                className="group block rounded-lg border border-[#e5950014] bg-[#14120e]/90 p-4 no-underline transition-colors hover:border-[#e5950040]"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <code className="rounded bg-[#e595000f] px-2 py-0.5 font-mono text-xs font-bold text-[#e59500]">
                    {skill.command}
                  </code>
                  {skill.assertionCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-[#28c84015] px-2 py-0.5 text-[0.65rem] font-medium text-[#28c840]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                      {skill.assertionCount} assertions
                    </span>
                  )}
                </div>
                <p className="m-0 text-[0.78rem] leading-relaxed text-[#b0a89c]">
                  {skill.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
