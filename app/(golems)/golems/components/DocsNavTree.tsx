"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocNavItem } from "../lib/docs-nav";

// Shared by the desktop sidebar and the mobile menu so both list the same
// pages in the same order, with the same current-page marker.

function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  return (
    <span className="rounded-sm border border-g-rule px-1.5 py-0.5 font-g-mono text-[0.68rem] leading-none text-g-ash">
      {type}
    </span>
  );
}

function NavLink({ item }: { item: DocNavItem }) {
  const pathname = usePathname();
  const href = `/golems/docs/${item.slug}`;
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex min-h-9 items-center justify-between gap-2 rounded-md py-1.5 pr-2 pl-3 text-[0.9rem] transition-colors duration-150 ${
        isActive
          ? "bg-g-raised font-medium text-g-ink before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-g-cobalt"
          : "text-g-ash hover:bg-g-raised/70 hover:text-g-ink"
      }`}
    >
      <span>{item.title}</span>
      <TypeBadge type={item.type} />
    </Link>
  );
}

export default function DocsNavTree({ nav }: { nav: DocNavItem[] }) {
  const standalone = nav.filter((s) => !s.children);
  const groups = nav.filter((s) => s.children);

  return (
    <div className="flex flex-col gap-6">
      <ul className="space-y-0.5">
        {standalone.map((item) => (
          <li key={item.slug}>
            <NavLink item={item} />
          </li>
        ))}
      </ul>
      {groups.map((section) => (
        <div key={section.slug}>
          <p className="mb-1.5 pl-3 font-g-display text-[0.95rem] text-g-ink">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.children!.map((item) => (
              <li key={item.slug}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
