import { ArrowUpRight, BookOpen, Code2, FileText, Globe } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import {
  RETIRED_SLUGS,
  claimStatusOf,
  contextOf,
  evidenceOf,
  shortTitle,
  type EvidenceLink,
} from "../_lib/portfolio-content";

const ICONS: Record<EvidenceLink["kind"], typeof Code2> = {
  "case-study": FileText,
  source: Code2,
  docs: BookOpen,
  live: Globe,
};

function Evidence({ link, title }: { link: EvidenceLink; title: string }) {
  const Icon = ICONS[link.kind];
  const body = (
    <>
      <Icon aria-hidden="true" className="h-4 w-4 flex-none text-[var(--pf-sky)]" />
      <span>{link.label}</span>
      {link.external && <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 flex-none opacity-70" />}
      <span className="sr-only">
        {` for ${title}`}
        {link.external ? " (opens in a new tab)" : ""}
      </span>
    </>
  );
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="pf-evidence-link">
      {body}
    </a>
  ) : (
    <Link href={link.href} className="pf-evidence-link">
      {body}
    </Link>
  );
}

export function WorkRow({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const title = shortTitle(project.title);
  const evidence = evidenceOf(project);
  const claim = claimStatusOf(project);
  const retired = project.slug ? RETIRED_SLUGS.has(project.slug) : false;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <li className="pf-row">
      <div>
        <Heading className="pf-row-name">{title}</Heading>
        <p className="pf-row-context">
          {contextOf(project)}
          {retired ? ", no longer maintained" : ""}
        </p>
      </div>
      <div>
        <p className="pf-row-desc">{project.shortDescription || project.description}</p>
        <p className={`pf-claim ${claim.checked ? "pf-claim-checked" : ""}`}>
          <span className="pf-claim-dot" aria-hidden="true" />
          {claim.checked
            ? `Description checked against the repository, ${claim.date}`
            : "Description not yet checked against the repository"}
        </p>
      </div>
      {evidence.length > 0 ? (
        <div className="pf-evidence" aria-label={`Check ${title}`} role="group">
          {evidence.map((link) => (
            <Evidence key={link.kind + link.href} link={link} title={title} />
          ))}
        </div>
      ) : (
        <p className="pf-small">No public links: the code is private.</p>
      )}
    </li>
  );
}

export default function WorkLedger({ projects }: { projects: Project[] }) {
  return (
    <ul className="pf-ledger">
      {projects.map((project) => (
        <WorkRow key={project.id} project={project} />
      ))}
    </ul>
  );
}
