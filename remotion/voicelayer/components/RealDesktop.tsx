import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import {
  PASTED_TRANSCRIPT,
  SPEAK_REQUEST,
  type DemoState,
  type HeroStateId,
  type MakingOfStateId,
} from "../model";

const SOURCE = {
  hero: staticFile("demos/source-private/hero-panes.mp4"),
  rightclick: staticFile("demos/source-private/making-rightclick.mp4"),
  verdict: staticFile("demos/source-private/making-verdict.mp4"),
  teleprompter: staticFile("demos/source-private/making-teleprompter-panes.mp4"),
} as const;

const SCREEN_LEFT = 124;
const SCREEN_WIDTH = 1_672;
// The 3456×2234 capture is scaled into a 1672×1080 viewport. These seams are
// measured from the source pixels so the privacy layer follows cmux exactly.
const RAIL_WIDTH = 278;
const WORKSPACE_LEFT = SCREEN_LEFT + RAIL_WIDTH;
const THREE_PANE_SPLIT = 1_098;

const SourceVideo = ({ src, playbackRate = 0.5 }: { src: string; playbackRate?: number }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#05060a" }}>
    <OffthreadVideo
      src={src}
      playbackRate={playbackRate}
      muted
      pauseWhenBuffering
      style={{
        position: "absolute",
        left: SCREEN_LEFT,
        top: 0,
        width: SCREEN_WIDTH,
        height: 1_080,
        objectFit: "fill",
        boxShadow: "0 0 80px rgba(0,0,0,.7)",
      }}
    />
  </AbsoluteFill>
);

const CapturedMacMenuBar = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 33,
      overflow: "hidden",
      zIndex: 1,
    }}
  >
    {[0, 900, 1_800].map((from) => (
      <Sequence key={from} from={from} durationInFrames={900} premountFor={30}>
        <SourceVideo src={SOURCE.hero} />
      </Sequence>
    ))}
  </div>
);

export const RealFootageBase = ({ cut }: { cut: "hero" | "making-of" }) => {
  if (cut === "hero") return <SourceVideo src={SOURCE.hero} />;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={900} premountFor={30}>
        <SourceVideo src={SOURCE.rightclick} />
      </Sequence>
      <Sequence from={900} durationInFrames={900} premountFor={30}>
        <SourceVideo src={SOURCE.verdict} />
      </Sequence>
      <Sequence from={1_800} durationInFrames={900} premountFor={30}>
        <SourceVideo src={SOURCE.teleprompter} />
      </Sequence>
      <CapturedMacMenuBar />
    </AbsoluteFill>
  );
};

type SafeLine = { text: string; tone?: "muted" | "green" | "blue" | "purple" | "red" | "white" };

const toneColor = (tone: SafeLine["tone"]) => {
  switch (tone) {
    case "green": return "#73d99d";
    case "blue": return "#8dc5ff";
    case "purple": return "#c695ff";
    case "red": return "#ec6b72";
    case "white": return "rgba(255,255,255,.92)";
    default: return "rgba(220,225,236,.54)";
  }
};

const sharedVerification: SafeLine[] = [
  { text: "", tone: "muted" },
  { text: "● VoiceBar acceptance", tone: "white" },
  { text: "  └─ fixed camera core · 185 × 32", tone: "muted" },
  { text: "  └─ shared waveform viewport · 46 × 24", tone: "muted" },
  { text: "  └─ core-to-waveform gap · 24 px", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "● Focused checks", tone: "white" },
  { text: "  ✓ recording waveform follows the microphone", tone: "green" },
  { text: "  ✓ processing keeps the same viewport", tone: "green" },
  { text: "  ✓ transcript inserts once at the cursor", tone: "green" },
  { text: "  ✓ right-click opens from the full VoiceBar", tone: "green" },
  { text: "", tone: "muted" },
  { text: "● Local replay", tone: "white" },
  { text: "  /Users/you/Gits/voicelayer", tone: "blue" },
  { text: "  branch · isolated showcase", tone: "muted" },
  { text: "  capture · real Mac · 120 fps", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "● Acceptance event trace", tone: "white" },
  { text: "  00:00.000  VoiceBar resident discovered", tone: "muted" },
  { text: "  00:00.184  active application retained", tone: "muted" },
  { text: "  00:01.042  F5 press routed to VoiceBar", tone: "blue" },
  { text: "  00:01.058  microphone level stream opened", tone: "muted" },
  { text: "  00:04.714  F5 release received", tone: "blue" },
  { text: "  00:04.731  local transcription started", tone: "muted" },
  { text: "  00:05.286  cursor target restored", tone: "muted" },
  { text: "  00:05.301  transcript inserted exactly once", tone: "green" },
  { text: "  00:06.020  asynchronous playback requested", tone: "blue" },
  { text: "  00:06.104  teleprompter word sync started", tone: "muted" },
  { text: "  00:09.886  playback completed", tone: "green" },
  { text: "", tone: "muted" },
  { text: "● Visual contract", tone: "white" },
  { text: "  hover wing expands around a fixed black core", tone: "muted" },
  { text: "  recording uses the live microphone envelope", tone: "muted" },
  { text: "  processing changes color without changing truth", tone: "muted" },
  { text: "  teleprompter highlights the spoken word in place", tone: "muted" },
  { text: "  context menu belongs to the entire VoiceBar surface", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "✓ ready for visual review", tone: "green" },
];

