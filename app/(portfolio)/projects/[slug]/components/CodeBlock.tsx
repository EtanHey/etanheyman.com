"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { InstallTab } from "../project-showcase-config";

export function CodeBlock({
  tabs,
  accentColor,
}: {
  tabs: InstallTab[];
  accentColor: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[activeTab].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080828]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/[0.06] bg-white/[0.02] px-1">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveTab(i);
              setCopied(false);
            }}
            className={`relative px-4 py-3 font-mono text-[13px] transition-colors ${
              activeTab === i
                ? "text-white"
                : "text-white/35 hover:text-white/55"
            }`}
          >
            {tab.label}
            {activeTab === i && (
              <div
                className="absolute right-0 bottom-0 left-0 h-[2px]"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        ))}
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-white/35 transition-colors hover:text-white/60"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="font-mono text-[11px]">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      {/* Code content */}
      <div className="p-5">
        <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-white/75 md:text-[14px]">
          <code>{tabs[activeTab].command}</code>
        </pre>
      </div>
    </div>
  );
}
