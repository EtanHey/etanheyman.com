"use client";

import { useEffect, useRef, useState } from "react";
import type { ToolListItem } from "../architecture-config";

interface Props {
  tools: ToolListItem[];
  accentColor: string;
}

export function ToolList({ tools, accentColor }: Props) {
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
    <div ref={ref} className="flex flex-col gap-0.5">
      {tools.map((tool, i) => (
        <div
          key={tool.name}
          className="flex items-baseline gap-2 py-1 transition-all md:gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-6px)",
            transitionDelay: `${i * 40}ms`,
            transitionDuration: "300ms",
          }}
        >
          <code
            className="flex-shrink-0 font-mono text-[12px] font-medium md:text-[14px]"
            style={{ color: accentColor }}
          >
            {tool.name}
          </code>
          <span className="font-mono text-[10px] text-white/35 md:text-[11px]">
            {tool.description}
          </span>
        </div>
      ))}
    </div>
  );
}
