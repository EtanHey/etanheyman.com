"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import type { DocNavItem } from "../lib/docs-nav";
import DocsNavTree from "./DocsNavTree";

const navLinks = [
  { label: "Docs", href: "/golems/docs/getting-started", match: "/golems/docs" },
  { label: "Skills", href: "/golems/skills", match: "/golems/skills" },
  { label: "Journey", href: "/golems/docs/journey", match: "/golems/docs/journey" },
  { label: "For LLMs", href: "/golems/docs/llm", match: "/golems/docs/llm" },
];

const externalLinks = [
  { label: "GitHub", href: "https://github.com/EtanHey/golems" },
  { label: "etanheyman.com", href: "https://etanheyman.com" },
];

interface Props {
  nav: DocNavItem[];
}

function isActive(pathname: string, link: (typeof navLinks)[number]) {
  if (link.label === "Docs") {
    // Journey and For LLMs have their own tabs; Docs owns every other doc page.
    return (
      pathname.startsWith(link.match) &&
      !navLinks.some(
        (l) => l.label !== "Docs" && pathname.startsWith(l.match),
      )
    );
  }
  return pathname.startsWith(link.match);
}

export default function Header({ nav }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDocsPage = pathname.startsWith("/golems/docs");

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the menu from anywhere, not only from the overlay.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-g-rule bg-g-slip/92 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-g-slip">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/golems"
              className="flex shrink-0 items-center gap-2.5 rounded-md"
              aria-label="Golems home"
            >
              <Image
                src="/images/golems-logo.svg"
                alt=""
                width={28}
                height={28}
              />
              <span className="font-g-display text-[1.3rem] leading-none text-g-ink">
                Golems
              </span>
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = isActive(pathname, link);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-md px-3 py-2 text-[0.92rem] transition-colors duration-150 ${
                      active
                        ? "font-medium text-g-ink after:absolute after:right-3 after:-bottom-[9px] after:left-3 after:h-[2px] after:bg-g-cobalt"
                        : "text-g-ash hover:text-g-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <nav aria-label="External" className="hidden items-center gap-1 md:flex">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.92rem] text-g-ash transition-colors duration-150 hover:text-g-ink"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="g-press flex h-11 w-11 items-center justify-center rounded-md text-g-ink md:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="relative z-[51] max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-g-rule bg-g-slip px-4 pt-3 pb-6 md:hidden"
          >
            <ul className="space-y-0.5">
              {navLinks.map((link) => {
                const active = isActive(pathname, link);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-md px-3 font-g-display text-[1.15rem] ${
                        active ? "bg-g-raised text-g-ink" : "text-g-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {isDocsPage && (
              <div className="mt-4 border-t border-g-rule pt-4">
                <p className="mb-2 px-3 text-sm text-g-ash">Doc pages</p>
                <DocsNavTree nav={nav} />
              </div>
            )}

            <ul className="mt-4 space-y-0.5 border-t border-g-rule pt-3">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-1.5 rounded-md px-3 text-[0.95rem] text-g-ash"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {mobileOpen && (
        <button
          type="button"
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default appearance-none border-none bg-g-ink/20 md:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
