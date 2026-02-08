import type { LucideIcon } from 'lucide-react';
import { Archive, Bookmark, Eye, Send, Star, X } from 'lucide-react';

// --- Email ---

export const categoryColors: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
  'tech-update': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  job: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  interview: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  newsletter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  promo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  subscription: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  other: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export const EMAIL_CATEGORIES = [
  'urgent', 'tech-update', 'job', 'interview', 'newsletter',
  'promo', 'subscription', 'social', 'other',
];

export function scoreColor(score: number | null): string {
  if (score === null || score === undefined) return 'text-white/30';
  if (score >= 8) return 'text-red-400';
  if (score >= 6) return 'text-amber-400';
  if (score >= 4) return 'text-white/60';
  return 'text-white/30';
}

// --- Jobs ---

export type JobStatus = 'new' | 'viewed' | 'saved' | 'applied' | 'rejected' | 'archived';

export const statusConfig: Record<JobStatus, { label: string; color: string; cardBorder: string; icon: LucideIcon }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', cardBorder: 'border-l-blue-500', icon: Star },
  viewed: { label: 'Viewed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', cardBorder: 'border-l-gray-500', icon: Eye },
  saved: { label: 'Saved', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', cardBorder: 'border-l-amber-500', icon: Bookmark },
  applied: { label: 'Applied', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', cardBorder: 'border-l-emerald-500', icon: Send },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30', cardBorder: 'border-l-red-500', icon: X },
  archived: { label: 'Archived', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', cardBorder: 'border-l-zinc-500', icon: Archive },
};

export const statusPriority: Record<JobStatus, number> = {
  applied: 1,
  saved: 2,
  new: 3,
  viewed: 4,
  rejected: 5,
  archived: 6,
};

export const sourceConfig: Record<string, { label: string; color: string }> = {
  secretTLV: { label: 'SecretTLV', color: 'text-purple-400' },
  indeed: { label: 'Indeed', color: 'text-blue-400' },
  drushim: { label: 'Drushim', color: 'text-orange-400' },
  goozali: { label: 'Goozali', color: 'text-green-400' },
};

// --- Activity (golems) ---

export const actorColors: Record<string, string> = {
  emailgolem: 'text-blue-400',
  jobgolem: 'text-emerald-400',
  claudegolem: 'text-violet-400',
  recruitergolem: 'text-amber-400',
  ollamagolem: 'text-rose-400',
  nightshift: 'text-indigo-400',
};

export const actorBgColors: Record<string, { bg: string; text: string }> = {
  emailgolem: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  jobgolem: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  claudegolem: { bg: 'bg-violet-500/20', text: 'text-violet-400' },
  recruitergolem: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  ollamagolem: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  nightshift: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
};

export const eventTypeLabels: Record<string, string> = {
  email_routed: 'Email routed',
  job_match: 'Job match',
  soltome_post: 'Content post',
  draft_approved: 'Draft approved',
  draft_rejected: 'Draft rejected',
  draft_scored: 'Drafts scored',
  pattern_extracted: 'Patterns found',
  email_alert: 'Email alert',
  nightshift_pr: 'Night Shift PR',
  outreach_draft: 'Outreach draft',
  contact_found: 'Contact found',
};
