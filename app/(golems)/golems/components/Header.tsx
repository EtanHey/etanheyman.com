'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Docs', href: '/golems/docs/getting-started' },
  { label: 'Journey', href: '/golems/docs/journey' },
  { label: 'For LLMs', href: '/golems/docs/llm' },
];

const externalLinks = [
  { label: 'etanheyman.com', href: 'https://etanheyman.com' },
  { label: 'GitHub', href: 'https://github.com/EtanHey/golems' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0c0b0a]/95 backdrop-blur-sm border-b border-[#e5950015]">
      <div className="flex items-center justify-between px-4 h-12 max-w-[1400px] mx-auto">
        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/golems"
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/images/golems-logo.svg"
              alt="Golems"
              width={24}
              height={24}
              className="drop-shadow-[0_0_8px_rgba(229,149,0,0.3)]"
            />
            <span className="font-bold text-[#e59500] text-sm tracking-tight">Golems</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'text-[#e59500] bg-[#e5950015]'
                      : 'text-[#908575] hover:text-[#c0b8a8] hover:bg-[#ffffff08]'
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
          <nav className="hidden md:flex items-center gap-3">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7c6f5e] hover:text-[#c0b8a8] text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#e59500] p-1"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[#e5950015] bg-[#0c0b0a] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'text-[#e59500] bg-[#e5950015]'
                    : 'text-[#908575] hover:text-[#c0b8a8] hover:bg-[#ffffff08]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-[#e5950015] pt-2 mt-2 space-y-1">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#7c6f5e] hover:text-[#c0b8a8] hover:bg-[#ffffff08] transition-colors"
              >
                {link.label} &rarr;
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
