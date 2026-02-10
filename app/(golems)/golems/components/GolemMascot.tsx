'use client';

import { useState, useEffect } from 'react';

const GUARDIAN_ART = [
  '         ▄▄████████▄▄',
  '       ▄██▓░░░░░░░░▓██▄',
  '     ▄██▓░░┌──────┐░░▓██▄',
  '    ███▓░░░│ אמת  │░░░▓███',
  '   ███▓░░░░└──────┘░░░░▓███',
  '   ███▓░░░░░░░░░░░░░░░░▓███',
  '  ████▓░░■■■░░░░░░■■■░░▓████',
  '  ████▓░░■◆■░░░░░░■◆■░░▓████',
  '  ████▓░░■■■░░░░░░■■■░░▓████',
  '   ███▓░░░░░░░░░░░░░░░░▓███',
  '   ███▓░░░░╔══════╗░░░░▓███',
  '   ███▓░░░░║ {··} ║░░░░▓███',
  '    ███▓░░░╚══════╝░░░▓███',
  '     ▀██▓░░░░░░░░░░░░▓██▀',
  '    ╔══▀████████████████▀══╗',
  '    ║                      ║',
];

const COLORS = { clay: '#c4783c', accent: '#8b7355', glow: '#ffb020' };

function colorLine(line: string) {
  const parts: React.ReactElement[] = [];
  let key = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if ('אמת'.includes(ch)) {
      parts.push(<span key={key++} style={{ color: COLORS.glow, textShadow: `0 0 10px ${COLORS.glow}60` }}>{ch}</span>);
    } else if ('◆'.includes(ch)) {
      parts.push(<span key={key++} style={{ color: COLORS.glow, textShadow: `0 0 6px ${COLORS.glow}40` }}>{ch}</span>);
    } else if ('╔╗╚╝║═┌┐└┘─│╠╣'.includes(ch)) {
      parts.push(<span key={key++} style={{ color: COLORS.accent }}>{ch}</span>);
    } else if ('▒▓█▄▀░■'.includes(ch)) {
      parts.push(<span key={key++} style={{ color: COLORS.clay, opacity: 0.8 }}>{ch}</span>);
    } else {
      parts.push(<span key={key++} style={{ color: '#777' }}>{ch}</span>);
    }
  }
  return parts;
}

type GolemMascotProps = {
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
};

export default function GolemMascot({ size = 'md', animated = true, className }: GolemMascotProps) {
  const [visibleLines, setVisibleLines] = useState(animated ? 0 : GUARDIAN_ART.length);

  useEffect(() => {
    if (!animated) return;
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= GUARDIAN_ART.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [animated]);

  const sizeStyles = {
    sm: { fontSize: '0.45rem', lineHeight: '1.15' },
    md: { fontSize: '0.55rem', lineHeight: '1.15' },
    lg: { fontSize: '0.7rem', lineHeight: '1.25' },
  };

  return (
    <pre
      className={`select-none whitespace-pre overflow-hidden ${className || ''}`}
      style={{
        fontFamily: "var(--font-golems-mono), 'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', Monaco, monospace",
        ...sizeStyles[size],
        margin: 0,
        padding: 0,
      }}
    >
      {GUARDIAN_ART.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={animated ? 'animate-[lineReveal_0.3s_ease_forwards] opacity-0' : ''}
          style={animated ? { animationDelay: `${i * 60}ms` } : undefined}
        >
          {colorLine(line)}
        </div>
      ))}
    </pre>
  );
}
