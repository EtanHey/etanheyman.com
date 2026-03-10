"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { DocNavItem } from "../lib/docs-nav";

const navLinks = [
  { label: "Docs", href: "/golems/docs/getting-started" },
  { label: "Skills", href: "/golems/skills" },
  { label: "Architecture", href: "/golems/docs/architecture" },
  { label: "Journey", href: "/golems/docs/journey" },
  { label: "For LLMs", href: "/golems/docs/llm" },
];

const externalLinks = [
  { label: "etanheyman.com", href: "https://etanheyman.com" },
  { label: "GitHub", href: "https://github.com/EtanHey/golems" },
];

interface Props {
  nav: DocNavItem[];
}

export default function Header({ nav }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDocsPage = pathname.startsWith("/golems/docs");
  const [docsExpanded, setDocsExpanded] = useState(isDocsPage);

  // Auto-expand docs section when navigating to a docs page
  useEffect(() => {
    if (isDocsPage) setDocsExpanded(true);
  }, [isDocsPage]);

  // Close mobile menu on navigation (prevents phantom taps from onClick race)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e5950015] bg-[#0c0b0a]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4">
          {/* Left: Logo + nav links */}
          <div className="flex items-center gap-6">
            <Link href="/golems" className="flex shrink-0 items-center gap-2">
              <Image
                src="/images/golems-logo.svg"
                alt="Golems"
                width={24}
                height={24}
                className="drop-shadow-[0_0_8px_rgba(229,149,0,0.3)]"
              />
              <span className="text-sm font-bold tracking-tight text-[#e59500]">
                Golems
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-[#e5950015] text-[#e59500]"
                        : "text-[#a69987] hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: external links (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-3 md:flex">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#b0a89c] transition-colors hover:text-[#c0b8a8]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                if (mobileOpen) setDocsExpanded(false);
              }}
              className="p-1 text-[#e59500] md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — sits above the overlay via header's z-50 */}
        {mobileOpen && (
          <nav
            className="relative z-[51] max-h-[calc(100vh-3rem)] space-y-1 overflow-y-auto border-t border-[#e5950015] bg-[#0c0b0a] px-4 py-3 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-[#e5950015] text-[#e59500]"
                      : "text-[#a69987] hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Docs navigation (expandable on mobile) */}
            {isDocsPage && (
              <>
                <button
                  type="button"
                  onClick={() => setDocsExpanded(!docsExpanded)}
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#e59500] transition-colors hover:bg-[#e5950015]"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${docsExpanded ? "rotate-180" : ""}`}
                  />
                  Doc Pages
                </button>
                {docsExpanded && (
                  <div className="space-y-3 pt-1 pl-2">
                    {nav.map((section) => {
                      if (!section.children) {
                        const href = `/golems/docs/${section.slug}`;
                        const isActive = pathname === href;
                        return (
                          <Link
                            key={section.slug}
                            href={href}
                            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                              isActive
                                ? "bg-[#e5950015] font-medium text-[#e59500]"
                                : "text-[#a69987] hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                            }`}
                          >
                            {section.title}
                          </Link>
                        );
                      }
                      return (
                        <div key={section.slug}>
                          <h4 className="mb-1 px-3 text-[10px] font-bold tracking-widest text-[#b0a89c] uppercase">
                            {section.title}
                          </h4>
                          {section.children.map((item) => {
                            const href = `/golems/docs/${item.slug}`;
                            const isActive = pathname === href;
                            return (
                              <Link
                                key={item.slug}
                                href={href}
                                className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                                  isActive
                                    ? "bg-[#e5950015] font-medium text-[#e59500]"
                                    : "text-[#a69987] hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                                }`}
                              >
                                {item.title}
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <div className="mt-2 space-y-1 border-t border-[#e5950015] pt-2">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-[#b0a89c] transition-colors hover:bg-[#ffffff08] hover:text-[#c0b8a8]"
                >
                  {link.label} &rarr;
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Mobile overlay to close menu — preventDefault stops phantom taps */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default appearance-none border-none bg-transparent md:hidden"
          aria-label="Close navigation"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileOpen(false);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setMobileOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setMobileOpen(false);
          }}
        />
      )}
    </>
  );
}
