import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TimelineParallax from "@/app/components/navigation/about/TimelineParallax";
import {
  techIconMap,
  type TechIconName,
  TechIconWrapper,
} from "@/app/components/tech-icons/TechIconWrapper";
import { CONTACT_INFO } from "@/app/hooks/useRegion";
import ContactBand from "../_components/ContactBand";

export const metadata: Metadata = {
  title: "About | Etan Heyman",
  description:
    "Etan Heyman, AI engineer in Rehovot, Israel: career history from INT College to Weby and Cantaloupe AI, and the tools he builds with.",
  alternates: { canonical: "/about" },
};

// AIDEV-NOTE: Server component. The old page was a client component that only
// measured the career section for a console.log; the timeline handles its own scroll.
export default function AboutPage() {
  // The icon map holds aliases (e.g. "NextJS" and "Next.js") for DB spellings;
  // show each icon once, under its first name.
  const seen = new Set<unknown>();
  const tools = (Object.keys(techIconMap) as TechIconName[]).filter((name) => {
    if (seen.has(techIconMap[name])) return false;
    seen.add(techIconMap[name]);
    return true;
  });

  return (
    <main className="flex w-full flex-col">
      <section aria-labelledby="about-heading">
        <div className="pf-container grid gap-10 pt-12 pb-16 md:grid-cols-[auto_1fr] md:gap-14 md:pt-20 md:pb-24">
          <Image
            src="/images/me/Me2.png"
            alt="Portrait of Etan Heyman"
            width={280}
            height={280}
            sizes="(min-width: 768px) 280px, 160px"
            className="pf-portrait h-40 w-40 md:h-[280px] md:w-[280px]"
            priority
          />
          <div>
            <h1 id="about-heading" className="pf-h1">
              Etan Heyman
            </h1>
            <p className="mt-4 text-[20px] text-[var(--pf-sky)] md:text-[24px]">
              AI engineer in {CONTACT_INFO.location}
            </p>
            <p className="pf-prose mt-6">
              Highly motivated front-end developer with a strong work ethic and a proven
              ability to quickly learn new technologies. Experienced in developing dynamic
              web applications using Next.js and Tailwind CSS, as well as React.js with plain
              CSS and Node.js backend. Adept at leading teams and managing projects to
              successful completion.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className="pf-btn pf-btn-primary">
                See my projects
              </Link>
              <a href="/Etan_Heyman_resume.pdf" className="pf-btn pf-btn-ghost">
                Download résumé (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="career-heading" id="career-section">
        <div className="pf-container pb-16 md:pb-24">
          <h2 id="career-heading" className="pf-h2 mb-8">
            Career
          </h2>
          <TimelineParallax />
        </div>
      </section>

      <section aria-labelledby="tools-heading">
        <div className="pf-container pb-20 md:pb-28">
          <h2 id="tools-heading" className="pf-h2">
            Tools I&apos;ve shipped with
          </h2>
          <p className="pf-prose mt-4 text-[var(--pf-sky)]">
            Languages, frameworks and services used across the projects on this site.
          </p>
          <ul className="mt-10 grid grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-6 lg:grid-cols-10">
            {tools.map((name) => (
              <li key={name} className="flex justify-center">
                <TechIconWrapper name={name} showLabel />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactBand />
    </main>
  );
}
