"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    darkMode: false,
    background: "#e9eae4",
    primaryColor: "#e9eae4",
    primaryTextColor: "#1b2321",
    primaryBorderColor: "#4f5651",
    lineColor: "#4f5651",
    secondaryColor: "#dedfd8",
    tertiaryColor: "#d2d4cc",
    clusterBkg: "#dedfd8",
    clusterBorder: "#b9bbb2",
    fontFamily: "var(--font-golems-sans), 'IBM Plex Sans', sans-serif",
    fontSize: "15px",
    noteBkgColor: "#d2d4cc",
    noteTextColor: "#1b2321",
    noteBorderColor: "#b9bbb2",
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
      <div className="my-5 overflow-x-auto rounded-lg bg-g-kiln p-4 font-g-mono text-sm">
        <pre className="text-g-kiln-text">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-5 flex min-h-[100px] items-center justify-center rounded-lg border border-g-rule bg-g-raised p-4">
        <span className="text-sm text-g-ash">Loading diagram…</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-5 flex justify-center overflow-x-auto rounded-lg border border-g-rule bg-g-raised p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
