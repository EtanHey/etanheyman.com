"use client";

import { useState } from "react";
import { ArrowUpRight, Brain, Mic, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemProduct {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accentColor: string;
  accentRgb: string;
  projectSlug: string;
}

const products: EcosystemProduct[] = [
  {
    name: "BrainLayer",
    description:
      "AI memory layer — hybrid search, knowledge graph, and 12 MCP tools for persistent recall across sessions.",
    icon: <Brain className="h-6 w-6" />,
    href: "https://brainlayer.etanheyman.com",
    accentColor: "#6366F1",
    accentRgb: "99, 102, 241",
    projectSlug: "brainlayer",
  },
  {
    name: "VoiceLayer",
    description:
      "Voice I/O for AI agents — local STT via whisper.cpp, neural TTS, and a macOS menu bar daemon.",
    icon: <Mic className="h-6 w-6" />,
    href: "https://voicelayer.etanheyman.com",
    accentColor: "#38BDF8",
    accentRgb: "56, 189, 248",
    projectSlug: "voicelayer",
  },
  {
    name: "cmuxLayer",
    description:
      "Terminal multiplexer MCP server — spawn and orchestrate AI agents across terminal panes.",
    icon: <Terminal className="h-6 w-6" />,
    href: "https://cmuxlayer.etanheyman.com",
    accentColor: "#10B981",
    accentRgb: "16, 185, 129",
    projectSlug: "cmuxlayer",
  },
];

function EcosystemCard({ product }: { product: EcosystemProduct }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/eco block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#00003F]/80 p-6 backdrop-blur-sm transition-all duration-500",
          "md:group-hover/eco:-translate-y-1",
        )}
        style={{
          boxShadow: isHovering
            ? `0 0 40px 0 rgba(${product.accentRgb}, 0.25)`
            : "none",
        }}
      >
        {/* Accent rail */}
        <div
          className="absolute top-4 bottom-4 left-0 w-[3px] rounded-r-full opacity-50 transition-opacity duration-300 group-hover/eco:opacity-100"
          style={{ backgroundColor: product.accentColor }}
        />

        {/* Icon + Name row */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300"
            style={{
              backgroundColor: `rgba(${product.accentRgb}, ${isHovering ? 0.2 : 0.1})`,
              color: product.accentColor,
            }}
          >
            {product.icon}
          </div>
          <h3 className="font-[Nutmeg] text-[20px] font-semibold text-white sm:text-[22px]">
            {product.name}
          </h3>
          <ArrowUpRight className="ml-auto h-5 w-5 text-white/40 transition-all duration-300 group-hover/eco:translate-x-0.5 group-hover/eco:-translate-y-0.5 group-hover/eco:text-white/80" />
        </div>

        {/* Description */}
        <p className="mt-3 font-[Nutmeg] text-[14px] leading-[1.4] font-light text-white/60 sm:text-[15px]">
          {product.description}
        </p>

        {/* Portfolio link */}
        <div className="mt-4 border-t border-white/5 pt-3">
          <a
            href={`/projects/${product.projectSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="font-[Nutmeg] text-[13px] font-light text-white/40 transition-colors hover:text-white/70"
          >
            View in portfolio &rarr;
          </a>
        </div>
      </div>
    </a>
  );
}

export default function GolemsEcosystem() {
  return (
    <section className="px-[18px] pt-6 pb-8 sm:px-8 md:px-12 md:pt-8 md:pb-10 lg:px-20 lg:pt-12 lg:pb-12 xl:px-40 xl:pt-14 xl:pb-14 2xl:px-[323px]">
      <div className="mx-auto max-w-[354px] sm:max-w-[500px] md:max-w-none">
        {/* Section header */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-[Nutmeg] text-[26px] leading-none font-semibold text-blue-200 sm:text-[32px] md:text-[36px] lg:text-[42px]">
            Golems Ecosystem
          </h2>
          <p className="mt-2 font-[Nutmeg] text-[15px] leading-[1.3] font-light text-white/60 sm:text-[17px] md:text-[18px]">
            3 open-source MCP servers. 44 tools. Persistent memory, voice I/O,
            and multi-agent orchestration for AI coding assistants.
          </p>
        </div>

        {/* Product cards grid */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {products.map((product) => (
            <EcosystemCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
