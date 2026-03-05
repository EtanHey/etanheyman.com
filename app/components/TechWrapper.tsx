"use client";

import React, { ReactNode, useEffect, useRef } from "react";

interface TechWrapperProps {
  children: ReactNode;
  className?: string;
  name?: string;
}

const baseClasses = [
  "relative flex items-center justify-center",
  "h-[43.94px] w-[48.17px] p-[8.45px]",
  "sm:h-[74.71px] sm:w-[81.9px] sm:p-[14.37px]",
  "rounded-tl-[338.01px] rounded-br-[338.01px] rounded-bl-[338.01px]",
  "sm:rounded-tl-[574.71px] sm:rounded-br-[574.71px] sm:rounded-bl-[574.71px]",
  "bg-blue-50 hover:opacity-100",
  "shadow-[0px_0px_34.48px_0px_hsla(209,88%,49%,1)]",
  "transition-opacity duration-300",
].join(" ");

const TechWrapper: React.FC<TechWrapperProps> = ({
  children,
  className = "",
  name = "",
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const base = 0.5 + Math.random() * 0.5;
    const speed = 0.0002 + Math.random() * 0.0003;
    const phase = Math.random() * Math.PI * 2;
    el.style.opacity = String(base);

    let raf: number;
    const animate = (time: number) => {
      if (!hoveredRef.current) {
        const wave = Math.sin(time * speed + phase);
        const range = 1.0 - base;
        el.style.opacity = String(base + (wave * 0.5 + 0.5) * range * 0.5);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={elRef}
      onMouseEnter={() => {
        hoveredRef.current = true;
        if (elRef.current) elRef.current.style.opacity = "1";
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      style={{ opacity: 0.8 }}
      className={`${baseClasses} ${className}`}
      role="img"
      aria-label={`${name} technology icon`}
    >
      {children}
    </div>
  );
};

export default TechWrapper;
