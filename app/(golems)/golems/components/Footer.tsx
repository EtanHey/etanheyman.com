import Link from "next/link";
import skillsManifest from "../lib/skills-manifest.json";

const manifestDate = new Date(skillsManifest.generatedAt).toLocaleDateString(
  "en-GB",
  { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
);

const columns = [
  {
    title: "Use it",
    links: [
      { label: "Getting started", href: "/golems/docs/getting-started" },
      { label: "Skill ledger", href: "/golems/skills" },
      { label: "Architecture", href: "/golems/docs/architecture" },
      { label: "FAQ", href: "/golems/docs/faq" },
    ],
  },
  {
    title: "Read about it",
    links: [
      { label: "Engineering journey", href: "/golems/docs/journey" },
      { label: "Heritage: Ralph", href: "/golems/docs/heritage/ralph" },
      { label: "For LLMs", href: "/golems/docs/llm" },
    ],
  },
  {
    title: "Source",
    links: [
      { label: "github.com/EtanHey/golems", href: "https://github.com/EtanHey/golems", external: true },
      {
        label: "Contributing",
        href: "https://github.com/EtanHey/golems/blob/master/CONTRIBUTING.md",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-g-rule bg-g-sunk">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-12 md:grid-cols-[1.3fr_2fr] md:px-6 md:py-16">
        <div className="max-w-sm">
          <p className="font-g-display text-2xl text-g-ink">Golems</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-g-ash">
            Built by{" "}
            <a href="https://etanheyman.com" className="g-link">
              Etan Heyman
            </a>
            . Source under the Apache-2.0 license. Skill data on this site is
            generated from <code className="font-g-mono text-[0.85em]">skills/golem-powers</code>, last on{" "}
            {manifestDate}.
          </p>
          <p className="mt-4 flex gap-4 text-[0.95rem]">
            <a href="https://github.com/EtanHey" className="g-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/etanheyman" className="g-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-medium text-g-ink">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.92rem] break-words text-g-ash transition-colors duration-150 hover:text-g-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[0.92rem] text-g-ash transition-colors duration-150 hover:text-g-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
