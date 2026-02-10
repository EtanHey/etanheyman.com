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

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { fontSize: '0.45rem' },
  md: { fontSize: '0.55rem' },
  lg: { fontSize: '0.7rem' },
};

export default function GolemMascot({ size = 'md', animated = true, className }: GolemMascotProps) {
  const [visible, setVisible] = useState(!animated);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  return (
    <pre
      className={className || ''}
      style={{
        fontFamily: "'IBM Plex Mono', 'Fira Code', Monaco, monospace",
        lineHeight: 1.15,
        whiteSpace: 'pre',
        overflow: 'hidden',
        userSelect: 'none',
        margin: 0,
        padding: 0,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        ...SIZE_STYLES[size],
      }}
    >
      {GUARDIAN_ART.map((line, i) => (
        <div
          key={i}
          style={animated ? {
            animation: 'lineReveal 0.3s ease forwards',
            animationDelay: `${i * 60}ms`,
            opacity: 0,
          } : undefined}
        >
          {colorLine(line)}
        </div>
      ))}
    </pre>
  );
}
