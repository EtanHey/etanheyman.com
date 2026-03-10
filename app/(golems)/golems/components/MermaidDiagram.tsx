"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "#0d0d0d",
    primaryColor: "#c4783c",
    primaryTextColor: "#f0ebe0",
    primaryBorderColor: "#a89078",
    lineColor: "#a89078",
    secondaryColor: "#1a1816",
    tertiaryColor: "#0d0d0d",
    fontFamily: "var(--font-golems-mono), 'JetBrains Mono', monospace",
    fontSize: "16px",
    noteBkgColor: "#1a1816",
    noteTextColor: "#c0b8a8",
    noteBorderColor: "#e5950033",
  },
});

let idCounter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const id = `mermaid-${idCounter++}`;
    mermaid
      .render(id, chart.trim())
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
      })
      .catch((err) => {
        setError(err.message || "Failed to render diagram");
      });
  }, [chart]);

  if (error) {
    return (
      <div className="mb-4 overflow-x-auto rounded-lg border border-[#e5950026] bg-[#0d0d0d] p-4 font-mono text-sm">
        <pre className="text-[#c0b8a8]">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="mb-4 flex min-h-[100px] items-center justify-center rounded-lg border border-[#e5950026] bg-[#0d0d0d] p-4">
        <span className="text-sm text-[#a89078]">Loading diagram...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mb-4 flex justify-center overflow-x-auto rounded-lg border border-[#e5950026] bg-[#0d0d0d] p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
