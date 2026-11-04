import Link from "next/link";
import { getSkillsLedger } from "../_lib/portfolio-content";

export default function SkillsLedger() {
  const ledger = getSkillsLedger();
  const updated = new Date(ledger.generatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section id="skills" aria-labelledby="skills-heading" className="pf-surface scroll-mt-16 md:scroll-mt-[72px]">
      <div className="pf-container py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <h2 id="skills-heading" className="pf-h2">
              Skills, and what their evals check
            </h2>
            <p className="pf-lede mt-5">
              Golems ships {ledger.total} SKILL.md workflows for coding agents.{" "}
              {ledger.withEvalSuites} of them have an eval suite: written cases that say
              what the agent must and must not do.
            </p>
          </div>
          <div className="pf-notice" role="note">
            <span className="pf-notice-strong">These are test definitions, not results.</span>
            <span>
              No run results are published yet, so nothing here is a pass rate. Counts come
              from the skills manifest generated on {updated}.
            </span>
          </div>
        </div>

        <ul className="mt-12 border-t border-[var(--pf-line)]">
          {ledger.featured.map((skill) => (
            <li key={skill.name} className="pf-skill">
              <div>
                <h3 className="pf-skill-name">
                  <Link href={skill.href} className="pf-link no-underline">
                    {skill.command}
                  </Link>
                </h3>
              </div>
              <div>
                <p className="pf-prose">{skill.summary}</p>
                <ul className="pf-assertions" aria-label={`Sample checks for ${skill.command}`}>
                  {skill.sampleAssertions.map((assertion) => (
                    <li key={assertion} className="pf-assertion">
                      {assertion}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="pf-count">
                <span className="pf-count-strong">{skill.evalCount}</span> eval cases
                <br />
                <span className="pf-count-strong">{skill.assertionCount}</span> written checks
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[17px]">
          <Link href="/golems/skills" className="pf-link">
            Browse all {ledger.total} skills on the Golems site
          </Link>
        </p>
      </div>
    </section>
  );
}
