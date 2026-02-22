"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { GettingStartedStep } from "../getting-started-config";

interface Props {
  step: GettingStartedStep;
  accentColor: string;
  accentColorRgb: string;
  isLast: boolean;
}

export function StepCard({ step, accentColor, accentColorRgb, isLast }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCopy = async () => {
    if (!step.command) return;
    await navigator.clipboard.writeText(step.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={ref}
      className="relative flex gap-5 md:gap-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
        transitionDelay: `${step.step * 80}ms`,
      }}
    >
      {/* Step number + line */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold"
          style={{
            backgroundColor: `rgba(${accentColorRgb}, 0.15)`,
            color: accentColor,
          }}
        >
          {step.step}
        </div>
        {!isLast && (
          <div
            className="mt-2 w-px flex-1"
            style={{
              backgroundColor: `rgba(${accentColorRgb}, 0.1)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${!isLast ? "pb-10" : ""}`}>
        <h3 className="mb-2 font-[Nutmeg] text-[17px] font-semibold text-white md:text-[19px]">
          {step.title}
        </h3>

        {step.description && (
          <p className="mb-4 max-w-[580px] font-[Nutmeg] text-[13px] font-light leading-relaxed text-white/45 md:text-[14px]">
            {step.description}
          </p>
        )}

        {step.command && (
          <div
            className="mb-3 overflow-hidden rounded-lg border"
            style={{
              borderColor: `rgba(${accentColorRgb}, 0.1)`,
              backgroundColor: "#080828",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-3 py-1.5"
              style={{ borderColor: `rgba(${accentColorRgb}, 0.06)` }}
            >
              <span className="font-mono text-[10px] text-white/25">
                {step.language ?? "bash"}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-1.5 py-0.5 text-white/25 transition-colors hover:text-white/50"
              >
                {copied ? (
                  <Check
                    className="h-3 w-3"
                    style={{ color: accentColor }}
                  />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span className="font-mono text-[9px]">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-white/65 md:text-[13px]">
              <code>{step.command}</code>
            </pre>
          </div>
        )}

        {step.note && (
          <p
            className="flex items-start gap-2 font-mono text-[11px] leading-relaxed md:text-[12px]"
            style={{ color: `rgba(${accentColorRgb}, 0.5)` }}
          >
            <span className="mt-0.5 flex-shrink-0">*</span>
            {step.note}
          </p>
        )}
      </div>
    </div>
  );
}
