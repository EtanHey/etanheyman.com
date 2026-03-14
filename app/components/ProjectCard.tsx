"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

type CardVariant = "default" | "featured" | "minimal";
type AccentName = "blue" | "violet" | "emerald" | "amber";

type AccentStyles = {
  border: string;
  rail: string;
  glow: string;
  featuredGlow: string;
  statChip: string;
  statValue: string;
  fallbackGradient: string;
};

const TOOL_COUNT_REGEX = /(\d[\d,]*)\+?\s*(?:mcp\s+)?tools?\b/i;
const TEST_COUNT_REGEX = /(\d[\d,]*)\+?\s*tests?\b/i;

const ACCENT_STYLES: Record<AccentName, AccentStyles> = {
  blue: {
    border: "border-blue-300/25",
    rail: "bg-blue-300/85",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(136,207,248,0.35)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(136,207,248,0.48)]",
    statChip: "border-blue-200/50 bg-blue-200/10",
    statValue: "text-blue-100",
    fallbackGradient: "from-blue-500 to-blue-700",
  },
  violet: {
    border: "border-indigo-300/20",
    rail: "bg-indigo-300/70",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(99,102,241,0.25)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(99,102,241,0.35)]",
    statChip: "border-indigo-300/35 bg-indigo-400/10",
    statValue: "text-indigo-100",
    fallbackGradient: "from-indigo-800 to-[#00003F]",
  },
  emerald: {
    border: "border-sky-300/20",
    rail: "bg-sky-300/70",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(56,189,248,0.25)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(56,189,248,0.35)]",
    statChip: "border-sky-300/35 bg-sky-400/10",
    statValue: "text-sky-100",
    fallbackGradient: "from-cyan-800 to-[#00003F]",
  },
  amber: {
    border: "border-slate-300/20",
    rail: "bg-slate-300/70",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(148,163,184,0.25)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(148,163,184,0.35)]",
    statChip: "border-slate-300/35 bg-slate-400/10",
    statValue: "text-slate-100",
    fallbackGradient: "from-slate-700 to-[#00003F]",
  },
};

