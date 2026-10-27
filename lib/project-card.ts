import type { Project } from "./projects";

// AIDEV-NOTE: Pure view-model for project cards. Every card, rich or plain,
// gets the same anatomy (plate, name, subtitle, summary, signal row, link
// indicators); only the content of each slot varies. Kept free of React and
// of the showcase config import so the client bundle never pulls in the
// skills manifest — the server card resolves the showcase and passes it in.

/** blue-200 (#88CFF8), the portfolio's headline blue. */
export const DEFAULT_CARD_ACCENT_RGB = "136, 207, 248";

const STACK_LIMIT = 3;
const STAT_LIMIT = 2;

export interface CardShowcase {
  accentRgb: string;
  stats: { value: number; prefix?: string; suffix?: string; label: string }[];
}

export interface CardStat {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  decimals: number;
}

export type CardMedia =
  | { kind: "mark"; src: string }
  | { kind: "tile"; src: string }
  | { kind: "monogram"; text: string };

export type CardSignals =
  | { kind: "stats"; stats: CardStat[] }
  | { kind: "stack"; items: string[]; overflow: number };

export interface ProjectCardModel {
  href: string;
  title: string;
  name: string;
  subtitle: string | null;
  summary: string;
  framework: string | null;
  accentRgb: string;
  media: CardMedia;
  signals: CardSignals;
  links: { live: boolean; source: boolean; docs: boolean };
}

/** "BrainLayer — Persistent Memory" → name "BrainLayer", subtitle "Persistent Memory". */
export function splitProjectTitle(title: string): {
  name: string;
  subtitle: string | null;
} {
  const match = title.match(/^(.+?)\s+[—–-]\s+(.+)$/);
  if (!match) return { name: title.trim(), subtitle: null };
  return { name: match[1].trim(), subtitle: match[2].trim() };
}

export function getProjectMonogram(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /^[a-z]/i.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function isVectorMark(url: string): boolean {
  return (
    url.includes("#svg") ||
    url.includes("#logo") ||
    url.split("#")[0].toLowerCase().endsWith(".svg")
  );
}

// Every preview in the live data is a logo: vector marks sit on the plate
// with padding, raster tiles (square app-icon style art) fill it.
function getCardMedia(project: Project, name: string): CardMedia {
  const url = project.previewImage || project.logoUrl;
  if (!url) return { kind: "monogram", text: getProjectMonogram(name) };
  const src = url.replace(/#(svg|logo)$/, "");
  return isVectorMark(url) ? { kind: "mark", src } : { kind: "tile", src };
}

function countDecimals(value: number): number {
  const fraction = String(value).split(".")[1];
  return fraction ? fraction.length : 0;
}

function getCardSignals(
  project: Project,
  showcase: CardShowcase | null,
): CardSignals {
  if (showcase && showcase.stats.length > 0) {
    return {
      kind: "stats",
      stats: showcase.stats.slice(0, STAT_LIMIT).map((stat) => ({
        value: stat.value,
        prefix: stat.prefix ?? "",
        suffix: stat.suffix ?? "",
        label: stat.label,
        decimals: countDecimals(stat.value),
      })),
    };
  }
  const technologies = project.technologies ?? [];
  return {
    kind: "stack",
    items: technologies.slice(0, STACK_LIMIT),
    overflow: Math.max(0, technologies.length - STACK_LIMIT),
  };
}

export function deriveProjectCard(
  project: Project,
  showcase: CardShowcase | null,
): ProjectCardModel {
  const { name, subtitle } = splitProjectTitle(project.title);
  return {
    href: `/projects/${project.slug || project.id}`,
    title: project.title,
    name,
    subtitle,
    summary: project.shortDescription || project.description,
    framework: project.framework,
    accentRgb: showcase?.accentRgb ?? DEFAULT_CARD_ACCENT_RGB,
    media: getCardMedia(project, name),
    signals: getCardSignals(project, showcase),
    links: {
      live: Boolean(project.liveUrl),
      source: Boolean(project.gitUrl) && project.gitUrl !== "private",
      docs: Boolean(project.docsUrl),
    },
  };
}
