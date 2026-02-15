'use client';

import { useEffect, useRef } from 'react';

// Colors matching the docs site theme
const C = {
  amber: '#e59500',
  clay: '#c46d3c',
  cyan: '#22d3ee',
  pink: '#f472b6',
  text: '#e2e8f0',
  muted: '#94a3b8',
  dim: '#64748b',
  bg: '#111110',
  cardBg: '#1a1510',
  cloudBg: '#151210',
};

const surfaces = [
  { name: 'Claude Code', sub: '>_', highlight: true },
  { name: 'Telegram', sub: '💬' },
  { name: 'Cowork', sub: '🤝' },
  { name: 'CLI', sub: 'golems *' },
  { name: 'Any Agent', sub: '🤖' },
];

const golems = [
  { name: 'Claude', role: 'orchestrator', icon: '🤖', primary: true },
  { name: 'Recruiter', role: 'outreach & practice', icon: '👔' },
  { name: 'Teller', role: 'finance & tax', icon: '💰' },
  { name: 'Coach', role: 'calendar & plans', icon: '🗓️' },
  { name: 'Job', role: 'scraping & matching', icon: '🔍' },
  { name: 'Content', role: 'LinkedIn & writing', icon: '✍️' },
];

const capabilities = ['Skills', 'MCP Tools', 'Rules', 'Context'];

const infra = [
  { name: 'Services', sub: 'Railway cloud', color: C.cyan, items: ['Email', 'Jobs', 'Briefing', 'Night Shift'] },
  { name: 'Supabase', sub: 'Postgres + RLS', color: C.cyan, glow: true },
  { name: 'Zikaron', sub: '238K+ chunks', color: C.pink },
];

// Animated flow dot component
function FlowDot({ color, delay = 0 }: { color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animationDelay = `${delay}ms`;
  }, [delay]);

  return (
    <div
      ref={ref}
      className="flow-dot"
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.7,
        position: 'absolute',
        animation: 'flowPulse 2s ease-in-out infinite',
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

// Flow arrow between sections (mobile)
function FlowArrow({ color = C.amber }: { color?: string }) {
  return (
    <div className="flex flex-col items-center py-3 relative">
      <div className="relative h-10 w-px" style={{ backgroundColor: `${color}30` }}>
        <div
          className="absolute left-0 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
            height: '100%',
            animation: 'flowDown 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <div
        className="w-0 h-0 -mt-px"
        style={{
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `6px solid ${color}`,
          opacity: 0.6,
        }}
      />
    </div>
  );
}

export default function ArchitectureDiagram() {
  return (
    <>
      <style>{`
        @keyframes flowPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes flowDown {
          0% { opacity: 0; transform: translateY(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100%); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 4px var(--glow-color)); }
          50% { filter: drop-shadow(0 0 12px var(--glow-color)); }
        }
      `}</style>

      {/* Desktop: full SVG */}
      <div className="hidden md:block my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/architecture-flow.svg"
          alt="Architecture — Surfaces flow into Golem Plugins which connect to Infrastructure"
          className="w-full max-w-[920px] mx-auto rounded-lg"
        />
      </div>

      {/* Mobile: vertical interactive layout */}
      <div className="md:hidden my-6 space-y-0">
        {/* Title */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            ARCHITECTURE
          </span>
        </div>

        {/* SURFACES */}
        <section>
          <div className="text-center mb-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{ color: C.amber, opacity: 0.6 }}
            >
              Surfaces
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 px-2">
            {surfaces.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                style={{
                  background: C.cardBg,
                  border: `1px solid ${s.highlight ? C.amber : C.clay}60`,
                }}
              >
                <span className="text-xs" style={{ color: s.highlight ? C.text : C.muted }}>
                  {s.name}
                </span>
                <span className="text-[10px] opacity-60">{s.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <FlowArrow color={C.amber} />

        {/* GOLEM PLUGINS */}
        <section>
          <div className="text-center mb-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{ color: C.amber, opacity: 0.6 }}
            >
              Golem Plugins
            </span>
          </div>

          {/* Orchestrator (full width) */}
          <div
            className="mx-4 mb-2 px-4 py-3 rounded-xl flex items-center justify-between"
            style={{
              background: C.cardBg,
              border: `1.5px solid ${C.amber}`,
              boxShadow: `0 0 20px ${C.amber}15`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-sm font-medium" style={{ color: C.text }}>ClaudeGolem</div>
                <div className="text-[10px]" style={{ color: C.amber, opacity: 0.7 }}>orchestrator</div>
              </div>
            </div>
          </div>

          {/* Domain golems grid (2 cols) */}
          <div className="grid grid-cols-2 gap-2 px-4">
            {golems.filter(g => !g.primary).map((g) => (
              <div
                key={g.name}
                className="px-3 py-2.5 rounded-lg"
                style={{
                  background: C.cardBg,
                  border: `1px solid ${C.amber}50`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{g.icon}</span>
                  <span className="text-xs font-medium" style={{ color: C.text }}>{g.name}</span>
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: C.dim }}>{g.role}</div>
              </div>
            ))}
          </div>

          {/* Capabilities */}
          <div className="flex justify-center gap-2 mt-3 px-4">
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="px-2 py-1 rounded-md text-[8px] font-medium"
                style={{
                  background: C.cardBg,
                  border: `1px solid ${C.amber}30`,
                  color: C.amber,
                  opacity: 0.8,
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </section>

        <FlowArrow color={C.cyan} />

        {/* INFRASTRUCTURE */}
        <section>
          <div className="text-center mb-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{ color: C.cyan, opacity: 0.6 }}
            >
              Infrastructure
            </span>
          </div>
          <div className="space-y-2 px-4">
            {infra.map((item) => (
              <div
                key={item.name}
                className="px-4 py-3 rounded-xl"
                style={{
                  background: item.color === C.pink ? C.cardBg : C.cloudBg,
                  border: `1px solid ${item.color}60`,
                  boxShadow: item.glow ? `0 0 16px ${item.color}20` : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: item.glow ? item.color : C.text,
                      }}
                    >
                      {item.name}
                    </span>
                    <span className="text-[10px] ml-2" style={{ color: C.dim }}>{item.sub}</span>
                  </div>
                </div>
                {item.items && (
                  <div className="flex gap-3 mt-1.5">
                    {item.items.map((sub) => (
                      <span key={sub} className="text-[9px]" style={{ color: C.dim }}>{sub}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom stats */}
        <div className="flex justify-center gap-4 pt-4 pb-2">
          <span className="text-[9px]" style={{ color: C.amber, opacity: 0.5 }}>6 golems</span>
          <span className="text-[9px]" style={{ color: C.amber, opacity: 0.5 }}>30+ skills</span>
          <span className="text-[9px]" style={{ color: C.cyan, opacity: 0.5 }}>6 MCP servers</span>
          <span className="text-[9px]" style={{ color: C.pink, opacity: 0.5 }}>238K+ chunks</span>
        </div>

        {/* Tagline */}
        <p className="text-center text-[11px] pb-2" style={{ color: C.dim }}>
          Many ways in. Same powerful golems underneath.
        </p>
      </div>
    </>
  );
}
