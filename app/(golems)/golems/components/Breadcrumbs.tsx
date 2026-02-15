'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// Map URL segments to section names
const sectionMap: Record<string, string> = {
  'golems/claude': 'Agents',
  'golems/recruiter': 'Agents',
  'golems/teller': 'Agents',
  'golems/coach': 'Agents',
  'packages/content': 'Agents',
  'golems/email': 'Tools & Layers',
  'golems/job-golem': 'Tools & Layers',
  'packages/shared': 'Tools & Layers',
  'skills': 'Tools & Layers',
  'mcp-tools': 'Tools & Layers',
  'packages/services': 'Infrastructure',
  'packages/zikaron': 'Infrastructure',
  'packages/ralph': 'Infrastructure',
  'cloud-worker': 'Infrastructure',
  'per-repo-sessions': 'Infrastructure',
  'configuration/env-vars': 'Guides',
  'configuration/secrets': 'Guides',
  'faq': 'Guides',
  'journey': 'Guides',
  'interview-practice': 'Features',
  'llm': 'Reference',
  'deployment/railway': 'Guides',
  'getting-started': 'Getting Started',
  'architecture': 'Getting Started',
};

export default function Breadcrumbs({ title }: { title: string }) {
  const pathname = usePathname();
  const slug = pathname.replace('/golems/docs/', '');
  const section = sectionMap[slug];

  if (!section) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#7c6f5e] mb-4 md:mb-6">
      <Link href="/golems" className="hover:text-[#c0b8a8] transition-colors">
        Golems
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span>{section}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-[#c0b8a8] truncate max-w-[200px]">{title}</span>
    </nav>
  );
}
