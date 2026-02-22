"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  headers: string[];
  rows: string[][];
  accentColor: string;
  accentColorRgb: string;
}

export function ComparisonTable({
  headers,
  rows,
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
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border transition-all duration-500"
      style={{
        borderColor: `rgba(${accentColorRgb}, 0.12)`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr
              style={{
                backgroundColor: `rgba(${accentColorRgb}, 0.06)`,
              }}
            >
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={`border-b px-4 py-3 text-left font-mono text-[11px] tracking-[0.1em] uppercase ${
                    i === 0 ? "text-white/30" : "text-white/50"
                  }`}
                  style={{
                    borderColor: `rgba(${accentColorRgb}, 0.08)`,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="transition-all"
                style={{
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${ri * 60 + 200}ms`,
                  transitionDuration: "400ms",
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border-b px-4 py-2.5 font-mono text-[12px] md:text-[13px] ${
                      ci === 0
                        ? "font-medium text-white/50"
                        : ci === 1
                          ? "text-white/70"
                          : "text-white/40"
                    }`}
                    style={{
                      borderColor: `rgba(${accentColorRgb}, 0.06)`,
                      backgroundColor:
                        ci === 1
                          ? `rgba(${accentColorRgb}, 0.03)`
                          : "transparent",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
