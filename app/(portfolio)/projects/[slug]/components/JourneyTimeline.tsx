"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import type { ProjectJourneyStep } from "@/lib/projects";

export function JourneyTimeline({
  steps,
  accentColor,
  accentColorRgb,
}: {
  steps: ProjectJourneyStep[];
  accentColor: string;
  accentColorRgb: string;
}) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute top-0 bottom-0 left-[18px] w-px bg-white/[0.08] md:left-[22px]" />

      <div className="space-y-10 md:space-y-14">
        {steps.map((step, index) => (
          <TimelineItem
            key={step.id}
            step={step}
            index={index}
            accentColor={accentColor}
            accentColorRgb={accentColorRgb}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  step,
  index,
  accentColor,
  accentColorRgb,
}: {
  step: ProjectJourneyStep;
  index: number;
  accentColor: string;
  accentColorRgb: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex gap-5 md:gap-9"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      {/* Numbered dot */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full md:h-[46px] md:w-[46px]"
          style={{
            backgroundColor: `rgba(${accentColorRgb}, 0.12)`,
            boxShadow: `0 0 20px rgba(${accentColorRgb}, 0.15)`,
          }}
        >
          <span
            className="font-mono text-[13px] font-bold md:text-[15px]"
            style={{ color: accentColor }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-1">
        <h3 className="mb-2 font-[Nutmeg] text-[17px] font-semibold text-white md:text-[20px]">
          {step.title}
        </h3>
        <p className="max-w-[580px] font-[Nutmeg] text-[14px] font-light leading-relaxed text-white/55 md:text-[15px]">
          {step.description}
        </p>
        {step.imgUrl && (
          <div
            className="relative mt-5 h-[180px] w-full overflow-hidden rounded-xl md:h-[280px] md:max-w-[540px]"
            style={{
              boxShadow: `0 0 30px rgba(${accentColorRgb}, 0.12)`,
            }}
          >
            <Image
              src={step.imgUrl}
              alt={step.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
