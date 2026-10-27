"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Github, Globe } from "lucide-react";
import type { CardMedia, CardStat, ProjectCardModel } from "@/lib/project-card";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "featured" | "minimal";

// AIDEV-NOTE: One easing for the whole card (strong ease-out). Hover-style
// effects are gated by Tailwind v4's `hover:` media query, so touch devices
// never get stuck in a hover state; signals are always visible instead.
const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";
const REVEAL_STAGGER_MS = 80;
const COUNT_UP_MS = 900;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Flips to true the first time the element scrolls into view. */
function useRevealOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, revealed] as const;
}

/**
 * Counts up once when the card is revealed. Starts at the final value so the
 * server render (and screen readers) always carry the real number.
 */
function useCountUpOnce(target: number, active: boolean, delayMs: number) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let frame = 0;
    const startAt = performance.now() + delayMs;
    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - startAt) / COUNT_UP_MS, 0), 1);
      setValue(target * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, delayMs]);

  return value;
}

function StatChip({
  stat,
  active,
  delayMs,
}: {
  stat: CardStat;
  active: boolean;
  delayMs: number;
}) {
  const value = useCountUpOnce(stat.value, active, delayMs);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: stat.decimals,
    maximumFractionDigits: stat.decimals,
  });

  return (
    <li className="inline-flex items-baseline gap-1.5 rounded-full border border-[rgba(var(--card-accent),0.35)] bg-[rgba(var(--card-accent),0.1)] px-3 py-1">
      <span className="text-[14px] font-semibold text-white tabular-nums md:text-[15px]">
        {stat.prefix}
        {formatted}
        {stat.suffix}
      </span>
      <span className="text-[12px] font-light text-white/70 md:text-[13px]">
        {stat.label}
      </span>
    </li>
  );
}

function StackChip({ children, muted }: { children: string; muted?: boolean }) {
  return (
    <li
      className={cn(
        "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] md:text-[13px]",
        muted ? "text-white/50" : "text-white/75",
      )}
    >
      {children}
    </li>
  );
}

