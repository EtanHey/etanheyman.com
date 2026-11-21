"use client";

import { usePathname } from "next/navigation";
import type { DocNavItem } from "../lib/docs-nav";
import DocsNavTree from "./DocsNavTree";

interface Props {
  nav: DocNavItem[];
}

export default function Sidebar({ nav }: Props) {
  const pathname = usePathname();

  // Only show sidebar on doc pages
  if (!pathname.startsWith("/golems/docs")) return null;

  return (
    <aside className="scrollbar-thin sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-g-rule md:block">
      <nav aria-label="Documentation" className="px-3 py-6">
        <DocsNavTree nav={nav} />
      </nav>
    </aside>
  );
}
