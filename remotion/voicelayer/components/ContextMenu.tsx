import { ChevronRight, MousePointer2 } from "lucide-react";
import { interpolate } from "remotion";

const MENU_ITEMS = [
  "Settings",
  "Hide for 1 hour",
  "Recent Transcripts",
  "Paste last transcript",
  "Copy last transcript",
  "Transcription Tools",
  "Preferences",
] as const;

export const ContextMenu = ({
  frame,
  start,
  end,
}: {
  frame: number;
  start: number;
  end: number;
}) => {
  const local = frame - start;
  const fadeIn = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - 12, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reveal = Math.min(fadeIn, fadeOut);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "calc(50% + 98px)",
          width: 292,
          padding: 6,
          borderRadius: 11,
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [-7, 0])}px) scale(${interpolate(reveal, [0, 1], [0.97, 1])})`,
          transformOrigin: "top left",
          color: "#202124",
          background: "rgba(244,244,244,.97)",
          border: "1px solid rgba(0,0,0,.20)",
          boxShadow: "0 18px 50px rgba(0,0,0,.38), inset 0 1px 0 #fff",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 14,
          zIndex: 30,
        }}
      >
        {MENU_ITEMS.map((item) => {
          const hasSubmenu =
            item === "Recent Transcripts" ||
            item === "Transcription Tools" ||
            item === "Preferences";
          return (
            <div
              key={item}
              style={{
                height: 30,
                padding: "0 9px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{item}</span>
              {hasSubmenu && <ChevronRight size={14} strokeWidth={2} />}
            </div>
          );
        })}
      </div>
      <MousePointer2
        size={30}
        fill="white"
        color="#111"
        strokeWidth={1.5}
        style={{
          position: "absolute",
          left: "calc(50% + 78px)",
          top: 25,
          opacity: reveal,
          filter: "drop-shadow(0 3px 3px rgba(0,0,0,.6))",
          zIndex: 31,
        }}
      />
    </>
  );
};
