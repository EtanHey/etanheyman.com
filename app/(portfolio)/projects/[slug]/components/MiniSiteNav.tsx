"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

interface MiniSiteNavProps {
  slug: string;
  accentColor: string;
  accentColorRgb: string;
  title: string;
  logoUrl: string | null;
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
  title,
  logoUrl,
}: MiniSiteNavProps) {
  const pathname = usePathname();
  const basePath = `/projects/${slug}`;
  const isOverview = pathname === basePath || pathname === `${basePath}/`;

  const isSvg =
    logoUrl &&
    (logoUrl.toLowerCase().endsWith(".svg") ||
      logoUrl.includes("#svg") ||
      logoUrl.includes("#logo"));
  const cleanLogoUrl = logoUrl?.replace("#svg", "").replace("#logo", "");

  return (
    <div className="sticky top-[88px] z-40 w-full self-stretch">
      <nav
        className="border-b border-white/[0.06] bg-[#00003F]/95 backdrop-blur-xl"
        style={{
          boxShadow: `0 1px 0 0 rgba(${accentColorRgb}, 0.08), 0 4px 12px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center px-4 md:px-8">
          {/* Left: Back link */}
          <Link
            href={isOverview ? "/projects" : basePath}
            className="mr-3 flex shrink-0 items-center gap-1.5 py-3.5 font-mono text-[11px] tracking-wide text-white/30 transition-colors hover:text-white/55 md:mr-4"
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="hidden sm:inline">
              {isOverview ? "All Projects" : "Overview"}
            </span>
          </Link>

          {/* Divider */}
          <div className="mr-3 h-4 w-px shrink-0 bg-white/10 md:mr-4" />

          {/* Project identity */}
          {isOverview ? (
            <span className="mr-2 flex shrink-0 items-center gap-2.5">
              {cleanLogoUrl && (
                <div className="relative h-[28px] w-[28px] flex-shrink-0 overflow-hidden rounded-lg">
                  {isSvg ? (
                    <>
                      <div className="absolute inset-0 bg-blue-50" />
                      <img
                        src={cleanLogoUrl}
                        alt={`${title} logo`}
                        className="relative h-full w-full object-contain p-1"
                      />
                    </>
                  ) : (
                    <Image
                      src={cleanLogoUrl}
                      alt={`${title} logo`}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              )}
              <span className="hidden font-[Nutmeg] text-[14px] font-bold text-white/70 sm:inline">
                {title}
              </span>
            </span>
          ) : (
            <Link
              href={basePath}
              className="mr-2 flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              {cleanLogoUrl && (
                <div className="relative h-[28px] w-[28px] flex-shrink-0 overflow-hidden rounded-lg">
                  {isSvg ? (
                    <>
                      <div className="absolute inset-0 bg-blue-50" />
                      <img
                        src={cleanLogoUrl}
                        alt={`${title} logo`}
                        className="relative h-full w-full object-contain p-1"
                      />
                    </>
                  ) : (
                    <Image
                      src={cleanLogoUrl}
                      alt={`${title} logo`}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              )}
              <span className="hidden font-[Nutmeg] text-[14px] font-bold text-white/70 sm:inline">
                {title}
              </span>
            </Link>
          )}

          {/* Tabs — scrollable on mobile, all visible on desktop */}
          <div className="flex min-w-0 flex-1 overflow-x-auto md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  className={`relative shrink-0 px-3 py-3.5 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 md:px-4 md:text-[12px] md:tracking-[0.15em] ${
                    isActive
                      ? "text-white"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  {tab.label}
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ease-out md:left-4 md:right-4"
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
        </div>
      </nav>
    </div>
  );
}
