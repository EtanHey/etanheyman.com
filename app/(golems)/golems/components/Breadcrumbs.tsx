"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// Map URL segments to section names
const sectionMap: Record<string, string> = {
  "golems/claude": "Agents",
  "golems/recruiter": "Agents",
  "golems/coach": "Agents",
  "golems/email": "Tools & Layers",
  "packages/shared": "Tools & Layers",
  skills: "Tools & Layers",
  "mcp-tools": "Tools & Layers",
  "packages/services": "Infrastructure",
  "packages/zikaron": "Infrastructure", // legacy route, redirects to BrainLayer
  "packages/brainlayer": "Infrastructure",
  "packages/ralph": "Infrastructure",
  "cloud-worker": "Infrastructure",
  "per-repo-sessions": "Infrastructure",
  "configuration/env-vars": "Guides",
  "configuration/secrets": "Guides",
  faq: "Guides",
  journey: "Guides",
  "interview-practice": "Agents",
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
      className="mb-4 flex items-center gap-1.5 text-xs text-[#b0a89c] md:mb-6"
    >
      <Link href="/golems" className="transition-colors hover:text-[#c0b8a8]">
        Golems
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span>{section}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="max-w-[200px] truncate text-[#c0b8a8]">{title}</span>
    </nav>
  );
}
