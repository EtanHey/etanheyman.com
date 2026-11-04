import Link from "next/link";
import { CONTACT_INFO } from "@/app/hooks/useRegion";

export const SOCIAL_LINKS = [
  { href: "https://github.com/EtanHey", label: "GitHub" },
  { href: "https://www.linkedin.com/in/etanheyman", label: "LinkedIn" },
  { href: `https://wa.me/${CONTACT_INFO.whatsapp}`, label: "WhatsApp" },
  { href: "https://www.facebook.com/etanheyman", label: "Facebook" },
] as const;

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/golems", label: "Golems docs" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="pf-footer" aria-label="Site footer">
      <div className="pf-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <p className="text-[22px] font-bold">Etan Heyman</p>
          <p className="pf-small mt-2 max-w-[28em]">
            AI engineer in {CONTACT_INFO.location}. Building open-source tools for AI agents.
          </p>
          <p className="pf-small mt-6">
            &copy; {new Date().getFullYear()} Etan Heyman. Original site design by{" "}
            <a
              href="https://www.productdz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="pf-link"
            >
              ProductDZ
            </a>
            .
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="pf-small">This site</h2>
          <ul className="mt-3 grid gap-2">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="pf-link text-[16px]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="pf-small">Elsewhere</h2>
          <ul className="mt-3 grid gap-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="pf-link text-[16px]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
