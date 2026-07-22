import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";

const SOURCE = {
  hero: staticFile("demos/source-private/hero-panes.mp4"),
  rightclick: staticFile("demos/source-private/making-rightclick.mp4"),
  verdict: staticFile("demos/source-private/making-verdict.mp4"),
  teleprompter: staticFile("demos/source-private/making-teleprompter-panes.mp4"),
} as const;

const SCREEN_LEFT = 124;
const SCREEN_WIDTH = 1_672;

const SourceVideo = ({
  src,
  playbackRate = 0.5,
}: {
  src: string;
  playbackRate?: number;
}) => (
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
