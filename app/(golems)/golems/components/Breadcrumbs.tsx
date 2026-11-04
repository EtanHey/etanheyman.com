"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// Map URL segments to section names
const sectionMap: Record<string, string> = {
  "golems/claude": "Agents",
  "golems/coach": "Agents",
  "golems/email": "Tools & Layers",
  "packages/shared": "Tools & Layers",
  skills: "Tools & Layers",
  "mcp-tools": "Tools & Layers",
  "packages/services": "Infrastructure",
  "packages/zikaron": "Infrastructure", // legacy route, redirects to BrainLayer
  "packages/brainlayer": "Infrastructure",
  "heritage/ralph": "Heritage",
  "per-repo-sessions": "Infrastructure",
  "configuration/env-vars": "Guides",
  "configuration/secrets": "Guides",
  faq: "Guides",
  journey: "Guides",
  llm: "Guides",
  "deployment/railway": "Guides",
  "getting-started": "Getting Started",
  architecture: "Getting Started",
};

export default function Breadcrumbs({ title }: { title: string }) {
  const pathname = usePathname();
  const slug = pathname.replace("/golems/docs/", "");
  const section = sectionMap[slug];

  if (!section) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-g-ash"
    >
      <Link href="/golems" className="rounded-sm transition-colors duration-150 hover:text-g-ink">
        Golems
      </Link>
      {section !== title && (
        <>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{section}</span>
        </>
      )}
      <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
      <span aria-current="page" className="max-w-[220px] truncate text-g-ink">{title}</span>
    </nav>
  );
}
