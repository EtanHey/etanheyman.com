import {
  BookOpen,
  EyeOff,
  History,
  Mic,
  RotateCcw,
  Square,
  X,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import {
  COLORS,
  NOTCH_GEOMETRY,
  PLAYBACK_LEVELS,
  RECORDING_LEVELS,
  TELEPROMPTER_WORDS,
  type DemoState,
} from "../model";

type NotchVoiceBarProps = {
  frame: number;
  state: DemoState;
  previousState?: DemoState;
};

type SurfaceGeometry = {
  leading: number;
  trailing: number;
  bodyHeight: number;
};

const CANVAS_WIDTH = 560;
const CORE_CENTER_X = CANVAS_WIDTH / 2;

const geometryForState = (state: DemoState): SurfaceGeometry => {
  switch (state.notch) {
    case "hover":
      return {
        leading: NOTCH_GEOMETRY.hoverLeadingWingWidth,
        trailing: NOTCH_GEOMETRY.hoverTrailingWingWidth,
        bodyHeight: 0,
      };
    case "recording":
      return {
        leading: NOTCH_GEOMETRY.recordingLeadingWingWidth,
        trailing: NOTCH_GEOMETRY.waveformWingWidth,
        bodyHeight: 0,
      };
    case "transcribing":
      return {
        leading: NOTCH_GEOMETRY.compactLeadingWingWidth,
        trailing: NOTCH_GEOMETRY.compactTrailingWingWidth,
        bodyHeight: 0,
      };
    case "speaking":
      return {
        leading: 0,
        trailing: NOTCH_GEOMETRY.waveformWingWidth,
        bodyHeight: NOTCH_GEOMETRY.teleprompterHeight,
      };
    default:
      return { leading: 0, trailing: 0, bodyHeight: 0 };
  }
};

const glassStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(48,52,62,0.92) 0%, rgba(24,27,34,0.92) 58%, rgba(15,17,22,0.96) 100%)",
  border: "1px solid rgba(255,255,255,0.13)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.11), 0 16px 42px rgba(0,0,0,0.30)",
  backdropFilter: "blur(28px) saturate(135%)",
};

const controlStyle: CSSProperties = {
  width: 20,
  height: 20,
  display: "grid",
  placeItems: "center",
  color: "rgba(255,255,255,0.94)",
  flexShrink: 0,
};

const NotchControl = ({
  children,
  destructive = false,
}: {
  children: ReactNode;
  destructive?: boolean;
}) => (
  <div
    style={{
      ...controlStyle,
      borderRadius: "50%",
      background: destructive ? COLORS.recording : "transparent",
      boxShadow: destructive ? "0 0 18px rgba(229,77,77,0.42)" : "none",
    }}
  >
    {children}
  </div>
);

