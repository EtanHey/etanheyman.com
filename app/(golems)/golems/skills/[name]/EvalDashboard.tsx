"use client";

import { useState } from "react";
import type { SkillEvalResult, ModelId } from "../../lib/eval-types";
import {
  MODEL_COLORS,
  MODEL_BG,
  passRateColor,
  passRateLabel,
} from "../../lib/eval-types";

/* ── Sub-tab IDs ──────────────────────────────────────────── */

const SUB_TABS = [
  { id: "assertions", label: "Assertions" },
  { id: "cost", label: "Cost & Tokens" },
  { id: "latency", label: "Latency" },
] as const;

type SubTabId = (typeof SUB_TABS)[number]["id"];

/* ── Component ────────────────────────────────────────────── */

interface Props {
  data: SkillEvalResult;
}

export default function EvalDashboard({ data }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("assertions");

  const bestModel = data.models.reduce((a, b) =>
    a.passRate >= b.passRate ? a : b,
  );
  const totalAssertions = data.assertions.length;
  const avgCost =
    data.models.reduce((s, m) => s + m.costPerRun, 0) / data.models.length;
  const fastestModel = data.models.reduce((a, b) =>
    a.latencyP50Ms <= b.latencyP50Ms ? a : b,
  );

  return (
    <div className="space-y-6">
      {/* ── KPI Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KPICard
          label="Best Pass Rate"
          value={`${Math.round(bestModel.passRate * 100)}%`}
          sub={bestModel.label}
          color={passRateColor(bestModel.passRate)}
        />
        <KPICard
          label="Assertions"
          value={String(totalAssertions)}
          sub={`${data.models.length} models tested`}
          color="#6ab0f3"
        />
        <KPICard
          label="Avg Cost / Run"
          value={`$${avgCost.toFixed(4)}`}
          sub="across models"
          color="#e59500"
        />
        <KPICard
          label="Fastest (p50)"
          value={formatMs(fastestModel.latencyP50Ms)}
          sub={fastestModel.label}
          color="#34d399"
        />
      </div>

      {/* ── Model Comparison Bars ───────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold text-[#f0ebe0]">
          Pass Rate by Model
        </h3>
        <div className="space-y-2.5">
          {data.models
            .sort((a, b) => b.passRate - a.passRate)
            .map((m) => (
              <ModelBar key={m.model} model={m} maxRate={1} />
            ))}
        </div>
      </section>

      {/* ── Sub-tabs ────────────────────────────────────────── */}
      <div>
        <div
          className="flex gap-1 border-b border-[#e5950020]"
          role="tablist"
          aria-label="Eval metric details"
        >
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeSubTab === tab.id}
              aria-controls={`eval-panel-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id)}
              type="button"
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                activeSubTab === tab.id
                  ? "text-[#e59500] after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-[#e59500]"
                  : "text-[#a89078] hover:text-[#c0b8a8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Assertions panel */}
        <div
          role="tabpanel"
          id="eval-panel-assertions"
          aria-labelledby="eval-tab-assertions"
          className={activeSubTab === "assertions" ? "pt-4" : "hidden"}
        >
          <AssertionsTable data={data} />
        </div>

        {/* Cost panel */}
        <div
          role="tabpanel"
          id="eval-panel-cost"
          aria-labelledby="eval-tab-cost"
          className={activeSubTab === "cost" ? "pt-4" : "hidden"}
        >
          <CostBreakdown models={data.models} />
        </div>

        {/* Latency panel */}
        <div
          role="tabpanel"
          id="eval-panel-latency"
          aria-labelledby="eval-tab-latency"
          className={activeSubTab === "latency" ? "pt-4" : "hidden"}
        >
          <LatencyBreakdown models={data.models} />
        </div>
      </div>

      {/* Eval date */}
      <p className="text-xs text-[#b0a89c]">
        Last evaluated: {data.lastEvalDate} &middot; Data is generated from
        skill assertions (real cross-model benchmarks coming soon)
      </p>
    </div>
  );
}

/* ── KPI Card ─────────────────────────────────────────────── */

function KPICard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: `${color}20`,
        backgroundColor: `${color}08`,
      }}
    >
      <p className="mb-1 text-xs font-medium text-[#b0a89c]">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[#a69987]">{sub}</p>
    </div>
  );
}

/* ── Model Bar ────────────────────────────────────────────── */

function ModelBar({
  model,
  maxRate,
}: {
  model: {
    model: ModelId;
    label: string;
    passRate: number;
    passed: number;
    total: number;
  };
  maxRate: number;
}) {
  const color = MODEL_COLORS[model.model];
  const bg = MODEL_BG[model.model];
  const pct = Math.round(model.passRate * 100);
  const widthPct = maxRate > 0 ? (model.passRate / maxRate) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-20 shrink-0 text-right text-sm font-medium"
        style={{ color }}
      >
        {model.label}
      </span>
      <div
        className="relative h-8 flex-1 overflow-hidden rounded-lg"
        style={{ backgroundColor: bg }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
          style={{
            width: `${widthPct}%`,
            backgroundColor: `${color}40`,
          }}
        />
        <div className="relative flex h-full items-center px-3">
          <span className="text-sm font-bold" style={{ color }}>
            {pct}%
          </span>
          <span className="ml-2 text-xs text-[#b0a89c]">
            {model.passed}/{model.total}
          </span>
        </div>
      </div>
      <span
        className="w-6 shrink-0 text-center text-xs font-medium"
        style={{ color: passRateColor(model.passRate) }}
        title={passRateLabel(model.passRate)}
      >
        {model.passRate >= 0.9
          ? "\u25CF"
          : model.passRate >= 0.7
            ? "\u25D2"
            : model.passRate >= 0.4
              ? "\u25D3"
              : "\u25CB"}
      </span>
    </div>
  );
}

/* ── Assertions Table ─────────────────────────────────────── */

function AssertionsTable({ data }: { data: SkillEvalResult }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e5950020]">
            <th className="px-3 py-2 text-left font-medium text-[#b0a89c]">
              Assertion
            </th>
            {data.models.map((m) => (
              <th
                key={m.model}
                className="w-24 px-3 py-2 text-center font-medium"
                style={{ color: MODEL_COLORS[m.model as ModelId] }}
              >
                {m.label}
              </th>
            ))}
            <th className="w-20 px-3 py-2 text-center font-medium text-[#b0a89c]">
              Consensus
            </th>
          </tr>
        </thead>
        <tbody>
          {data.assertions.map((a) => {
            const passCount =
              (a.opus ? 1 : 0) + (a.sonnet ? 1 : 0) + (a.haiku ? 1 : 0);
            return (
              <tr
                key={a.name}
                className="border-b border-[#e5950010] transition-colors hover:bg-[#e595000a]"
              >
                <td className="px-3 py-2.5 font-mono text-xs text-[#c0b8a8]">
                  {a.name}
                </td>
                <PassFailCell passed={a.opus} />
                <PassFailCell passed={a.sonnet} />
                <PassFailCell passed={a.haiku} />
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        passCount === 3
                          ? "#28c840"
                          : passCount >= 2
                            ? "#eab308"
                            : passCount === 1
                              ? "#f97316"
                              : "#ef4444",
                    }}
                  >
                    {passCount}/3
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PassFailCell({ passed }: { passed: boolean }) {
  return (
    <td className="px-3 py-2.5 text-center">
      {passed ? (
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#28c84015] text-[#28c840]"
          aria-label="Passed"
          title="Passed"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ef444415] text-[#ef4444]"
          aria-label="Failed"
          title="Failed"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
    </td>
  );
}

/* ── Cost Breakdown ───────────────────────────────────────── */

function CostBreakdown({ models }: { models: SkillEvalResult["models"] }) {
  const maxTokens = Math.max(
    ...models.map((m) => m.inputTokens + m.outputTokens),
  );
  const maxCost = Math.max(...models.map((m) => m.costPerRun));

  return (
    <div className="space-y-6">
      {/* Token stacked bars */}
      <div>
        <h4 className="mb-3 text-xs font-bold tracking-wider text-[#b0a89c] uppercase">
          Token Usage
        </h4>
        <div className="space-y-3">
          {models.map((m) => {
            const totalTokens = m.inputTokens + m.outputTokens;
            const inputPct =
              maxTokens > 0 ? (m.inputTokens / maxTokens) * 100 : 0;
            const outputPct =
              maxTokens > 0 ? (m.outputTokens / maxTokens) * 100 : 0;
            const color = MODEL_COLORS[m.model as ModelId];
            return (
              <div key={m.model} className="flex items-center gap-3">
                <span
                  className="w-20 shrink-0 text-right text-sm font-medium"
                  style={{ color }}
                >
                  {m.label}
                </span>
                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[#1a1816]">
                  {/* Input tokens */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-l-lg"
                    style={{
                      width: `${inputPct}%`,
                      backgroundColor: `${color}60`,
                    }}
                    title={`Input: ${m.inputTokens.toLocaleString()} tokens`}
                  />
                  {/* Output tokens (stacked after input) */}
                  <div
                    className="absolute inset-y-0 rounded-r-lg"
                    style={{
                      left: `${inputPct}%`,
                      width: `${outputPct}%`,
                      backgroundColor: `${color}30`,
                    }}
                    title={`Output: ${m.outputTokens.toLocaleString()} tokens`}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs text-[#b0a89c]">
                  {totalTokens.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-4 text-xs text-[#a69987]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded bg-[#ffffff40]" />
            Input tokens
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded bg-[#ffffff20]" />
            Output tokens
          </span>
        </div>
      </div>

      {/* Cost bars */}
      <div>
        <h4 className="mb-3 text-xs font-bold tracking-wider text-[#b0a89c] uppercase">
          Cost per Run
        </h4>
        <div className="space-y-3">
          {models.map((m) => {
            const widthPct = maxCost > 0 ? (m.costPerRun / maxCost) * 100 : 0;
            const color = MODEL_COLORS[m.model as ModelId];
            return (
              <div key={m.model} className="flex items-center gap-3">
                <span
                  className="w-20 shrink-0 text-right text-sm font-medium"
                  style={{ color }}
                >
                  {m.label}
                </span>
                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[#1a1816]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: `${color}40`,
                    }}
                  />
                  <div className="relative flex h-full items-center px-3">
                    <span className="text-xs font-medium" style={{ color }}>
                      ${m.costPerRun.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#e5950020]">
              <th className="px-3 py-2 text-left font-medium text-[#b0a89c]">
                Model
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                Input Tokens
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                Output Tokens
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                Cost / Run
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                Cost / 1K Runs
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.model} className="border-b border-[#e5950010]">
                <td
                  className="px-3 py-2 font-medium"
                  style={{ color: MODEL_COLORS[m.model as ModelId] }}
                >
                  {m.label}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                  {m.inputTokens.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                  {m.outputTokens.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                  ${m.costPerRun.toFixed(4)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                  ${(m.costPerRun * 1000).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Latency Breakdown ────────────────────────────────────── */

function LatencyBreakdown({ models }: { models: SkillEvalResult["models"] }) {
  const maxLatency = Math.max(...models.map((m) => m.latencyP95Ms));

  return (
    <div className="space-y-6">
      {/* P50 bars */}
      <div>
        <h4 className="mb-3 text-xs font-bold tracking-wider text-[#b0a89c] uppercase">
          Response Time (p50)
        </h4>
        <div className="space-y-3">
          {[...models]
            .sort((a, b) => a.latencyP50Ms - b.latencyP50Ms)
            .map((m) => {
              const widthPct =
                maxLatency > 0 ? (m.latencyP50Ms / maxLatency) * 100 : 0;
              const color = MODEL_COLORS[m.model as ModelId];
              return (
                <div key={m.model} className="flex items-center gap-3">
                  <span
                    className="w-20 shrink-0 text-right text-sm font-medium"
                    style={{ color }}
                  >
                    {m.label}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[#1a1816]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: `${color}40`,
                      }}
                    />
                    <div className="relative flex h-full items-center px-3">
                      <span className="text-xs font-medium" style={{ color }}>
                        {formatMs(m.latencyP50Ms)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* P95 bars */}
      <div>
        <h4 className="mb-3 text-xs font-bold tracking-wider text-[#b0a89c] uppercase">
          Response Time (p95)
        </h4>
        <div className="space-y-3">
          {[...models]
            .sort((a, b) => a.latencyP95Ms - b.latencyP95Ms)
            .map((m) => {
              const widthPct =
                maxLatency > 0 ? (m.latencyP95Ms / maxLatency) * 100 : 0;
              const color = MODEL_COLORS[m.model as ModelId];
              return (
                <div key={m.model} className="flex items-center gap-3">
                  <span
                    className="w-20 shrink-0 text-right text-sm font-medium"
                    style={{ color }}
                  >
                    {m.label}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[#1a1816]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: `${color}40`,
                      }}
                    />
                    <div className="relative flex h-full items-center px-3">
                      <span className="text-xs font-medium" style={{ color }}>
                        {formatMs(m.latencyP95Ms)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#e5950020]">
              <th className="px-3 py-2 text-left font-medium text-[#b0a89c]">
                Model
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                p50
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                p95
              </th>
              <th className="px-3 py-2 text-right font-medium text-[#b0a89c]">
                Overhead
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => {
              const overhead =
                m.latencyP50Ms > 0
                  ? ((m.latencyP95Ms - m.latencyP50Ms) / m.latencyP50Ms) * 100
                  : 0;
              return (
                <tr key={m.model} className="border-b border-[#e5950010]">
                  <td
                    className="px-3 py-2 font-medium"
                    style={{ color: MODEL_COLORS[m.model as ModelId] }}
                  >
                    {m.label}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                    {formatMs(m.latencyP50Ms)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                    {formatMs(m.latencyP95Ms)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[#c0b8a8]">
                    +{Math.round(overhead)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
