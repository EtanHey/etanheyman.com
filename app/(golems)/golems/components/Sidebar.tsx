'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDocsPage = pathname.startsWith('/golems/docs');

  const sidebarNav = (
    <nav className="flex flex-col gap-6 p-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-xs text-[#7c6f5e] hover:text-[#c0b8a8] transition-colors mb-2"
      >
        <ArrowLeft className="h-3 w-3" />
        etanheyman.com
      </Link>

      <Link
        href="/golems"
        onClick={() => setMobileOpen(false)}
        className="text-[#e59500] font-bold text-lg tracking-tight hover:text-[#f0ebe0] transition-colors"
      >
        Golems
      </Link>

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
                    onClick={() => setMobileOpen(false)}
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
  );

  return (
    <>
      {/* Mobile header bar — visible on doc pages below md */}
      {isDocsPage && (
        <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[#0c0b0a]/95 backdrop-blur-sm border-b border-[#e5950015]">
          <div className="flex items-center gap-3 px-4 h-12">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#e59500] p-1 -ml-1"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/golems" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <Image
                src="/images/golems-logo.svg"
                alt="Golems"
                width={24}
                height={24}
                className="shrink-0 drop-shadow-[0_0_8px_rgba(229,149,0,0.3)]"
              />
              <span className="font-bold text-[#e59500] text-sm tracking-tight">Golems</span>
            </Link>
          </div>
        </header>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0c0b0a] border-r border-[#e5950015] z-40 overflow-y-auto scrollbar-none transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:sticky md:top-0 md:h-screen md:shrink-0`}
      >
        {/* Push sidebar content below header on mobile */}
        <div className="pt-12 md:pt-0">
          {sidebarNav}
        </div>
      </aside>
    </>
  );
}
