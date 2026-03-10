"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocNavItem } from "../lib/docs-nav";

interface Props {
  nav: DocNavItem[];
}

export default function Sidebar({ nav }: Props) {
  const pathname = usePathname();

  const isDocsPage = pathname.startsWith("/golems/docs");

  // Only show sidebar on doc pages
  if (!isDocsPage) return null;

  return (
    <aside className="scrollbar-none sticky top-12 hidden h-[calc(100vh-3rem)] w-64 shrink-0 overflow-y-auto border-r border-[#e5950015] bg-[#0c0b0a] md:block">
      <nav className="flex flex-col gap-6 p-4">
        {nav.map((section) => {
          // Top-level items without children = standalone page
          if (!section.children) {
            const href = `/golems/docs/${section.slug}`;
            const isActive = pathname === href;
            return (
              <div key={section.slug}>
                <Link
                  href={href}
                  className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#e5950015] font-medium text-[#e59500]"
                      : "text-[#a69987] hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                  }`}
                >
                  {section.title}
                </Link>
              </div>
            );
          }

          // Category with children
          return (
            <div key={section.slug}>
              <h3 className="mb-2 text-[10px] font-bold tracking-widest text-[#b0a89c] uppercase">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.children.map((item) => {
                  const href = `/golems/docs/${item.slug}`;
                  const isActive = pathname === href;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-[#e5950015] font-medium text-[#e59500]"
                            : "text-[#a69987] hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
