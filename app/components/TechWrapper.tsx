"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

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
  // Start at 0.8 for SSR, randomize on mount
  const [opacity, setOpacity] = useState(0.8);
  const [isHovered, setIsHovered] = useState(false);
  const baseRef = useRef(0.8);
  const rafRef = useRef<number>(0);

  // Randomize on mount — different every reload
  useEffect(() => {
    const base = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
    baseRef.current = base;
    setOpacity(base);
  }, []);

  // Slow organic pulse
  useEffect(() => {
    if (isHovered) return;

    const speed = 0.0002 + Math.random() * 0.0003; // random cycle speed
    const phase = Math.random() * Math.PI * 2;
    const base = baseRef.current;

    let running = true;
    const animate = (time: number) => {
      if (!running || isHovered) return;
      const wave = Math.sin(time * speed + phase);
      const range = 1.0 - base;
      const value = base + (wave * 0.5 + 0.5) * range * 0.5;
      setOpacity(value);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        setOpacity(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onFocus={() => {
        setIsHovered(true);
        setOpacity(1);
      }}
      onBlur={() => {
        setIsHovered(false);
      }}
      style={{ opacity }}
      className={`${baseClasses} ${className}`}
      tabIndex={0}
      role="img"
      aria-label={`${name} technology icon`}
    >
      {children}
    </div>
  );
};

export default TechWrapper;
