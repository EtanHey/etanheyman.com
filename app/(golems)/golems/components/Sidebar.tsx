'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  title: string;
  href: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarConfig: SidebarSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/golems/docs/getting-started' },
      { title: 'Architecture', href: '/golems/docs/architecture' },
    ],
  },
  {
    title: 'Agents',
    items: [
      { title: 'ClaudeGolem', href: '/golems/docs/golems/claude' },
      { title: 'RecruiterGolem', href: '/golems/docs/golems/recruiter' },
      { title: 'TellerGolem', href: '/golems/docs/golems/teller' },
      { title: 'CoachGolem', href: '/golems/docs/golems/coach' },
      { title: 'ContentGolem', href: '/golems/docs/packages/content' },
      { title: 'Content Pipelines', href: '/golems/docs/content-pipelines' },
    ],
  },
  {
    title: 'Tools & Layers',
    items: [
      { title: 'Email System', href: '/golems/docs/golems/email' },
      { title: 'Job Scraping', href: '/golems/docs/golems/job-golem' },
      { title: 'Shared Foundation', href: '/golems/docs/packages/shared' },
      { title: 'Skills Library', href: '/golems/docs/skills' },
      { title: 'MCP Tools', href: '/golems/docs/mcp-tools' },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { title: 'Services', href: '/golems/docs/packages/services' },
      { title: 'Zikaron (Memory)', href: '/golems/docs/packages/zikaron' },
      { title: 'Ralph (Coding Loop)', href: '/golems/docs/packages/ralph' },
      { title: 'Cloud Worker', href: '/golems/docs/cloud-worker' },
      { title: 'Dashboard', href: '/golems/docs/packages/dashboard' },
      { title: 'Orchestrator', href: '/golems/docs/packages/orchestrator' },
      { title: 'Per-Repo Sessions', href: '/golems/docs/per-repo-sessions' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Environment Variables', href: '/golems/docs/configuration/env-vars' },
      { title: 'Secrets & 1Password', href: '/golems/docs/configuration/secrets' },
      { title: 'FAQ', href: '/golems/docs/faq' },
      { title: 'Engineering Journey', href: '/golems/docs/journey' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isDocsPage = pathname.startsWith('/golems/docs');

  // Only show sidebar on doc pages
  if (!isDocsPage) return null;

  return (
    <aside
      className="hidden md:block w-64 shrink-0 sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto scrollbar-none bg-[#0c0b0a] border-r border-[#e5950015]"
    >
      <nav className="flex flex-col gap-6 p-4">
        {sidebarConfig.map((section) => (
          <div key={section.title}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7c6f5e] mb-2">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-[#e5950015] text-[#e59500] font-medium'
                          : 'text-[#908575] hover:text-[#c0b8a8] hover:bg-[#ffffff08]'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