const heroLeadLines = (state: DemoState<HeroStateId>): SafeLine[] => [
  { text: "VOICEBAR · LIVE ACCEPTANCE", tone: "purple" },
  { text: "", tone: "muted" },
  { text: "● F5 push-to-talk", tone: "white" },
  { text: state.id === "recording" ? "  ● microphone stream active" : "  ✓ hotkey relay ready", tone: state.id === "recording" ? "red" : "green" },
  { text: state.id === "transcribing" ? "  ● transcribing locally" : "  ✓ active cursor retained", tone: state.id === "transcribing" ? "blue" : "green" },
  { text: state.id === "paste" || state.id === "teleprompter" || state.id === "context-menu" ? `  › ${PASTED_TRANSCRIPT}` : "  › speak naturally, then release F5", tone: "white" },
  { text: "", tone: "muted" },
  { text: "● Agent voice", tone: "white" },
  { text: `  ${SPEAK_REQUEST}`, tone: "blue" },
  { text: state.id === "teleprompter" ? "  ● synchronized playback visible above" : "  ○ waiting for playback", tone: state.id === "teleprompter" ? "blue" : "muted" },
  ...sharedVerification,
];

const heroReviewLines = (state: DemoState<HeroStateId>): SafeLine[] => [
  { text: "Ran npm run demo:sanitize", tone: "white" },
  { text: "  VoiceLayer demo sanitization passed", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "Viewed Image", tone: "white" },
  { text: `  VoiceBar · ${state.label}`, tone: "blue" },
  { text: "", tone: "muted" },
  { text: "Edited 3 files (+42 -12)", tone: "white" },
  { text: "  remotion/voicelayer/NotchVoiceBar.tsx", tone: "muted" },
  { text: "- static sample levels", tone: "red" },
  { text: "+ live state-driven waveform", tone: "green" },
  { text: "  remotion/voicelayer/RealDesktop.tsx", tone: "muted" },
  { text: "- generic terminal canvas", tone: "red" },
  { text: "+ source-aligned cmux panes", tone: "green" },
  { text: "", tone: "muted" },
  { text: "Ran npx vitest run", tone: "white" },
  { text: "  9 tests passed", tone: "green" },
  { text: "", tone: "muted" },
  { text: "Working · replaying the final frame set", tone: "purple" },
];

const makingLeadLines = (state: DemoState<MakingOfStateId>): SafeLine[] => {
  const stage: Record<MakingOfStateId, SafeLine[]> = {
    "dictate-problem": [
      { text: "● Voice note received", tone: "red" },
      { text: "  The pointer and right wing need one shared anchor.", tone: "white" },
      { text: "  Keep the camera core fixed while controls morph.", tone: "white" },
      { text: "  ✓ inserted at the active cursor", tone: "green" },
    ],
    "qa-frame": [
      { text: "● qa-video · frame scan", tone: "blue" },
      { text: "  3,600 frames sampled from the real capture", tone: "muted" },
      { text: "  finding · 00:17:16.233", tone: "purple" },
      { text: "  right wing begins before the shared hit region", tone: "white" },
    ],
    "brief-agents": [
      { text: "● Lead brief", tone: "purple" },
      { text: "  lane 1 · match the notch geometry contract", tone: "white" },
      { text: "  lane 2 · verify right-click hit testing", tone: "white" },
      { text: "  lane 3 · replay the acceptance capture", tone: "white" },
    ],
    "parallel-fixes": [
      { text: "● cmux · focused lanes", tone: "purple" },
      { text: "  geometry        ● working", tone: "blue" },
      { text: "  interaction     ✓ checks passing", tone: "green" },
      { text: "  visual replay   ● comparing frames", tone: "blue" },
    ],
    "review-prs": [
      { text: "● Review receipts", tone: "blue" },
      { text: "  #371  hover controls          ✓", tone: "green" },
      { text: "  #372  right-click menu         ✓", tone: "green" },
      { text: "  #373  pointer alignment        ✓", tone: "green" },
    ],
    verified: [
      { text: "● Final replay", tone: "green" },
      { text: "  ✓ camera core stays fixed", tone: "green" },
      { text: "  ✓ menu and pointer share one hit region", tone: "green" },
      { text: "  ✓ waveform begins after the core gap", tone: "green" },
    ],
  };
  return [
    { text: "VOICELAYER · MAKING OF", tone: "purple" },
    { text: "", tone: "muted" },
    ...stage[state.id],
    ...sharedVerification,
  ];
};

