import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const websiteRoot = resolve(import.meta.dirname, "..");
const voiceLayerRoot = resolve(homedir(), "Gits/voicelayer");
const stageRoot = resolve(websiteRoot, "public/demos/source-private");
const ffmpeg = "/opt/homebrew/bin/ffmpeg";

const sources = [
  {
    name: "hero-panes.mp4",
    source: resolve(
      voiceLayerRoot,
      "docs.local/qa/2026-07-13-teleprompter-live-test.mov",
    ),
    start: "35",
    duration: "16",
  },
  {
    name: "making-rightclick.mp4",
    source: resolve(
      voiceLayerRoot,
      "docs.local/qa/notch-363c-2026-07-21/rightclick-clip.mov",
    ),
    start: "5",
    duration: "16",
  },
  {
    name: "making-verdict.mp4",
    source: resolve(
      voiceLayerRoot,
      "docs.local/qa/notch-363c-2026-07-21/verdict-clip-2316.mov",
    ),
    start: "20",
    duration: "16",
  },
  {
    name: "making-teleprompter-panes.mp4",
    source: resolve(
      voiceLayerRoot,
      "docs.local/qa/2026-07-13-teleprompter-live-test.mov",
    ),
    start: "35",
    duration: "16",
  },
];

if (!existsSync(ffmpeg)) throw new Error(`Required FFmpeg not found: ${ffmpeg}`);
mkdirSync(stageRoot, { recursive: true });
for (const legacyName of [
  "rightclick.mov",
  "verdict.mov",
  "teleprompter.mov",
  "hero.mp4",
  "hero-teleprompter.mp4",
  "making-teleprompter.mp4",
]) {
  const legacyPath = resolve(stageRoot, legacyName);
  if (lstatSafe(legacyPath)) unlinkSync(legacyPath);
}

let rendered = 0;
for (const item of sources) {
  if (!existsSync(item.source)) {
    throw new Error(`Missing approved VoiceLayer QA source: ${item.name}`);
  }

  const destination = resolve(stageRoot, item.name);
  const existing = lstatSafe(destination);
  if (existing?.isSymbolicLink()) unlinkSync(destination);

  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      item.start,
      "-i",
      item.source,
      "-t",
      item.duration,
      "-vf",
      "scale=1920:-2,fps=60",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "22",
      "-pix_fmt",
      "yuv420p",
      "-map_metadata",
      "-1",
      "-map_chapters",
      "-1",
      "-movflags",
      "+faststart",
      "-y",
      destination,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(`FFmpeg failed for ${item.name}: ${result.stderr}`);
  }
  rendered += 1;
}

console.log(
  `Prepared ${sources.length} ignored, muted VoiceLayer proxy clips (${rendered} refreshed).`,
);

function lstatSafe(path) {
  try {
    return lstatSync(path);
  } catch {
    return null;
  }
}
