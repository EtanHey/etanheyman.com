'use client';

import { useState, useEffect } from 'react';

const mascotArt: Record<string, string[]> = {
  guardian: [
    '    ╔═══════╗',
    '    ║ ◉   ◉ ║',
    '    ║   ▼   ║',
    '    ║ ╰───╯ ║',
    '    ╚═══╤═══╝',
    '   ╔════╧════╗',
    '   ║ GOLEMS  ║',
    '   ║ GUARD   ║',
    '   ╚═══╤═╤═══╝',
    '      ╱   ╲',
    '     ╱     ╲',
    '    ▓▓     ▓▓',
  ],
};

type GolemMascotProps = {
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
};

export default function GolemMascot({ variant = 'guardian', size = 'md', animated = true }: GolemMascotProps) {
  const [visibleLines, setVisibleLines] = useState(animated ? 0 : 999);
  const art = mascotArt[variant] || mascotArt.guardian;

  useEffect(() => {
    if (!animated) return;
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= art.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [animated, art.length]);

  const sizeClasses = {
    sm: 'text-[0.55rem] leading-[1.2]',
    md: 'text-[0.7rem] leading-[1.3]',
    lg: 'text-[0.85rem] leading-[1.3]',
  };

  return (
    <pre className={`font-mono text-[#e59500] select-none ${sizeClasses[size]}`}>
      {art.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="opacity-90">{line}</div>
      ))}
    </pre>
  );
}
