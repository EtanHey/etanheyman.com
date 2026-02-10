'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0d0d0d',
    primaryColor: '#c4783c',
    primaryTextColor: '#f0ebe0',
    primaryBorderColor: '#8b7355',
    lineColor: '#8b7355',
    secondaryColor: '#1a1816',
    tertiaryColor: '#0d0d0d',
    fontFamily: "var(--font-golems-mono), 'JetBrains Mono', monospace",
    fontSize: '16px',
    noteBkgColor: '#1a1816',
    noteTextColor: '#c0b8a8',
    noteBorderColor: '#e5950033',
  },
});

let idCounter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const id = `mermaid-${idCounter++}`;
    mermaid
      .render(id, chart.trim())
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
      })
      .catch((err) => {
        setError(err.message || 'Failed to render diagram');
      });
  }, [chart]);

  if (error) {
    return (
      <div className="bg-[#0d0d0d] border border-[#e5950026] rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono">
        <pre className="text-[#c0b8a8]">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="bg-[#0d0d0d] border border-[#e5950026] rounded-lg p-4 mb-4 flex items-center justify-center min-h-[100px]">
        <span className="text-[#8b7355] text-sm">Loading diagram...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0d0d0d] border border-[#e5950026] rounded-lg p-4 mb-4 overflow-x-auto [&_svg]:max-w-full [&_svg]:mx-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
