"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export function SubpageHeader({
  slug,
  title,
  logoUrl,
}: {
  slug: string;
  title: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const basePath = `/projects/${slug}`;

  // Hide on overview page — it has its own hero section
  const isOverview = pathname === basePath || pathname === `${basePath}/`;
  if (isOverview) return null;

  const isSvg =
    logoUrl &&
    (logoUrl.toLowerCase().endsWith(".svg") ||
      logoUrl.includes("#svg") ||
      logoUrl.includes("#logo"));
  const cleanLogoUrl = logoUrl
    ?.replace("#svg", "")
    .replace("#logo", "");

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-0 md:px-8">
      <div className="flex items-center gap-3">
        <Link
          href={basePath}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {cleanLogoUrl && (
            <div className="relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-xl">
              {isSvg ? (
                <>
                  <div className="absolute inset-0 bg-blue-50" />
                  <img
                    src={cleanLogoUrl}
                    alt={`${title} logo`}
                    className="relative h-full w-full object-contain p-1.5"
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
          <span className="font-[Nutmeg] text-[16px] font-bold text-white/70 md:text-[18px]">
            {title}
          </span>
        </Link>
        <ArrowLeft className="h-3 w-3 rotate-180 text-white/25" />
      </div>
    </div>
  );
}
