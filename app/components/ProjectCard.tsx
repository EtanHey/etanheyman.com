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

type VariantStyles = {
  frame: string;
  contentPadding: string;
  title: string;
  description: string;
  gradientOverlay: string;
};

type AccentStyles = {
  border: string;
  rail: string;
  glow: string;
  featuredGlow: string;
  hoverTint: string;
  statChip: string;
  statValue: string;
  fallbackGradient: string;
};

const TOOL_COUNT_REGEX = /(\d[\d,]*)\+?\s*(?:mcp\s+)?tools?\b/i;
const TEST_COUNT_REGEX = /(\d[\d,]*)\+?\s*tests?\b/i;

const VARIANT_STYLES: Record<CardVariant, VariantStyles> = {
  default: {
    frame: "",
    contentPadding: "p-6 md:p-8",
    title: "text-[20px] sm:text-[24px] md:text-[26px]",
    description: "line-clamp-3 text-[14px] sm:text-[15px] md:text-[16px]",
    gradientOverlay:
      "bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent",
  },
  featured: {
    frame: "h-[320px] sm:h-[380px] md:h-[420px] lg:h-[440px]",
    contentPadding: "p-6 md:px-12 md:py-10",
    title: "text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px]",
    description:
      "line-clamp-2 text-[15px] sm:text-[16px] md:max-w-[622px] md:text-[17px] lg:text-[18px]",
    gradientOverlay:
      "bg-gradient-to-t from-[#00003F] from-[4%] via-[#00003F]/25 via-[50%] to-transparent",
  },
  minimal: {
    frame: "h-[300px] sm:h-[350px] md:aspect-square md:h-auto",
    contentPadding: "p-6 sm:p-8 md:p-8 lg:p-10 xl:px-12 xl:py-10",
    title: "text-[22px] sm:text-[26px] md:text-[24px] lg:text-[28px] xl:text-[32px]",
    description:
      "line-clamp-2 text-[15px] sm:text-[16px] md:text-[16px] lg:text-[17px] xl:text-[18px]",
    gradientOverlay:
      "bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent",
  },
};

const ACCENT_STYLES: Record<AccentName, AccentStyles> = {
  blue: {
    border: "border-blue-300/45",
    rail: "bg-blue-300/85",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(136,207,248,0.35)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(136,207,248,0.48)]",
    hoverTint:
      "after:bg-[radial-gradient(circle_at_24%_14%,rgba(136,207,248,0.18),transparent_56%)]",
    statChip: "border-blue-200/50 bg-blue-200/10",
    statValue: "text-blue-100",
    fallbackGradient: "from-blue-500 to-blue-700",
  },
  violet: {
    border: "border-indigo-300/35",
    rail: "bg-indigo-300/70",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(99,102,241,0.25)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(99,102,241,0.35)]",
    hoverTint:
      "after:bg-[radial-gradient(circle_at_24%_14%,rgba(99,102,241,0.15),transparent_56%)]",
    statChip: "border-indigo-300/35 bg-indigo-400/10",
    statValue: "text-indigo-100",
    fallbackGradient: "from-indigo-800 to-[#00003F]",
  },
  emerald: {
    border: "border-sky-300/35",
    rail: "bg-sky-300/70",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(56,189,248,0.25)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(56,189,248,0.35)]",
    hoverTint:
      "after:bg-[radial-gradient(circle_at_24%_14%,rgba(56,189,248,0.15),transparent_56%)]",
    statChip: "border-sky-300/35 bg-sky-400/10",
    statValue: "text-sky-100",
    fallbackGradient: "from-cyan-800 to-[#00003F]",
  },
  amber: {
    border: "border-slate-300/35",
    rail: "bg-slate-300/70",
    glow: "md:group-hover/card:shadow-[0_0_32px_0_rgba(148,163,184,0.25)]",
    featuredGlow:
      "md:group-hover/card:shadow-[0_0_62px_2px_rgba(148,163,184,0.35)]",
    hoverTint:
      "after:bg-[radial-gradient(circle_at_24%_14%,rgba(148,163,184,0.15),transparent_56%)]",
    statChip: "border-slate-300/35 bg-slate-400/10",
    statValue: "text-slate-100",
    fallbackGradient: "from-slate-700 to-[#00003F]",
  },
};