const makingReviewLines = (state: DemoState<MakingOfStateId>): SafeLine[] => [
  { text: "Ran frame-level acceptance", tone: "white" },
  { text: `  ${state.label}`, tone: "blue" },
  { text: "  source · real 120 fps Mac capture", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "Viewed Image", tone: "white" },
  { text: "  pointer / wing boundary", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "Edited 2 files (+18 -7)", tone: "white" },
  { text: "- independent hover anchors", tone: "red" },
  { text: "+ shared VoiceBar hit region", tone: "green" },
  { text: "- unverified visual offset", tone: "red" },
  { text: "+ replayed exact source frame", tone: "green" },
  { text: "", tone: "muted" },
  { text: "Ran privacy acceptance", tone: "white" },
  { text: "  source prose substituted", tone: "green" },
  { text: "  source audio omitted", tone: "green" },
  { text: "  OCR frame scan passed", tone: "green" },
  { text: "", tone: "muted" },
  { text: "Working · preparing review receipt", tone: "purple" },
];

const SessionRail = ({ threePane }: { threePane: boolean }) => (
  <div
    style={{
      position: "absolute",
      left: SCREEN_LEFT + 4,
      top: 33,
      width: RAIL_WIDTH - 5,
      bottom: 0,
      padding: "12px 10px",
      boxSizing: "border-box",
      color: "rgba(255,255,255,.86)",
      background: "rgba(35,24,47,.94)",
      backdropFilter: "blur(28px)",
      fontFamily: "Menlo, Monaco, monospace",
      fontSize: 10.5,
      zIndex: 4,
    }}
  >
    <div style={{ height: 28, display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,.88)", fontWeight: 760, marginBottom: 8 }}>
      <span style={{ width: 18, height: 18, display: "grid", placeItems: "center", borderRadius: 9, background: "rgba(255,255,255,.13)", fontSize: 9 }}>3</span>
      voicelayerClaude
    </div>
    {[
      ["voicelayer · lead", "active"],
      ["VL: product demo", "working"],
      ["codex · geometry", threePane ? "reviewing frames" : "ready"],
      ["codex · interaction", "checks passing"],
    ].map(([title, detail], index) => (
      <div key={title} style={{ marginBottom: 7, padding: "10px 9px", borderRadius: 6, background: index === 0 ? "linear-gradient(135deg,rgba(127,48,177,.68),rgba(89,34,125,.76))" : "rgba(255,255,255,.025)", border: index === 0 ? "1px solid rgba(211,170,255,.31)" : "1px solid transparent" }}>
        <div style={{ fontWeight: 760 }}>{title}</div>
        <div style={{ marginTop: 4, color: "rgba(255,255,255,.40)", fontSize: 9 }}>{detail}</div>
      </div>
    ))}
  </div>
);

const SafePane = ({
  left,
  width,
  title,
  lines,
  frame,
  kind,
}: {
  left: number;
  width: number;
  title: string;
  lines: SafeLine[];
  frame: number;
  kind: "claude" | "codex";
}) => (
  <div
    style={{
      position: "absolute",
      left: left + 3,
      top: 33,
      width: width - 4,
      bottom: 0,
      overflow: "hidden",
      color: "rgba(228,232,240,.72)",
      background: "rgba(28,31,40,.66)",
      backdropFilter: "blur(28px)",
      fontFamily: "Menlo, Monaco, 'SFMono-Regular', monospace",
      zIndex: 3,
    }}
  >
    <div style={{ height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", boxSizing: "border-box", borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(25,27,36,.96)", fontSize: 11, fontWeight: 720 }}>
      <span style={{ color: "#73d99d" }}>●</span>
      {title}
      <span style={{ marginLeft: "auto", color: "rgba(255,255,255,.34)", letterSpacing: ".25em" }}>▣ ◉ ◫</span>
    </div>
    <div style={{ position: "absolute", inset: "40px 0 100px", padding: "13px 16px", boxSizing: "border-box", fontSize: 11.5, lineHeight: 1.34 }}>
      {lines.map((line, index) => {
        const isEvent = line.text.startsWith("● ") || /^(Ran|Viewed Image|Edited|Working)/.test(line.text);
        const isDiff = line.text.startsWith("+") || line.text.startsWith("-");
        return (
          <div
            key={`${index}-${line.text}`}
            style={{
              minHeight: 15.5,
              marginTop: isEvent && index > 0 ? 7 : 0,
              padding: isDiff ? "1px 5px" : 0,
              color: toneColor(line.tone),
              background: line.text.startsWith("+")
                ? "rgba(31,107,75,.24)"
                : line.text.startsWith("-")
                  ? "rgba(129,50,55,.24)"
                  : "transparent",
              fontWeight: isEvent ? 720 : 430,
              whiteSpace: "pre-wrap",
              overflow: "hidden",
            }}
          >
            {isEvent && <span style={{ color: kind === "claude" ? "#68dc93" : "#a9c8ff", marginRight: 7 }}>•</span>}
            {line.text || "\u00a0"}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 10, right: 10, bottom: 38, height: 52, display: "flex", alignItems: "center", padding: "0 11px", borderTop: "1px solid rgba(255,255,255,.26)", borderBottom: "1px solid rgba(255,255,255,.26)", background: kind === "codex" ? "rgba(82,84,96,.62)" : "rgba(20,22,29,.72)", color: "rgba(255,255,255,.60)", fontSize: 10.5 }}>
      <span style={{ color: kind === "claude" ? "#f2f2f2" : "#c8d5ee", marginRight: 8 }}>{kind === "claude" ? "›" : "▌"}</span>
      {kind === "claude" ? "Describe the next VoiceLayer check" : "Improve the focused VoiceBar change"}
      <span style={{ display: "inline-block", width: 7, height: 13, marginLeft: 4, background: frame % 28 < 17 ? "#c695ff" : "transparent" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 38, display: "flex", alignItems: "center", gap: 13, padding: "0 14px", boxSizing: "border-box", color: "rgba(255,255,255,.54)", background: "rgba(22,24,31,.98)", borderTop: "1px solid rgba(255,255,255,.07)", fontSize: 9.5 }}>
      {kind === "claude" ? (
        <><span style={{ color: "#8fd8ff" }}>main</span><span style={{ color: "#64d98b" }}>+24 -3</span><span style={{ color: "#d596ff" }}>Opus 4.8</span><span>VoiceBar connected</span></>
      ) : (
        <><span style={{ color: "#e2b64f" }}>gpt-5.6-sol xhigh</span><span>·</span><span style={{ color: "#70c9bd" }}>/Users/you/Gits/voicelayer</span></>
      )}
    </div>
  </div>
);

const SeamMask = ({ left }: { left: number }) => (
  <div
    style={{
      position: "absolute",
      left: left - 10,
      top: 33,
      width: 20,
      bottom: 0,
      background: "rgba(21,23,31,.98)",
      borderLeft: "1px solid rgba(255,255,255,.05)",
      borderRight: "1px solid rgba(255,255,255,.09)",
      backdropFilter: "blur(16px)",
      zIndex: 6,
    }}
  />
);

export const PrivacyDesktop = ({
  frame,
  cut,
  state,
}: {
  frame: number;
  cut: "hero" | "making-of";
  state: DemoState<HeroStateId> | DemoState<MakingOfStateId>;
}) => {
  const threePane = cut === "hero" || frame >= 1_800;
  const leadLines = cut === "hero"
    ? heroLeadLines(state as DemoState<HeroStateId>)
    : makingLeadLines(state as DemoState<MakingOfStateId>);
  const reviewLines = cut === "hero"
    ? heroReviewLines(state as DemoState<HeroStateId>)
    : makingReviewLines(state as DemoState<MakingOfStateId>);

  return (
    <AbsoluteFill>
      <SessionRail threePane={threePane} />
      <SeamMask left={WORKSPACE_LEFT} />
      <SafePane
        left={WORKSPACE_LEFT}
        width={(threePane ? THREE_PANE_SPLIT : SCREEN_LEFT + SCREEN_WIDTH) - WORKSPACE_LEFT}
        title="VoiceLayer · lead"
        lines={leadLines}
        frame={frame}
        kind="claude"
      />
      {threePane && (
        <>
          <SeamMask left={THREE_PANE_SPLIT} />
          <SafePane
            left={THREE_PANE_SPLIT}
            width={SCREEN_LEFT + SCREEN_WIDTH - THREE_PANE_SPLIT}
            title={cut === "hero" ? "VL: product demo" : "VL: frame QA + review"}
            lines={reviewLines}
            frame={frame}
            kind="codex"
          />
        </>
      )}
    </AbsoluteFill>
  );
};