function PlateContent({
  media,
  title,
  priority,
}: {
  media: CardMedia;
  title: string;
  priority: boolean;
}) {
  if (media.kind === "monogram") {
    return (
      <span
        aria-hidden
        className="flex h-full w-full items-center justify-center text-[clamp(28px,22cqh,72px)] font-semibold tracking-tight text-blue-700"
      >
        {media.text}
      </span>
    );
  }
  if (media.kind === "mark") {
    return (
      // Vector marks render as-is; next/image would refuse remote SVGs.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt={title}
        className="h-full w-full object-contain p-[16%]"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }
  return (
    <Image
      src={media.src}
      alt={title}
      fill
      priority={priority}
      sizes="(max-width: 768px) 180px, 280px"
      className="object-cover"
    />
  );
}

export function ProjectCardView({
  card,
  variant,
  priority,
  revealIndex = 0,
  className,
}: {
  card: ProjectCardModel;
  variant: CardVariant;
  priority: boolean;
  revealIndex?: number;
  className?: string;
}) {
  const [revealRef, revealed] = useRevealOnce<HTMLDivElement>();
  const isFeatured = variant === "featured";
  const revealDelayMs = (revealIndex % 2) * REVEAL_STAGGER_MS;
  const { signals, links } = card;

  return (
    <div
      ref={revealRef}
      data-revealed={revealed}
      style={{ transitionDelay: `${revealDelayMs}ms` }}
      className={cn(
        "h-full translate-y-4 opacity-0 transition-[opacity,translate] duration-700 motion-reduce:translate-y-0",
        EASE_OUT,
        "data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100",
        className,
      )}
    >
      <Link
        href={card.href}
        style={{ "--card-accent": card.accentRgb } as CSSProperties}
        className={cn(
          "group/card block h-full rounded-3xl",
          "transition-transform duration-150 ease-out active:scale-[0.985]",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200",
        )}
      >
        <div
          className={cn(
            "relative h-full transition-transform duration-300",
            EASE_OUT,
            "motion-safe:group-hover/card:-translate-y-1 motion-safe:group-focus-visible/card:-translate-y-1",
          )}
        >
          {/* Accent glow: opacity-only so hover never repaints a box-shadow */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 ease-out",
              "group-hover/card:opacity-100 group-focus-visible/card:opacity-100",
              isFeatured
                ? "shadow-[0_0_64px_4px_rgba(var(--card-accent),0.4)]"
                : "shadow-[0_0_36px_0_rgba(var(--card-accent),0.35)]",
            )}
          />

          <article
            className={cn(
              "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-[#00003F] transition-colors duration-300 ease-out",
              "border-[rgba(var(--card-accent),0.22)] group-hover/card:border-[rgba(var(--card-accent),0.5)] group-focus-visible/card:border-[rgba(var(--card-accent),0.5)]",
              isFeatured && "md:flex-row",
            )}
          >
            {/* ---- Stage: the project's mark on a leaf plate ---- */}
            <div
              className={cn(
                "relative isolate flex shrink-0 items-center justify-center overflow-hidden bg-blue-800/60 [container-type:size]",
                isFeatured
                  ? "aspect-[16/10] md:aspect-auto md:min-h-[340px] md:w-[50%]"
                  : "aspect-[16/10]",
              )}
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 ease-out group-hover/card:opacity-100"
                style={{
                  background:
                    "radial-gradient(55% 65% at 50% 55%, rgba(var(--card-accent), 0.32), transparent 72%)",
                }}
              />

              {/* Same leaf silhouette and white rim as the home portrait */}
              <div
                className={cn(
                  "relative aspect-square overflow-hidden rounded-[42%] rounded-tr-[10%] border-4 border-white bg-blue-50",
                  "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] transition-transform duration-500",
                  EASE_OUT,
                  "motion-safe:group-hover/card:scale-[1.04] motion-safe:group-focus-visible/card:scale-[1.04]",
                  isFeatured ? "h-[64%]" : "h-[68%]",
                )}
              >
                <PlateContent
                  media={card.media}
                  title={card.title}
                  priority={priority}
                />
              </div>

              {card.framework && (
                <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-[#00003F]/75 px-3 py-1 text-[12px] text-white/85 md:top-4 md:right-4 md:text-[13px]">
                  {card.framework}
                </span>
              )}
            </div>

            {/* ---- Panel ---- */}
            <div
              className={cn(
                "relative flex flex-1 flex-col",
                isFeatured
                  ? "px-6 py-6 md:justify-center md:px-10 md:py-9"
                  : "px-5 py-5 md:px-6 md:py-6",
              )}
            >
              <div
                aria-hidden
                className="absolute top-5 bottom-5 left-0 w-[3px] rounded-r-full bg-[rgb(var(--card-accent))] opacity-60 transition-opacity duration-300 ease-out group-hover/card:opacity-100"
              />

              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "leading-tight font-semibold text-white",
                      isFeatured
                        ? "text-[22px] sm:text-[26px] md:text-[32px]"
                        : "text-[19px] sm:text-[20px] md:text-[22px]",
                    )}
                  >
                    {card.name}
                  </h3>
                  {card.subtitle && (
                    <p
                      className={cn(
                        "mt-1 leading-snug font-light text-blue-200",
                        isFeatured
                          ? "text-[15px] md:text-[18px]"
                          : "text-[14px] md:text-[15px]",
                      )}
                    >
                      {card.subtitle}
                    </p>
                  )}
                </div>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 md:size-10",
                    "transition-[background-color,border-color,color,translate] duration-300",
                    EASE_OUT,
                    "group-hover/card:translate-x-0.5 group-hover/card:border-white group-hover/card:bg-white group-hover/card:text-[#00003F]",
                    "group-focus-visible/card:border-white group-focus-visible/card:bg-white group-focus-visible/card:text-[#00003F]",
                  )}
                >
                  <ArrowRight className="size-4 md:size-[18px]" />
                </span>
              </div>

              <p
                className={cn(
                  "mt-3 leading-[1.4] font-light text-white/65",
                  isFeatured
                    ? "line-clamp-3 text-[14px] sm:text-[15px] md:text-[17px]"
                    : "line-clamp-2 text-[13px] sm:text-[14px] md:text-[15px]",
                )}
              >
                {card.summary}
              </p>

              <div
                className={cn(
                  "flex items-center justify-between gap-3 border-t border-white/10 pt-4",
                  isFeatured ? "mt-6" : "mt-auto",
                )}
              >
                <ul
                  aria-label={signals.kind === "stats" ? "Highlights" : "Built with"}
                  className="flex min-w-0 flex-wrap gap-2"
                >
                  {signals.kind === "stats"
                    ? signals.stats.map((stat, index) => (
                        <StatChip
                          key={stat.label}
                          stat={stat}
                          active={revealed}
                          delayMs={revealDelayMs + index * 120}
                        />
                      ))
                    : signals.items.map((item) => (
                        <StackChip key={item}>{item}</StackChip>
                      ))}
                  {signals.kind === "stack" && signals.overflow > 0 && (
                    <StackChip muted>{`+${signals.overflow}`}</StackChip>
                  )}
                </ul>

                <span className="flex shrink-0 items-center gap-2.5 text-white/50">
                  {links.live && (
                    <span title="Live site">
                      <Globe aria-hidden className="size-4" />
                      <span className="sr-only">Live site</span>
                    </span>
                  )}
                  {links.docs && (
                    <span title="Documentation">
                      <BookOpen aria-hidden className="size-4" />
                      <span className="sr-only">Documentation</span>
                    </span>
                  )}
                  {links.source && (
                    <span title="Open source">
                      <Github aria-hidden className="size-4" />
                      <span className="sr-only">Open source</span>
                    </span>
                  )}
                </span>
              </div>
            </div>
          </article>
        </div>
      </Link>
    </div>
  );
}
