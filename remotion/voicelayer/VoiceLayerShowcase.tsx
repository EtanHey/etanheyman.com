import { Check, Film, Keyboard, ScanSearch, Split, Waves } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ContextMenu } from "./components/ContextMenu";
import { NotchVoiceBar } from "./components/NotchVoiceBar";
import { RealFootageBase } from "./components/RealDesktop";
import { TargetedRedactions } from "./components/TargetedRedactions";
import {
  COLORS,
  HERO_STATES,
  MAKING_OF_STATES,
  stateAtFrame,
  type DemoState,
  type HeroStateId,
  type MakingOfStateId,
} from "./model";

const currentAndPrevious = <TId extends string>(
  frame: number,
  states: readonly DemoState<TId>[],
) => {
  const state = stateAtFrame(frame, states);
  const index = states.findIndex((candidate) => candidate.id === state.id);
  return { state, previous: index > 0 ? states[index - 1] : undefined };
};

const HeroCue = ({
  frame,
  state,
}: {
  frame: number;
  state: DemoState<HeroStateId>;
}) => {
  const local = frame - state.start;
  const opacity = Math.min(
    interpolate(local, [0, 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(state.end - frame, [0, 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  if (state.id === "ready" || state.id === "context-menu") return null;

  return (
    <div
      style={{
        position: "absolute",
        right: 28,
        top: 54,
        height: 36,
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "0 13px",
        borderRadius: 10,
        opacity,
        color: "rgba(255,255,255,.82)",
        background: "rgba(17,20,27,.88)",
        border: "1px solid rgba(255,255,255,.10)",
        boxShadow: "0 10px 28px rgba(0,0,0,.28)",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 12,
        fontWeight: 650,
        zIndex: 20,
      }}
    >
      {state.id === "recording" ? (
        <Keyboard size={15} color={COLORS.recording} />
      ) : state.id === "teleprompter" ? (
        <Waves size={15} color={COLORS.speaking} />
      ) : (
        <Check size={15} color="#78dca0" />
      )}
      {state.label}
    </div>
  );
};

const ChapterLabel = ({ state }: { state: DemoState<MakingOfStateId> }) => (
  <div
    style={{
      position: "absolute",
      right: 28,
      top: 54,
      padding: "10px 14px",
      borderRadius: 10,
      color: "rgba(255,255,255,.78)",
      background: "rgba(17,20,27,.88)",
      border: "1px solid rgba(255,255,255,.10)",
      boxShadow: "0 10px 28px rgba(0,0,0,.28)",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: 12,
      fontWeight: 700,
      zIndex: 20,
    }}
  >
    {state.label}
  </div>
);

const QaFrameFinding = ({ frame, start }: { frame: number; start: number }) => {
  const reveal = interpolate(frame - start, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 84,
        bottom: 118,
        width: 590,
        padding: 18,
        borderRadius: 16,
        opacity: reveal,
        transform: `translateY(${interpolate(reveal, [0, 1], [16, 0])}px)`,
        color: "white",
        background: "rgba(16,19,27,.96)",
        border: "1px solid rgba(143,198,255,.26)",
        boxShadow: "0 24px 70px rgba(0,0,0,.42)",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        zIndex: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#8fc6ff", fontSize: 12, fontWeight: 800, letterSpacing: ".08em" }}>
        <ScanSearch size={16} /> QA-VIDEO · FRAME 00:17:16.233
      </div>
      <div
        style={{
          height: 150,
          marginTop: 14,
          position: "relative",
          overflow: "hidden",
          borderRadius: 10,
          background: "#080a0f",
          border: "1px solid rgba(255,255,255,.09)",
        }}
      >
        <div style={{ position: "absolute", left: "50%", top: 0, width: 185, height: 32, transform: "translateX(-50%)", borderRadius: "0 0 7px 7px", background: "#000" }} />
        <div style={{ position: "absolute", left: "calc(50% + 92px)", top: 0, width: 92, height: 32, borderRadius: "0 0 13px 0", background: "linear-gradient(180deg,#343944,#181b22)" }} />
        <div style={{ position: "absolute", left: "calc(50% + 100px)", top: 11, width: 48, borderTop: "2px solid #e54d4d" }} />
        <div style={{ position: "absolute", left: "calc(50% + 92px)", top: 35, width: 1, height: 82, background: "#ffd166", boxShadow: "0 0 12px #ffd166" }} />
        <div style={{ position: "absolute", left: "calc(50% + 111px)", top: 64, color: "#ffd166", fontFamily: "Menlo, monospace", fontSize: 12 }}>24 px gap starts here</div>
      </div>
      <div style={{ marginTop: 13, color: "rgba(255,255,255,.68)", fontSize: 14 }}>
        The pointer and right wing diverge at one exact boundary.
      </div>
    </div>
  );
};

const AgentLanes = ({ frame, start }: { frame: number; start: number }) => {
  const reveal = interpolate(frame - start, [12, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        bottom: 118,
        width: 650,
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 10,
        opacity: reveal,
        transform: `translateY(${interpolate(reveal, [0, 1], [14, 0])}px)`,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        zIndex: 18,
      }}
    >
      {[
        ["GEOMETRY", "Match the fixed core"],
        ["INTERACTION", "Unify the hit region"],
        ["VISUAL QA", "Replay every state"],
      ].map(([title, detail], index) => (
        <div key={title} style={{ minHeight: 122, padding: 15, borderRadius: 13, color: "white", background: "rgba(17,20,28,.96)", border: "1px solid rgba(181,117,255,.23)", boxShadow: "0 18px 52px rgba(0,0,0,.34)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c79aff", fontSize: 11, fontWeight: 800 }}>
            <Split size={14} /> CODEX · LANE {index + 1}
          </div>
          <div style={{ marginTop: 15, fontSize: 14, fontWeight: 800 }}>{title}</div>
          <div style={{ marginTop: 7, color: "rgba(255,255,255,.52)", fontSize: 12, lineHeight: 1.4 }}>{detail}</div>
        </div>
      ))}
    </div>
  );
};

const PullRequestReceipts = ({ frame, start }: { frame: number; start: number }) => {
  const reveal = interpolate(frame - start, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 88,
        bottom: 116,
        width: 530,
        padding: 17,
        borderRadius: 15,
        opacity: reveal,
        background: "rgba(16,20,27,.96)",
        border: "1px solid rgba(120,220,160,.23)",
        boxShadow: "0 22px 64px rgba(0,0,0,.40)",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        zIndex: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#78dca0", fontSize: 12, fontWeight: 850, letterSpacing: ".08em" }}>
        <Film size={15} /> REVIEWED · LANDED
      </div>
      {[
        ["#371", "Hover controls"],
        ["#372", "Right-click menu"],
        ["#373", "Pointer alignment"],
      ].map(([number, title]) => (
        <div key={number} style={{ display: "grid", gridTemplateColumns: "62px 1fr 22px", alignItems: "center", gap: 8, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.07)", fontSize: 14 }}>
          <span style={{ color: "#8fc6ff", fontFamily: "Menlo, monospace" }}>{number}</span>
          <span>{title}</span>
          <Check size={16} color="#78dca0" />
        </div>
      ))}
    </div>
  );
};

const VerifiedBadge = ({ frame, start }: { frame: number; start: number }) => {
  const reveal = interpolate(frame - start, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", right: 78, bottom: 118, display: "flex", alignItems: "center", gap: 14, padding: "17px 20px", borderRadius: 15, opacity: reveal, color: "white", background: "rgba(14,22,20,.96)", border: "1px solid rgba(120,220,160,.26)", boxShadow: "0 22px 62px rgba(0,0,0,.38)", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", zIndex: 18 }}>
      <span style={{ width: 34, height: 34, borderRadius: 17, display: "grid", placeItems: "center", background: "rgba(120,220,160,.14)" }}><Check size={19} color="#78dca0" /></span>
      <div><div style={{ fontSize: 15, fontWeight: 820 }}>Verified in the real desktop</div><div style={{ marginTop: 4, color: "rgba(255,255,255,.50)", fontSize: 12 }}>120 fps replay · shipped v2.1.17 geometry</div></div>
    </div>
  );
};

export const VoiceLayerHero = () => {
  const frame = useCurrentFrame();
  const { state, previous } = currentAndPrevious(frame, HERO_STATES);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", color: "white" }}>
      <RealFootageBase cut="hero" />
      <TargetedRedactions frame={frame} cut="hero" />
      <NotchVoiceBar frame={frame} state={state} previousState={previous} />
      <HeroCue frame={frame} state={state} />
      {state.id === "context-menu" && (
        <ContextMenu frame={frame} start={state.start} end={state.end} />
      )}
    </AbsoluteFill>
  );
};

export const VoiceLayerMakingOf = () => {
  const frame = useCurrentFrame();
  const { state, previous } = currentAndPrevious(frame, MAKING_OF_STATES);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", color: "white" }}>
      <RealFootageBase cut="making-of" />
      <TargetedRedactions frame={frame} cut="making-of" />
      <NotchVoiceBar frame={frame} state={state} previousState={previous} />
      <ChapterLabel state={state} />
      {state.id === "qa-frame" && <QaFrameFinding frame={frame} start={state.start} />}
      {(state.id === "brief-agents" || state.id === "parallel-fixes") && <AgentLanes frame={frame} start={state.start} />}
      {state.id === "review-prs" && <PullRequestReceipts frame={frame} start={state.start} />}
      {state.id === "verified" && <VerifiedBadge frame={frame} start={state.start} />}
    </AbsoluteFill>
  );
};
