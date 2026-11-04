"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NAV_LINKS = [
  { href: "/projects", label: "Work" },
  { href: "/#skills", label: "Skills" },
  { href: "/about", label: "About" },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="pf-nav">
      <a href="#main" className="pf-skip">
        Skip to content
      </a>
      <div className="pf-container flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link
          href="/"
          className="text-[20px] font-bold tracking-[-0.01em] text-[var(--pf-ice)] md:text-[22px]"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Etan Heyman
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="pf-nav-link"
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="pf-btn pf-btn-primary min-h-[42px] px-5 py-2 text-[16px]"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
        </nav>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger className="pf-btn pf-btn-ghost min-h-[44px] px-4 py-2 text-[16px] md:hidden">
            <Menu aria-hidden="true" className="h-5 w-5" />
            Menu
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="pf-overlay md:hidden" />
            <Dialog.Content className="pf-root pf-sheet md:hidden" aria-describedby={undefined}>
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-[18px] font-bold">Etan Heyman</Dialog.Title>
                <Dialog.Close className="pf-btn pf-btn-ghost min-h-[44px] px-4 py-2 text-[16px]">
                  <X aria-hidden="true" className="h-5 w-5" />
                  Close
                </Dialog.Close>
              </div>
              <nav aria-label="Main" className="mt-6 flex flex-col">
                {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-[var(--pf-line)] py-4 text-[24px] font-bold"
                    aria-current={
                      link.href === "/" ? (pathname === "/" ? "page" : undefined) : isCurrent(pathname, link.href) ? "page" : undefined
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="pf-btn pf-btn-primary mt-6 w-full"
              >
                Contact
              </Link>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
