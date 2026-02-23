"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Wrench, Check, ChevronDown, ChevronRight } from "lucide-react";

/* ── Types ────────────────────────────────────────────────── */

type ConversationMessage =
  | { type: "user"; text: string }
  | { type: "tool_call"; name: string; params: Record<string, string> }
  | { type: "tool_result"; lines: string[] }
  | { type: "assistant"; text: string };

interface ClaudeUIMockupProps {
  /** Accent color for tool calls and highlights */
  accentColor?: string;
  /** Whether to autoplay the animation */
  autoplay?: boolean;
  /** Conversation script to render */
  messages?: ConversationMessage[];
}

/* ── Default conversation ─────────────────────────────────── */

const DEFAULT_MESSAGES: ConversationMessage[] = [
  {
    type: "user",
    text: "How did I implement the auth middleware?",
  },
  {
    type: "tool_call",
    name: "brain_search",
    params: {
      query: '"auth middleware implementation"',
      project: '"golems"',
    },
  },
  {
    type: "tool_result",
    lines: [
      "Found 8 results across 2 projects",
      "",
      "#1  JWT middleware in shared/auth.ts",
      "    Score: 0.91 \u00b7 Importance: 8 \u00b7 Intent: implementing",
      '    "Created verifyToken() with RS256 + refresh rotation..."',
      "",
      "#2  RLS policies for user tables",
      "    Score: 0.86 \u00b7 Importance: 7 \u00b7 Intent: configuring",
    ],
  },
  {
    type: "assistant",
    text: "Based on your codebase history, you implemented JWT auth middleware in `shared/auth.ts` on Feb 12. The pattern uses RS256 signing with refresh token rotation. The middleware calls `verifyToken()` which checks the Supabase JWT and extracts the user ID for downstream handlers.",
  },
];

/* ── Typing hook ──────────────────────────────────────────── */

function useTypewriter(text: string, speed: number, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      indexRef.current = 0;
      return;
    }

    // Check reduced motion preference
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      setDisplayed(text);
      return;
    }

    const step = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;

      if (delta >= speed) {
        lastTimeRef.current = time;
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
      }

      if (indexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [text, speed, active]);

  const done = displayed.length >= text.length;
  return { displayed, done };
}

/* ── Inline code renderer ─────────────────────────────────── */

function renderInlineCode(text: string, accentColor: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded px-1.5 py-0.5 font-mono text-[0.7rem] md:text-[0.73rem]"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}12`,
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ── Message components ───────────────────────────────────── */

function UserMessage({
  text,
  accentColor,
  typing,
  onDone,
}: {
  text: string;
  accentColor: string;
  typing: boolean;
  onDone: () => void;
}) {
  const { displayed, done } = useTypewriter(text, 30, typing);

  useEffect(() => {
    if (done && typing) onDone();
  }, [done, typing, onDone]);

  const content = typing ? displayed : text;

  return (
    <div className="flex gap-2 py-2">
      <span
        className="shrink-0 font-mono text-xs font-bold md:text-[0.76rem]"
        style={{ color: accentColor }}
      >
        &gt;
      </span>
      <span className="font-mono text-xs text-[#e0e0e0] md:text-[0.76rem]">
        {content}
        {typing && !done && (
          <span
            className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]"
            style={{ color: accentColor }}
          >
            |
          </span>
        )}
      </span>
    </div>
  );
}

