import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import ContactBand from "../_components/ContactBand";
import WorkLedger from "../_components/WorkLedger";
import { claimStatusOf, groupProjects } from "../_lib/portfolio-content";

export const metadata: Metadata = {
  title: "Projects | Etan Heyman",
  description:
    "Open-source projects by Etan Heyman: BrainLayer (AI memory), VoiceLayer (voice I/O), Golems (autonomous agents), and more.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const groups = groupProjects(projects);
  const checked = projects.filter((p) => claimStatusOf(p).checked).length;

  return (
    <main className="flex w-full flex-col">
      <section aria-labelledby="projects-heading">
        <div className="pf-container pt-12 pb-8 md:pt-20 md:pb-12">
          <h1 id="projects-heading" className="pf-h1">
            All projects
          </h1>
          <p className="pf-lede mt-5">
            {projects.length} projects, from agent tooling to client sites. Each one links to
            something you can open: the source, a live site, docs or a case study.
          </p>
          <div className="mt-8 flex flex-col gap-x-10 gap-y-2 sm:flex-row sm:flex-wrap">
            <p className="pf-claim pf-claim-checked mt-0">
              <span className="pf-claim-dot" aria-hidden="true" />
              Description checked against the repository ({checked} of {projects.length})
            </p>
            <p className="pf-claim mt-0">
              <span className="pf-claim-dot" aria-hidden="true" />
              Description not yet checked against the repository
            </p>
          </div>
          <nav aria-label="Project groups" className="mt-10 flex flex-wrap gap-2">
            {groups.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="pf-evidence-link border border-[var(--pf-line)] px-4">
                {group.title}
                <span className="text-[var(--pf-sky)]">{group.projects.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-20">
          <div className="pf-container py-10 md:py-14">
            <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-end">
              <h2 id={`${group.id}-heading`} className="pf-h2">
                {group.title}
              </h2>
              <p className="pf-prose text-[var(--pf-sky)]">{group.intro}</p>
            </div>
            <div className="mt-8">
              <WorkLedger projects={group.projects} />
            </div>
          </div>
        </section>
      ))}

      <div className="mt-12">
        <ContactBand heading="Want the story behind one of these?" />
      </div>
    </main>
  );
}
