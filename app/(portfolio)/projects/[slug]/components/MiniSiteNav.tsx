"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MiniSiteNavProps {
  slug: string;
  accentColor: string;
  accentColorRgb: string;
}

const tabs = [
  { label: "Overview", path: "" },
  { label: "Architecture", path: "/architecture" },
  { label: "Features", path: "/features" },
  { label: "Get Started", path: "/docs" },
] as const;

export function MiniSiteNav({
  slug,
  accentColor,
  accentColorRgb,
}: MiniSiteNavProps) {
  const pathname = usePathname();
  const basePath = `/projects/${slug}`;

  return (
    <div className="sticky top-[88px] z-40 w-full self-stretch">
      <nav
        className="border-b border-white/[0.06] bg-[#00003F]/95 backdrop-blur-xl"
        style={{
          boxShadow: `0 1px 0 0 rgba(${accentColorRgb}, 0.08), 0 4px 12px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <div className="mx-auto flex max-w-5xl overflow-x-auto px-4 md:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const href = `${basePath}${tab.path}`;
            const isActive =
              tab.path === ""
                ? pathname === basePath || pathname === `${basePath}/`
                : pathname.startsWith(href);

            return (
              <Link
                key={tab.label}
                href={href}
                className={`relative shrink-0 px-5 py-3.5 font-mono text-[12px] tracking-[0.15em] uppercase transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab.label}
                {/* Active underline */}
                <span
                  className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: accentColor,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
