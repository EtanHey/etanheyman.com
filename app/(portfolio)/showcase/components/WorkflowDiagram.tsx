"use client";

import { useEffect, useRef, useState } from "react";
import {
  Terminal,
  Repeat,
  GitPullRequest,
  Zap,
  Moon,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Terminal,
  Repeat,
  GitPullRequest,
  Zap,
  Moon,
};

interface WorkflowStep {
  iconName: string;
  title: string;
  description: string;
}

interface Props {
  steps: WorkflowStep[];
}

export function WorkflowDiagram({ steps }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <div ref={ref}>
      {/* Desktop: horizontal flow */}
      <div className="hidden md:block">
        <div className="flex items-stretch gap-0">
          {steps.map((step, i) => {
            const Icon = ICONS[step.iconName];
            return (
              <div key={step.title} className="flex flex-1 items-center">
                <div
                  className="relative flex w-full flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-5 transition-all"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transitionDelay: `${i * 120}ms`,
                    transitionDuration: "500ms",
                  }}
                >
                  {/* Step number */}
                  <span className="absolute -top-2.5 left-3 rounded bg-[#0F82EB]/15 px-1.5 py-0.5 font-mono text-[9px] text-[#0F82EB]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F82EB]/10">
                    <Icon className="h-4 w-4 text-[#0F82EB]" />
                  </div>
                  <div className="text-center">
                    <p className="font-[Nutmeg] text-[12px] font-semibold text-white/85">
                      {step.title}
                    </p>
                    <p className="mt-1 font-mono text-[9px] leading-tight text-white/30">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector arrow */}
                {i < steps.length - 1 && (
                  <div className="flex-shrink-0 px-1">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <line
                        x1="0"
                        y1="8"
                        x2="16"
                        y2="8"
                        stroke="#0F82EB"
                        strokeWidth="1.2"
                        strokeOpacity={visible ? 0.3 : 0}
                        strokeDasharray="3 3"
                        style={{
                          transition: "stroke-opacity 400ms",
                          transitionDelay: `${(i + 1) * 120 + 200}ms`,
                        }}
                      />
                      <path
                        d="M 14 4 L 20 8 L 14 12"
                        stroke="#0F82EB"
                        strokeWidth="1.2"
                        fill="none"
                        strokeOpacity={visible ? 0.4 : 0}
                        style={{
                          transition: "stroke-opacity 400ms",
                          transitionDelay: `${(i + 1) * 120 + 300}ms`,
                        }}
                      />
                      {visible && (
                        <circle r="1.5" fill="#0F82EB" opacity="0.5">
                          <animate
                            attributeName="cx"
                            from="0"
                            to="20"
                            dur="2.5s"
                            repeatCount="indefinite"
                            begin={`${i * 0.5}s`}
                          />
                          <animate
                            attributeName="cy"
                            values="8;8"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;0.5;0.5;0"
                            dur="2.5s"
                            repeatCount="indefinite"
                            begin={`${i * 0.5}s`}
                          />
                        </circle>
                      )}
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Loop-back arrow — shows the cycle repeats */}
        <div className="mt-3 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full border border-[#0F82EB]/15 bg-[#0F82EB]/5 px-4 py-1.5 transition-all"
            style={{
              opacity: visible ? 1 : 0,
              transitionDelay: `${steps.length * 120 + 300}ms`,
              transitionDuration: "500ms",
            }}
          >
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              className="text-[#0F82EB]"
            >
              <path
                d="M 14 6 A 5 5 0 1 1 6 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                fill="none"
              />
              <path
                d="M 4 0 L 7 2 L 4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                fill="none"
              />
            </svg>
            <span className="font-mono text-[10px] text-[#0F82EB]/50">
              Repeat until PRD complete
            </span>
          </div>
        </div>
      </div>

      {/* Mobile: vertical flow */}
      <div className="flex flex-col items-center gap-0 md:hidden">
        {steps.map((step, i) => {
          const Icon = ICONS[step.iconName];
          return (
            <div key={step.title} className="flex w-full flex-col items-center">
              <div
                className="flex w-full items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-all"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? "translateX(0)"
                    : "translateX(-12px)",
                  transitionDelay: `${i * 80}ms`,
                  transitionDuration: "500ms",
                }}
              >
                <span className="font-mono text-[10px] text-[#0F82EB]/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#0F82EB]/10">
                  <Icon className="h-4 w-4 text-[#0F82EB]" />
                </div>
                <div>
                  <p className="font-[Nutmeg] text-[13px] font-semibold text-white/85">
                    {step.title}
                  </p>
                  <p className="font-mono text-[10px] text-white/30">
                    {step.description}
                  </p>
                </div>
              </div>

              {i < steps.length - 1 && (
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="my-1">
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="14"
                    stroke="#0F82EB"
                    strokeWidth="1.2"
                    strokeOpacity={visible ? 0.2 : 0}
                    strokeDasharray="3 3"
                    style={{
                      transition: "stroke-opacity 400ms",
                      transitionDelay: `${(i + 1) * 80 + 100}ms`,
                    }}
                  />
                  <path
                    d="M 4 12 L 8 18 L 12 12"
                    stroke="#0F82EB"
                    strokeWidth="1.2"
                    fill="none"
                    strokeOpacity={visible ? 0.3 : 0}
                    style={{
                      transition: "stroke-opacity 400ms",
                      transitionDelay: `${(i + 1) * 80 + 150}ms`,
                    }}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
