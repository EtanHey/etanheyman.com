"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialLinks } from "./SocialLinks";

const Footer = () => {
  const pathname = usePathname();

  // Hide footer for golem admin dashboard (full-screen app)
  if (pathname?.startsWith("/admin/golem")) {
    return null;
  }

  return (
    <footer
      className="relative z-10 w-full bg-blue-800 px-6 py-8 md:px-12 md:py-10"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-5xl">
        {/* Nav Links — centered row */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          <Link
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            href="/projects"
          >
            Projects
          </Link>
          <Link
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            href="/accessibility"
          >
            Accessibility
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-white/10" />

        {/* Bottom row: social + credits */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <SocialLinks
            className="flex items-center gap-3"
            iconContainerClassName="flex items-center justify-center p-1.5 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]"
          />
          <p className="text-center text-xs font-medium text-white/50 md:text-right">
            &copy; {new Date().getFullYear()} Etan Heyman &middot; Designed by{" "}
            <Link
              href="https://www.productdz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline transition-colors hover:text-white"
            >
              ProductDZ
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
