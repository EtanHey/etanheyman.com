import { Film, Play, ShieldCheck } from "lucide-react";

const HERO_VIDEO_SRC = "/demos/voicelayer-hero.mp4";
const HERO_POSTER_SRC = "/demos/voicelayer-hero-poster.png";
const MAKING_OF_VIDEO_SRC = "/demos/voicelayer-making-of.mp4";
const MAKING_OF_POSTER_SRC = "/demos/voicelayer-making-of-poster.png";

const DemoHeader = ({
  icon,
  title,
  duration,
}: {
  icon: React.ReactNode;
  title: string;
  duration: string;
}) => (
  <div className="flex flex-col gap-3 border-b border-white/[0.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#4a90d9]/15 text-[#8fc6ff]">
        {icon}
      </span>
      {title} · {duration}
    </div>
    <div className="flex items-center gap-2 text-[11px] text-white/38">
      <ShieldCheck
        className="h-3.5 w-3.5 text-[#73d89b]"
        aria-hidden="true"
      />
      Real Mac footage · hard-redacted
    </div>
  </div>
);

export function VoiceLayerDemo() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#070a12] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
        <DemoHeader
          icon={<Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />}
          title="VoiceBar · product demo"
          duration="30 sec"
        />
        <div className="relative aspect-video bg-black">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster={HERO_POSTER_SRC}
            aria-label="VoiceLayer product demonstration on a real hard-redacted Mac showing F5 dictation, cursor insertion, teleprompter playback, and the right-click menu"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </div>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#070a12] shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
        <DemoHeader
          icon={<Film className="h-3.5 w-3.5" aria-hidden="true" />}
          title="How it was made"
          duration="90 sec"
        />
        <div className="relative aspect-video bg-black">
          <video
            className="h-full w-full object-cover"
            muted
            playsInline
            controls
            preload="metadata"
            poster={MAKING_OF_POSTER_SRC}
            aria-label="Making-of film showing a dictated VoiceLayer issue moving through frame-level QA, focused agent lanes, reviewed pull requests, and visual verification"
          >
            <source src={MAKING_OF_VIDEO_SRC} type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </div>
      </section>
    </div>
  );
}
