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
    title: 'Overview',
    items: [
      { title: 'Getting Started', href: '/golems/docs/getting-started' },
      { title: 'Architecture', href: '/golems/docs/architecture' },
    ],
  },
  {
    title: 'Golems',
    items: [
      { title: 'EmailGolem', href: '/golems/docs/golems/email' },
      { title: 'RecruiterGolem', href: '/golems/docs/golems/recruiter' },
      { title: 'ClaudeGolem', href: '/golems/docs/golems/claude' },
      { title: 'TellerGolem', href: '/golems/docs/golems/teller' },
      { title: 'JobGolem', href: '/golems/docs/golems/job-golem' },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { title: 'Cloud Worker', href: '/golems/docs/cloud-worker' },
      { title: 'MCP Tools', href: '/golems/docs/mcp-tools' },
      { title: 'LLM Integration', href: '/golems/docs/llm' },
      { title: 'Per-Repo Sessions', href: '/golems/docs/per-repo-sessions' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { title: 'Environment Variables', href: '/golems/docs/configuration/env-vars' },
      { title: 'Secrets', href: '/golems/docs/configuration/secrets' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { title: 'Railway', href: '/golems/docs/deployment/railway' },
    ],
  },
  {
    title: 'More',
    items: [
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
