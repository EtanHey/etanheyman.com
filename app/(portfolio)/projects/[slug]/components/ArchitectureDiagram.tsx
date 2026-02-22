"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  FileText,
  Binary,
  Search,
  Wrench,
  Mic,
  Volume2,
  Radio,
  Lock,
  Send,
  Bot,
  Zap,
  Cloud,
  Scissors,
  Database,
  Brain,
  BookOpen,
  HelpCircle,
  Package,
  Monitor,
  Shield,
  GitBranch,
  Mail,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

export interface ArchNode {
  icon: string;
  title: string;
  subtitle: string;
  children?: string[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare,
  FileText,
  Binary,
  Search,
  Wrench,
  Mic,
  Volume2,
  Radio,
  Lock,
  Send,
  Bot,
  Zap,
  Cloud,
  Scissors,
  Database,
  Brain,
  BookOpen,
  HelpCircle,
  Package,
  Monitor,
  Shield,
  GitBranch,
  Mail,
  Lightbulb,
};

interface Props {
  nodes: ArchNode[];
  accentColor: string;
  accentColorRgb: string;
}

export function ArchitectureDiagram({
  nodes,
  accentColor,
  accentColorRgb,
}: Props) {
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
    <div ref={ref} className="relative">
      {/* Desktop: horizontal flow */}
      <div className="hidden md:block">
        <div className="flex items-stretch gap-0">
          {nodes.map((node, i) => {
            const Icon = ICON_MAP[node.icon];
            return (
              <div key={node.title} className="flex flex-1 items-center">
                {/* Node card */}
                <div
                  className="relative flex w-full flex-col items-center gap-3 rounded-xl border px-4 py-6 transition-all"
                  style={{
                    borderColor: visible
                      ? `rgba(${accentColorRgb}, 0.2)`
                      : "rgba(255,255,255,0.05)",
                    backgroundColor: visible
                      ? `rgba(${accentColorRgb}, 0.04)`
                      : "transparent",
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? "translateY(0)"
                      : "translateY(12px)",
                    transitionDelay: `${i * 100}ms`,
                    transitionDuration: "500ms",
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `rgba(${accentColorRgb}, 0.12)`,
                    }}
                  >
                    {Icon && (
                      <Icon
                        className="h-5 w-5"
                        style={{ color: accentColor }}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-[Nutmeg] text-[13px] font-semibold text-white/90">
                      {node.title}
                    </p>
                    <p className="mt-1 font-mono text-[10px] leading-tight text-white/35">
                      {node.subtitle}
                    </p>
                  </div>

                  {/* Forked children badges */}
                  {node.children && node.children.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {node.children.map((child, ci) => (
                        <span
                          key={child}
                          className="rounded-full px-2 py-0.5 font-mono text-[8px] leading-tight"
                          style={{
                            backgroundColor: `rgba(${accentColorRgb}, 0.1)`,
                            color: `rgba(${accentColorRgb}, 0.7)`,
                            borderWidth: 1,
                            borderColor: `rgba(${accentColorRgb}, 0.15)`,
                            opacity: visible ? 1 : 0,
                            transition: "opacity 300ms",
                            transitionDelay: `${i * 100 + 400 + ci * 60}ms`,
                          }}
                        >
                          {child}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow connector (not after last node) */}
                {i < nodes.length - 1 && (
                  <div className="flex-shrink-0 px-1">
                    <svg
                      width="28"
                      height="16"
                      viewBox="0 0 28 16"
                      fill="none"
                      className="overflow-visible"
                    >
                      <line
                        x1="0"
                        y1="8"
                        x2="20"
                        y2="8"
                        stroke={accentColor}
                        strokeWidth="1.5"
                        strokeOpacity={visible ? 0.35 : 0}
                        strokeDasharray="4 3"
                        style={{
                          transition: "stroke-opacity 400ms",
                          transitionDelay: `${(i + 1) * 100 + 200}ms`,
                        }}
                      />
                      <path
                        d="M 18 4 L 24 8 L 18 12"
                        stroke={accentColor}
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity={visible ? 0.5 : 0}
                        style={{
                          transition: "stroke-opacity 400ms",
                          transitionDelay: `${(i + 1) * 100 + 300}ms`,
                        }}
                      />
                      {/* Animated flowing dot */}
                      {visible && (
                        <circle r="2" fill={accentColor} opacity="0.6">
                          <animate
                            attributeName="cx"
                            from="0"
                            to="24"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.4}s`}
                          />
                          <animate
                            attributeName="cy"
                            values="8;8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;0.6;0.6;0"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.4}s`}
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
      </div>

      {/* Mobile: vertical flow */}
      <div className="flex flex-col items-center gap-0 md:hidden">
        {nodes.map((node, i) => {
          const Icon = ICON_MAP[node.icon];
          return (
            <div key={node.title} className="flex w-full flex-col items-center">
              <div
                className="flex w-full items-center gap-4 rounded-xl border px-5 py-4 transition-all"
                style={{
                  borderColor: visible
                    ? `rgba(${accentColorRgb}, 0.2)`
                    : "rgba(255,255,255,0.05)",
                  backgroundColor: visible
                    ? `rgba(${accentColorRgb}, 0.04)`
                    : "transparent",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                  transitionDelay: `${i * 80}ms`,
                  transitionDuration: "500ms",
                }}
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `rgba(${accentColorRgb}, 0.12)`,
                  }}
                >
                  {Icon && (
                    <Icon
                      className="h-4.5 w-4.5"
                      style={{ color: accentColor }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-[Nutmeg] text-[13px] font-semibold text-white/90">
                    {node.title}
                  </p>
                  <p className="font-mono text-[10px] text-white/35">
                    {node.subtitle}
                  </p>
                  {node.children && node.children.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {node.children.map((child, ci) => (
                        <span
                          key={child}
                          className="rounded-full px-1.5 py-0.5 font-mono text-[8px] leading-tight"
                          style={{
                            backgroundColor: `rgba(${accentColorRgb}, 0.1)`,
                            color: `rgba(${accentColorRgb}, 0.7)`,
                            borderWidth: 1,
                            borderColor: `rgba(${accentColorRgb}, 0.15)`,
                            opacity: visible ? 1 : 0,
                            transition: "opacity 300ms",
                            transitionDelay: `${i * 80 + 300 + ci * 50}ms`,
                          }}
                        >
                          {child}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical arrow */}
              {i < nodes.length - 1 && (
                <svg
                  width="16"
                  height="24"
                  viewBox="0 0 16 24"
                  fill="none"
                  className="my-1"
                >
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="16"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    strokeOpacity={visible ? 0.3 : 0}
                    strokeDasharray="4 3"
                    style={{
                      transition: "stroke-opacity 400ms",
                      transitionDelay: `${(i + 1) * 80 + 100}ms`,
                    }}
                  />
                  <path
                    d="M 4 14 L 8 20 L 12 14"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    fill="none"
                    strokeOpacity={visible ? 0.4 : 0}
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
