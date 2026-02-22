"use client";

import { useState } from "react";
import { Terminal, Check } from "lucide-react";

export function TaglineBadge({
  tagline,
  accentColor,
  accentColorRgb,
}: {
  tagline: string;
  accentColor: string;
  accentColorRgb: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tagline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] transition-colors hover:brightness-125 md:text-[13px]"
      style={{
        borderColor: `rgba(${accentColorRgb}, 0.3)`,
        color: accentColor,
        backgroundColor: `rgba(${accentColorRgb}, 0.08)`,
      }}
      title="Click to copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Terminal className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : tagline}
    </button>
  );
}