function ToolCallBlock({
  name,
  params,
  accentColor,
  visible,
}: {
  name: string;
  params: Record<string, string>;
  accentColor: string;
  visible: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="my-2 overflow-hidden rounded-lg transition-all duration-400"
      style={{
        borderLeft: `2px solid ${accentColor}33`,
        backgroundColor: `${accentColor}06`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
      }}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left transition-colors"
        style={{ backgroundColor: `${accentColor}08` }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Wrench
          className="h-3 w-3 shrink-0"
          style={{ color: accentColor }}
        />
        <span
          className="font-mono text-[0.7rem] font-medium md:text-[0.73rem]"
          style={{ color: accentColor }}
        >
          {name}
        </span>
        {collapsed ? (
          <ChevronRight className="ml-auto h-3 w-3 text-[#555]" />
        ) : (
          <ChevronDown className="ml-auto h-3 w-3 text-[#555]" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-3 pt-1">
          {Object.entries(params).map(([key, value]) => (
            <div
              key={key}
              className="font-mono text-[0.65rem] leading-relaxed md:text-[0.7rem]"
            >
              <span className="text-[#94A3B8]">{key}: </span>
              <span style={{ color: "#28c840" }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolResultBlock({
  lines,
  visible,
}: {
  lines: string[];
  visible: boolean;
}) {
  return (
    <div
      className="my-2 overflow-hidden rounded-lg transition-all duration-400"
      style={{
        borderLeft: "2px solid #28c84033",
        backgroundColor: "#28c84006",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ backgroundColor: "#28c84008" }}
      >
        <Check className="h-3 w-3 shrink-0 text-[#28c840]" />
        <span className="font-mono text-[0.7rem] font-medium text-[#28c840] md:text-[0.73rem]">
          Result
        </span>
      </div>

      <div className="px-4 pb-3 pt-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className="font-mono text-[0.65rem] leading-relaxed text-[#94A3B8] md:text-[0.7rem]"
          >
            {line === "" ? "\u00A0" : line}
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantMessage({
  text,
  accentColor,
  typing,
  onDone,
}: {
  text: string;
  accentColor: string;
  typing: boolean;
  onDone: () => void;
}) {
  const { displayed, done } = useTypewriter(text, 15, typing);

  useEffect(() => {
    if (done && typing) onDone();
  }, [done, typing, onDone]);

  const content = typing ? displayed : text;

  return (
    <div className="py-2">
      <p className="text-[0.72rem] leading-relaxed text-[#c0c0c0] md:text-[0.78rem]">
        {renderInlineCode(content, accentColor)}
        {typing && !done && (
          <span
            className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]"
            style={{ color: accentColor }}
          >
            |
          </span>
        )}
      </p>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */

export function ClaudeUIMockup({
  accentColor = "#6366F1",
  autoplay = true,
  messages = DEFAULT_MESSAGES,
}: ClaudeUIMockupProps) {
  // Phase tracks which message is currently animating
  // -1 = not started, 0..N = message index, N+1 = all done
  const [phase, setPhase] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Check reduced motion once
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Start animation when element enters viewport
  useEffect(() => {
    if (!autoplay || hasStarted.current) return;

    const el = containerRef.current;
    if (!el) return;

    if (reducedMotion) {
      setPhase(messages.length);
      hasStarted.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          // Small delay after becoming visible
          setTimeout(() => setPhase(0), 400);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoplay, messages.length, reducedMotion]);

  // Advance to next phase for non-typing messages (tool_call, tool_result)
  useEffect(() => {
    if (phase < 0 || phase >= messages.length) return;

    const msg = messages[phase];
    if (msg.type === "tool_call") {
      // Tool call fades in, then advance after delay
      const timer = setTimeout(() => setPhase((p) => p + 1), 1200);
      return () => clearTimeout(timer);
    }
    if (msg.type === "tool_result") {
      const timer = setTimeout(() => setPhase((p) => p + 1), 1400);
      return () => clearTimeout(timer);
    }
  }, [phase, messages]);

  const advancePhase = useCallback(() => {
    setPhase((p) => p + 1);
  }, []);

  // Determine if all phases are done (reduced motion or played through)
  const allDone = phase >= messages.length;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]"
      style={{
        border: `1px solid ${accentColor}26`,
        backgroundColor: "#0d0d0d",
      }}
      role="presentation"
      aria-label="Claude Code conversation mockup showing BrainLayer MCP tool usage"
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center px-3 py-2"
        style={{
          backgroundColor: "#1a1a1a",
          borderBottom: `1px solid ${accentColor}0f`,
        }}
      >
        <div className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 text-center font-mono text-[0.72rem] text-[#555]">
          Claude Code
        </span>
        <span className="rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[0.65rem] text-[#444]"
          style={{ border: "1px solid #333" }}
        >
          opus-4.6
        </span>
      </div>

      {/* ── Conversation content ── */}
      <div className="space-y-1 p-4 md:px-5">
        {messages.map((msg, i) => {
          const isVisible = allDone || phase >= i;
          const isTyping = !allDone && phase === i;

          if (!isVisible) return null;

          switch (msg.type) {
            case "user":
              return (
                <UserMessage
                  key={i}
                  text={msg.text}
                  accentColor={accentColor}
                  typing={isTyping}
                  onDone={advancePhase}
                />
              );
            case "tool_call":
              return (
                <ToolCallBlock
                  key={i}
                  name={msg.name}
                  params={msg.params}
                  accentColor={accentColor}
                  visible={isVisible}
                />
              );
            case "tool_result":
              return (
                <ToolResultBlock
                  key={i}
                  lines={msg.lines}
                  visible={isVisible}
                />
              );
            case "assistant":
              return (
                <AssistantMessage
                  key={i}
                  text={msg.text}
                  accentColor={accentColor}
                  typing={isTyping}
                  onDone={advancePhase}
                />
              );
          }
        })}

        {/* Blinking cursor at the bottom when all done */}
        {allDone && (
          <div className="pt-1">
            <span
              className="inline-block font-mono text-xs animate-[blink_1s_step-end_infinite]"
              style={{ color: accentColor }}
            >
              _
            </span>
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div
        className="mx-4 mb-4 rounded-lg border px-3 py-2 font-mono text-[0.7rem] text-[#444] md:mx-5 md:text-[0.73rem]"
        style={{
          borderColor: "#333",
          backgroundColor: "#141414",
        }}
      >
        &gt; Type your message...
      </div>
    </div>
  );
}
