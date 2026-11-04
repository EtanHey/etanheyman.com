import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { CONTACT_INFO } from "@/app/hooks/useRegion";
import ContactBand from "./_components/ContactBand";
import LayerStack, { type Plate } from "./_components/LayerStack";
import SkillsLedger from "./_components/SkillsLedger";
import WorkLedger from "./_components/WorkLedger";
import { getSkillsLedger, groupProjects } from "./_lib/portfolio-content";

const PRODUCT_PREVIEW_COUNT = 4;

export default async function Home() {
  const projects = await getAllProjects();
  const groups = groupProjects(projects);
  const tooling = groups.find((g) => g.id === "agent-tooling");
  const product = groups.find((g) => g.id === "product");
  const skills = getSkillsLedger();

  const plates: Plate[] = [
    {
      name: "Golems skills",
      role: "How agents work",
      note: `${skills.total} SKILL.md workflows, ${skills.withEvalSuites} with eval suites.`,
      href: "#skills",
    },
    {
      name: "cmuxLayer",
      role: "Orchestration",
      note: "Runs coding agents in parallel terminal panes. No longer maintained.",
      href: "/projects/cmuxlayer",
    },
    {
      name: "VoiceLayer",
      role: "Voice",
      note: "Speech in and out for coding agents, with local speech-to-text.",
      href: "/projects/voicelayer",
    },
    {
      name: "BrainLayer",
      role: "Memory",
      note: "Persistent memory over MCP, kept in one local SQLite file.",
      href: "/projects/brainlayer",
    },
  ];

  return (
    <main className="flex w-full flex-col">
      {/* Hero */}
      <section aria-labelledby="hero-heading">
        <div className="pf-container grid gap-12 pt-12 pb-14 md:pt-20 md:pb-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-[16px] text-[var(--pf-sky)] md:text-[18px]">
              <Image
                src="/images/me/Me2.png"
                alt=""
                width={48}
                height={48}
                className="pf-portrait h-11 w-11 md:h-12 md:w-12"
                priority
              />
              <span>
                Etan Heyman, AI engineer in {CONTACT_INFO.location}
              </span>
            </p>
            <h1 id="hero-heading" className="pf-display mt-6">
              I build the layers AI coding agents run on.
            </h1>
            <p className="pf-lede mt-6">
              Memory, voice, orchestration, and the skills that tell agents how to work.
              Most of it is open source, so you can read the code before you read my
              descriptions of it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#work" className="pf-btn pf-btn-primary">
                See the work
              </Link>
              <Link href="/contact" className="pf-btn pf-btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>
          <LayerStack plates={plates} />
        </div>
      </section>

      {/* Agent tooling */}
      {tooling && (
        <section id="work" aria-labelledby="work-heading" className="scroll-mt-20">
          <div className="pf-container py-14 md:py-20">
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
              <h2 id="work-heading" className="pf-h2">
                {tooling.title}
              </h2>
              <p className="pf-prose text-[var(--pf-sky)]">{tooling.intro}</p>
            </div>
            <div className="mt-10">
              <WorkLedger projects={tooling.projects} />
            </div>
          </div>
        </section>
      )}

      <SkillsLedger />

      {/* Product work preview */}
      {product && (
        <section aria-labelledby="product-heading">
          <div className="pf-container py-14 md:py-20">
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
              <h2 id="product-heading" className="pf-h2">
                {product.title}
              </h2>
              <p className="pf-prose text-[var(--pf-sky)]">{product.intro}</p>
            </div>
            <div className="mt-10">
              <WorkLedger projects={product.projects.slice(0, PRODUCT_PREVIEW_COUNT)} />
            </div>
            <p className="mt-8 text-[17px]">
              <Link href="/projects" className="pf-link">
                See all {projects.length} projects
              </Link>
            </p>
          </div>
        </section>
      )}

      <ContactBand />
    </main>
  );
}
