'use client';

type Correction = {
  label: string;
  aiValue: string | number | null;
  humanValue: string | number | null;
};

type CorrectionBannerProps = {
  corrections: Correction[];
};

export function CorrectionBanner({ corrections }: CorrectionBannerProps) {
  const visible = corrections.filter((item) => item.humanValue !== null && item.humanValue !== undefined);
  if (visible.length === 0) return null;

  const formatValue = (value: string | number | null) => {
    if (value === null || value === undefined) return '-';
    return String(value);
  };

  return (
    <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
      <span className="text-emerald-400 font-medium">Corrected</span>
      <span className="text-white/50 ml-2">
        {visible.map((item) => (
          `${item.label}: ${formatValue(item.aiValue)} → ${formatValue(item.humanValue)}`
        )).join(' | ')}
      </span>
    </div>
  );
}
