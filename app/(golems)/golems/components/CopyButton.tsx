"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

// Sits in the top-right corner of a kiln (dark) code panel. Always visible so
// keyboard and touch users can find it; the label and icon confirm the copy.
export default function CopyButton({ text, label = "Copy to clipboard" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="g-press g-on-kiln absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md text-g-kiln-muted hover:bg-white/10 hover:text-g-kiln-text"
      aria-label={copied ? "Copied" : label}
      type="button"
    >
      {copied ? (
        <Check aria-hidden="true" className="h-4 w-4 text-g-glaze" />
      ) : (
        <Copy aria-hidden="true" className="h-4 w-4" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