const Waveform = ({
  frame,
  mode,
}: {
  frame: number;
  mode: "recording" | "transcribing" | "speaking";
}) => {
  const color = mode === "recording" ? COLORS.recording : COLORS.speaking;
  const values = mode === "recording" ? RECORDING_LEVELS : PLAYBACK_LEVELS;

  return (
    <div
      style={{
        width: NOTCH_GEOMETRY.waveformWidth,
        height: NOTCH_GEOMETRY.waveformHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      {Array.from({ length: 7 }).map((_, index) => {
        const mirroredDistance = Math.abs(index - 3);
        const sample =
          mode === "transcribing"
            ? 0.22 +
              0.66 * Math.abs(Math.sin(frame / 5.5 - mirroredDistance * 0.72))
            : values[(Math.floor(frame / 3) + index * 2) % values.length];
        const height = 3 + sample * 21;

        return (
          <div
            key={index}
            style={{
              width: 4,
              height,
              borderRadius: 2,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}66`,
            }}
          />
        );
      })}
    </div>
  );
};

const ProcessingSpinner = ({ frame }: { frame: number }) => (
  <div
    style={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: `3px solid ${COLORS.speaking}33`,
      borderTopColor: COLORS.speaking,
      transform: `rotate(${frame * 13}deg)`,
      boxSizing: "border-box",
      boxShadow: `0 0 12px ${COLORS.speaking}33`,
    }}
  />
);

const Wing = ({
  side,
  width,
  children,
}: {
  side: "leading" | "trailing";
  width: number;
  children: ReactNode;
}) => {
  const isLeading = side === "leading";
  const left = isLeading
    ? CORE_CENTER_X - NOTCH_GEOMETRY.coreWidth / 2 - width
    : CORE_CENTER_X + NOTCH_GEOMETRY.coreWidth / 2;

  return (
    <div
      style={{
        ...glassStyle,
        position: "absolute",
        left,
        top: 0,
        width,
        height: NOTCH_GEOMETRY.topHeight,
        borderTop: 0,
        borderLeft: isLeading ? "1px solid rgba(255,255,255,0.13)" : 0,
        borderRight: isLeading ? 0 : "1px solid rgba(255,255,255,0.13)",
        borderRadius: isLeading ? "0 0 0 15px" : "0 0 15px 0",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

const Teleprompter = ({
  frame,
  state,
  height,
}: {
  frame: number;
  state: DemoState;
  height: number;
}) => {
  const localFrame = Math.max(0, frame - state.start);
  const playbackFrames = 225;
  const highlightedIndex = Math.min(
    TELEPROMPTER_WORDS.length - 1,
    Math.floor((localFrame / playbackFrames) * TELEPROMPTER_WORDS.length),
  );
  const controlsOpacity = interpolate(height, [70, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        ...glassStyle,
        position: "absolute",
        left: CORE_CENTER_X - NOTCH_GEOMETRY.teleprompterWidth / 2,
        top: NOTCH_GEOMETRY.topHeight,
        width: NOTCH_GEOMETRY.teleprompterWidth,
        height,
        borderTop: 0,
        borderRadius: "0 0 24px 24px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "24px 32px 58px",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: "7px 6px",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1.42,
        }}
      >
        {TELEPROMPTER_WORDS.map((word, index) => {
          const distance = highlightedIndex - index;
          const opacity =
            index === highlightedIndex
              ? 1
              : index < highlightedIndex
                ? Math.max(0.34, 0.7 - distance * 0.06)
                : 0.34;
          return (
            <span
              key={`${word}-${index}`}
              style={{
                color: `rgba(255,255,255,${opacity})`,
                fontWeight: index === highlightedIndex ? 800 : 600,
                textShadow:
                  index === highlightedIndex
                    ? "0 0 18px rgba(255,255,255,0.22)"
                    : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 17,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          opacity: controlsOpacity,
        }}
      >
        <NotchControl>
          <RotateCcw
            size={15}
            strokeWidth={2.3}
            style={{
              transform: "none",
            }}
          />
        </NotchControl>
        <NotchControl>
          <EyeOff size={15} strokeWidth={2.3} />
        </NotchControl>
        <NotchControl destructive>
          <Square size={9} fill="white" strokeWidth={0} />
        </NotchControl>
      </div>
    </div>
  );
};

export const NotchVoiceBar = ({
  frame,
  state,
  previousState,
}: NotchVoiceBarProps) => {
  const { fps } = useVideoConfig();
  const previous = geometryForState(previousState ?? state);
  const target = geometryForState(state);
  const morph = spring({
    frame: Math.max(0, frame - state.start),
    fps,
    config: { mass: 0.72, stiffness: 310, damping: 31 },
    durationInFrames: 20,
  });
  const leading = interpolate(
    morph,
    [0, 1],
    [previous.leading, target.leading],
  );
  const trailing = interpolate(
    morph,
    [0, 1],
    [previous.trailing, target.trailing],
  );
  const bodyHeight = interpolate(
    morph,
    [0, 1],
    [previous.bodyHeight, target.bodyHeight],
  );
  const contentOpacity = interpolate(frame - state.start, [2, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leadingContent = (() => {
    switch (state.notch) {
      case "hover":
        return <Mic size={17} fill="white" strokeWidth={1.7} />;
      case "recording":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NotchControl destructive>
              <Square size={9} fill="white" strokeWidth={0} />
            </NotchControl>
            <NotchControl>
              <X size={17} strokeWidth={2.3} />
            </NotchControl>
          </div>
        );
      case "transcribing":
        return <ProcessingSpinner frame={frame} />;
      default:
        return null;
    }
  })();

  const trailingContent = (() => {
    switch (state.notch) {
      case "hover":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NotchControl>
              <History size={16} strokeWidth={2.1} />
            </NotchControl>
            <NotchControl>
              <BookOpen size={15} strokeWidth={2.1} />
            </NotchControl>
          </div>
        );
      case "recording":
        return <Waveform frame={frame} mode="recording" />;
      case "transcribing":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Waveform frame={frame} mode="transcribing" />
            <NotchControl>
              <X size={17} strokeWidth={2.3} />
            </NotchControl>
          </div>
        );
      case "speaking":
        return <Waveform frame={frame} mode="speaking" />;
      default:
        return null;
    }
  })();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: CANVAS_WIDTH,
        height: NOTCH_GEOMETRY.topHeight + NOTCH_GEOMETRY.teleprompterHeight,
        transform: "translateX(-50%)",
        filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.24))",
        zIndex: 12,
      }}
    >
      {bodyHeight > 0.5 && (
        <Teleprompter frame={frame} state={state} height={bodyHeight} />
      )}

      {leading > 0.5 && (
        <Wing side="leading" width={leading}>
          <div style={{ opacity: contentOpacity }}>{leadingContent}</div>
        </Wing>
      )}
      {trailing > 0.5 && (
        <Wing side="trailing" width={trailing}>
          <div style={{ opacity: contentOpacity }}>{trailingContent}</div>
        </Wing>
      )}

      <div
        style={{
          position: "absolute",
          left: CORE_CENTER_X - NOTCH_GEOMETRY.coreWidth / 2,
          top: 0,
          width: NOTCH_GEOMETRY.coreWidth,
          height: NOTCH_GEOMETRY.topHeight,
          background: "#000",
          borderRadius: "0 0 7px 7px",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.025)",
          zIndex: 10,
        }}
      />
    </div>
  );
};