function parseMetric(text: string, regex: RegExp): number | null {
  const match = text.match(regex);
  if (!match?.[1]) {
    return null;
  }

  const parsed = Number.parseInt(match[1].replaceAll(",", ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferToolsCount(project: Project): number {
  const sourceText = `${project.shortDescription} ${project.description}`;
  const fromText = parseMetric(sourceText, TOOL_COUNT_REGEX);

  if (fromText !== null) {
    return fromText;
  }

  return project.technologies?.length ?? 0;
}

function inferTestCount(project: Project): number {
  const sourceText = `${project.shortDescription} ${project.description}`;
  const fromText = parseMetric(sourceText, TEST_COUNT_REGEX);

  if (fromText !== null) {
    return fromText;
  }

  const journeyBasedCount = (project.projectJourney?.length ?? 0) * 8;
  return journeyBasedCount;
}

function getProjectAccent(project: Project): AccentName {
  const accentSource = `${project.slug ?? ""} ${project.title} ${project.framework ?? ""} ${project.shortDescription}`.toLowerCase();

  if (
    accentSource.includes("brainlayer") ||
    accentSource.includes("memory") ||
    accentSource.includes("search")
  ) {
    return "violet";
  }

  if (
    accentSource.includes("voice") ||
    accentSource.includes("audio") ||
    accentSource.includes("speech")
  ) {
    return "emerald";
  }

  if (
    accentSource.includes("golem") ||
    accentSource.includes("agent") ||
    accentSource.includes("orchestr")
  ) {
    return "amber";
  }

  return "blue";
}

function isSvgOrLogoAsset(imageUrl: string | null): imageUrl is string {
  if (!imageUrl) {
    return false;
  }

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
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
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
      const easedProgress = 1 - (1 - progress) ** 3;
      setValue(Math.round(safeTarget * easedProgress));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active, targetValue]);

  return value;
}

interface StatPillProps {
  label: "Tools" | "Tests";
  value: number;
  accent: AccentStyles;
  variant: CardVariant;
}

function StatPill({ label, value, accent, variant }: StatPillProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border backdrop-blur-sm",
        accent.statChip,
        variant === "featured" ? "px-4 py-2" : "px-3 py-1.5",
      )}
    >
      <p
        className={cn(
          "font-mono leading-none",
          accent.statValue,
          variant === "featured" ? "text-[18px]" : "text-[16px]",
        )}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80">
        {label}
      </p>
    </div>
  );
}

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

  const variantStyles = VARIANT_STYLES[variant];
  const accent = ACCENT_STYLES[getProjectAccent(project)];
  const isSvgOrLogo = isSvgOrLogoAsset(project.previewImage);

  const animatedTools = useHoverCounter(inferToolsCount(project), isHovering);
  const animatedTests = useHoverCounter(inferTestCount(project), isHovering);

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
          "relative overflow-hidden rounded-[40px] border border-white/70 bg-gray-900 shadow-lg transition-all duration-500",
          "hover:scale-[1.02] md:hover:scale-100",
          "after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:opacity-0 after:transition-opacity after:duration-500",
          "group-hover/card:after:opacity-100 group-focus-within/card:after:opacity-100",
          variant === "featured"
            ? "md:group-hover/card:-translate-y-1.5"
            : "md:group-hover/card:-translate-y-1",
          variantStyles.frame,
          accent.border,
          variant === "featured" ? accent.featuredGlow : accent.glow,
          accent.hoverTint,
          className,
        )}
      >
        {/* Background image */}
        {project.previewImage ? (
          <>
            {isSvgOrLogo && <div className="absolute inset-0 bg-blue-50" />}

            {isSvgOrLogo ? (
              <img
                src={project.previewImage.replace("#svg", "").replace("#logo", "")}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-contain object-center p-12"
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <Image
                src={project.previewImage}
                alt={project.title}
                fill
                priority={priority}
                sizes={sizes}
                className={cn(
                  "object-cover object-center transition-transform duration-700",
                  variant === "featured"
                    ? "group-hover/card:scale-[1.06]"
                    : "group-hover/card:scale-[1.03]",
                )}
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
            {/* Show logo centered on gradient when no preview image */}
            {project.logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={project.logoUrl.replace("#svg", "").replace("#logo", "")}
                  alt={project.title}
                  className="h-[40%] w-[40%] object-contain opacity-30 transition-opacity duration-500 group-hover/card:opacity-50"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {/* Bottom readability overlay */}
        <div className={cn("absolute inset-0", variantStyles.gradientOverlay)} />

        {/* Featured cards get a stronger highlight pass */}
        {variant === "featured" && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.15)_0%,transparent_42%)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-focus-within/card:opacity-100" />
        )}

        {/* Accent rail */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-8 left-0 top-8 w-[3px] rounded-r-full transition-opacity duration-300",
            "opacity-80 group-hover/card:opacity-100 group-focus-within/card:opacity-100",
            accent.rail,
          )}
        />

        {/* Content container */}
        <div className={cn("absolute inset-0 flex flex-col", variantStyles.contentPadding)}>
          {project.framework && (
            <div className="mb-auto flex justify-end">
              <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                {project.framework}
              </span>
            </div>
          )}

          <div className="flex-grow" />

          <div className="relative">
            <div
              className={cn(
                "pointer-events-none absolute bottom-full left-0 flex translate-y-2 opacity-0 transition-all duration-300",
                "group-hover/card:translate-y-0 group-hover/card:opacity-100",
                "group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100",
                variant === "featured" ? "mb-4 gap-3" : "mb-3 gap-2",
              )}
            >
              <StatPill
                label="Tools"
                value={animatedTools}
                accent={accent}
                variant={variant}
              />
              <StatPill
                label="Tests"
                value={animatedTests}
                accent={accent}
                variant={variant}
              />
            </div>

            <h3 className={cn("font-[Nutmeg] font-semibold text-white", variantStyles.title)}>
              {project.title}
            </h3>
            <p
              className={cn(
                "mt-2 font-[Nutmeg] font-light leading-[1.2] text-white",
                variantStyles.description,
              )}
            >
              {project.shortDescription || project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProjectCard({
  project,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
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

interface FeaturedProjectCardProps extends Omit<ProjectCardProps, 'className'> {
  project: Project;
}

export function FeaturedProjectCard({
  project,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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

interface MinimalProjectCardProps extends Omit<ProjectCardProps, 'className'> {
  project: Project;
}

export function MinimalProjectCard({
  project,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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