function parseMetric(text: string, regex: RegExp): number | null {
  const match = text.match(regex);
  if (!match?.[1]) return null;
  const parsed = Number.parseInt(match[1].replaceAll(",", ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferToolsCount(project: Project): number | null {
  return parseMetric(
    `${project.shortDescription} ${project.description}`,
    TOOL_COUNT_REGEX,
  );
}

function inferTestCount(project: Project): number | null {
  return parseMetric(
    `${project.shortDescription} ${project.description}`,
    TEST_COUNT_REGEX,
  );
}

function getProjectAccent(project: Project): AccentName {
  const src =
    `${project.slug ?? ""} ${project.title} ${project.framework ?? ""} ${project.shortDescription}`.toLowerCase();
  if (
    src.includes("brainlayer") ||
    src.includes("memory") ||
    src.includes("search")
  )
    return "violet";
  if (src.includes("voice") || src.includes("audio") || src.includes("speech"))
    return "emerald";
  if (
    src.includes("golem") ||
    src.includes("agent") ||
    src.includes("orchestr")
  )
    return "amber";
  return "blue";
}

function isSvgOrLogoAsset(imageUrl: string | null): imageUrl is string {
  if (!imageUrl) return false;
  return (
    (imageUrl.toLowerCase().endsWith(".svg") &&
      !imageUrl.includes("hand-detection")) ||
    imageUrl.includes("#svg") ||
    imageUrl.includes("#logo")
  );
}

function useHoverCounter(targetValue: number, active: boolean) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const safeTarget = Math.max(0, targetValue);
    if (!active) {
      setValue(0);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(safeTarget);
      return;
    }
    const durationMs = 950;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      setValue(Math.round(safeTarget * (1 - (1 - progress) ** 3)));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [active, targetValue]);

  return value;
}

function StatPill({
  label,
  value,
  accent,
  large,
}: {
  label: "Tools" | "Tests";
  value: number;
  accent: AccentStyles;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-full border backdrop-blur-sm",
        accent.statChip,
        large ? "px-4 py-1.5" : "px-3 py-1",
      )}
    >
      <p
        className={cn(
          "font-mono leading-none",
          accent.statValue,
          large ? "text-[17px]" : "text-[15px]",
        )}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-white/70 uppercase">
        {label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ProjectCardBase — image top, dark text panel bottom               */
/* ------------------------------------------------------------------ */

interface ProjectCardBaseProps {
  project: Project;
  variant: CardVariant;
  priority: boolean;
  sizes: string;
  className?: string;
}

function ProjectCardBase({
  project,
  variant,
  priority,
  sizes,
  className = "",
}: ProjectCardBaseProps) {
  const [isHovering, setIsHovering] = useState(false);

  const accent = ACCENT_STYLES[getProjectAccent(project)];
  const isSvgOrLogo = isSvgOrLogoAsset(project.previewImage);
  const isFeatured = variant === "featured";

  const toolsCount = inferToolsCount(project);
  const testsCount = inferTestCount(project);
  const hasStats = toolsCount !== null || testsCount !== null;
  const animatedTools = useHoverCounter(toolsCount ?? 0, isHovering);
  const animatedTests = useHoverCounter(testsCount ?? 0, isHovering);

  return (
    <Link
      href={`/projects/${project.slug || project.id}`}
      className="group/card block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-500",
          "md:group-hover/card:-translate-y-1",
          accent.border,
          isFeatured ? accent.featuredGlow : accent.glow,
          className,
        )}
      >
        {/* ---- Image zone ---- */}
        <div
          className={cn(
            "relative overflow-hidden bg-gray-900",
            isFeatured ? "aspect-[2.4/1] sm:aspect-[2.2/1]" : "aspect-[16/10]",
          )}
        >
          {project.previewImage ? (
            <>
              {isSvgOrLogo && <div className="absolute inset-0 bg-blue-50" />}
              {isSvgOrLogo ? (
                <img
                  src={project.previewImage
                    .replace("#svg", "")
                    .replace("#logo", "")}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-contain object-center p-8"
                  loading={priority ? "eager" : "lazy"}
                />
              ) : (
                <Image
                  src={project.previewImage}
                  alt={project.title}
                  fill
                  priority={priority}
                  sizes={sizes}
                  className="object-cover object-center transition-transform duration-700 group-hover/card:scale-[1.04]"
                />
              )}
            </>
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                accent.fallbackGradient,
              )}
            >
              {project.logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={project.logoUrl
                      .replace("#svg", "")
                      .replace("#logo", "")}
                    alt={project.title}
                    className="h-[40%] w-[40%] object-contain opacity-30 transition-opacity duration-500 group-hover/card:opacity-50"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          )}

          {/* Framework badge — floats over image */}
          {project.framework && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-block rounded-full bg-[#00003F]/80 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                {project.framework}
              </span>
            </div>
          )}

          {/* Subtle bottom vignette on image for depth */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#00003F]/40 to-transparent" />
        </div>

        {/* ---- Text panel ---- */}
        <div
          className={cn(
            "relative flex flex-1 flex-col bg-[#00003F]",
            isFeatured
              ? "px-6 py-5 md:px-10 md:py-7"
              : "px-5 py-4 md:px-6 md:py-5",
          )}
        >
          {/* Accent rail */}
          <div
            className={cn(
              "absolute top-3 bottom-3 left-0 w-[3px] rounded-r-full transition-opacity duration-300",
              "opacity-60 group-hover/card:opacity-100",
              accent.rail,
            )}
          />

          <h3
            className={cn(
              "font-[Nutmeg] leading-tight font-semibold text-white",
              isFeatured
                ? "text-[20px] sm:text-[24px] md:text-[28px]"
                : "text-[18px] sm:text-[20px] md:text-[22px]",
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "mt-1.5 line-clamp-2 font-[Nutmeg] leading-[1.3] font-light text-white/60",
              isFeatured
                ? "text-[14px] sm:text-[15px] md:text-[16px]"
                : "text-[13px] sm:text-[14px] md:text-[15px]",
            )}
          >
            {project.shortDescription || project.description}
          </p>

          {/* Stats — fade in on hover, no layout shift */}
          {hasStats && (
            <div
              className={cn(
                "mt-auto flex gap-2 pt-3 transition-opacity duration-300",
                "opacity-0 group-hover/card:opacity-100",
                "group-focus-within/card:opacity-100",
              )}
            >
              {toolsCount !== null && (
                <StatPill
                  label="Tools"
                  value={animatedTools}
                  accent={accent}
                  large={isFeatured}
                />
              )}
              {testsCount !== null && (
                <StatPill
                  label="Tests"
                  value={animatedTests}
                  accent={accent}
                  large={isFeatured}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Public exports                                                     */
/* ------------------------------------------------------------------ */

export function ProjectCard({
  project,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw",
  className = "",
}: ProjectCardProps) {
  return (
    <ProjectCardBase
      project={project}
      variant="default"
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}

interface FeaturedProjectCardProps extends Omit<ProjectCardProps, "className"> {
  project: Project;
}

export function FeaturedProjectCard({
  project,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
}: FeaturedProjectCardProps) {
  return (
    <ProjectCardBase
      project={project}
      variant="featured"
      priority={priority}
      sizes={sizes}
    />
  );
}

interface MinimalProjectCardProps extends Omit<ProjectCardProps, "className"> {
  project: Project;
}

export function MinimalProjectCard({
  project,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
}: MinimalProjectCardProps) {
  return (
    <ProjectCardBase
      project={project}
      variant="minimal"
      priority={priority}
      sizes={sizes}
    />
  );
}

export function HomeProjectCard(props: MinimalProjectCardProps) {
  return <MinimalProjectCard {...props} />;
}
