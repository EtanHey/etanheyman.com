import { interpolate } from "remotion";
import { TARGETED_REDACTIONS, type TargetedRedaction } from "../redactions";

const topAtFrame = (frame: number, redaction: TargetedRedaction) => {
  const points = redaction.topKeyframes;
  if (points.length === 1) return points[0].value;

  return interpolate(
    frame,
    points.map((point) => point.frame),
    points.map((point) => point.value),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

export const TargetedRedactions = ({
  frame,
  cut,
}: {
  frame: number;
  cut: "hero" | "making-of";
}) => (
  <>
    {TARGETED_REDACTIONS.filter(
      (redaction) =>
        redaction.cut === cut &&
        frame >= redaction.start &&
        frame < redaction.end,
    ).map((redaction) => (
      <div
        key={redaction.id}
        style={{
          position: "absolute",
          left: redaction.left,
          top: topAtFrame(frame, redaction),
          width: redaction.width,
          height: redaction.height,
          overflow: "hidden",
          boxSizing: "border-box",
          background: redaction.background,
          color: redaction.color,
          fontFamily: "Menlo, Monaco, 'SFMono-Regular', monospace",
          fontSize: 12,
          lineHeight: `${redaction.height}px`,
          whiteSpace: "nowrap",
          zIndex: 7,
        }}
      >
        {redaction.replacement}
      </div>
    ))}
  </>
);
