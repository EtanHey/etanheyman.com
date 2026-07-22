import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const allowMissingAssets = process.argv.includes("--allow-missing-assets");
const policyOnly = process.argv.includes("--policy-only");
const requestedTextFiles = process.argv
  .filter((argument) => argument.startsWith("--scan-text="))
  .map((argument) => resolve(root, argument.slice("--scan-text=".length)));
const frameDirs = process.argv
  .filter((argument) => argument.startsWith("--frames-dir="))
  .map((argument) => resolve(root, argument.slice("--frames-dir=".length)));

const sourceRoots = policyOnly ? [] : [
  resolve(root, "remotion/voicelayer"),
  resolve(root, "app/(portfolio)/projects/[slug]/components/VoiceLayerDemo.tsx"),
];
const publishedSlices = policyOnly ? [] : [
  {
    path: resolve(root, "app/(portfolio)/projects/[slug]/page.tsx"),
    start: "{/* ─── VoiceLayer product demo ─── */}",
    end: "{/* ─── Claude UI Mockup (BrainLayer only) ─── */}",
  },
  {
    path: resolve(root, "app/(portfolio)/projects/[slug]/terminal-showcase-config.ts"),
    start: "  voicelayer: {",
    end: "  cmuxlayer: {",
  },
];
const assetRoots = policyOnly ? [] : [
  resolve(root, "public/demos/voicelayer-hero.mp4"),
  resolve(root, "public/demos/voicelayer-hero-poster.png"),
  resolve(root, "public/demos/voicelayer-making-of.mp4"),
  resolve(root, "public/demos/voicelayer-making-of-poster.png"),
];
const sourceStage = resolve(root, "public/demos/source-private");
const clientBlocklistPath = resolve(sourceStage, "client-names.txt");

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".css",
  ".txt",
]);
const imageExtensions = new Set([".png", ".jpg", ".jpeg"]);
const ignoredSegments = new Set(["__tests__", "node_modules"]);
const bannedPatterns = [
  {
    label: "real macOS user path",
    regex: /\/Users\/(?!you(?:\/|\b))/i,
    binarySafe: true,
  },
  {
    label: "credential-shaped value",
    regex: /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{16,}|AKIA[A-Z0-9]{16}|Bearer\s+[A-Za-z0-9._-]{16,})\b|\bapi[_-]?key\s*[:=]\s*["']?[A-Za-z0-9._-]{12,}/i,
    binarySafe: false,
  },
  {
    label: "session cost or spend figure",
    regex: /\$\s?\d{1,6}(?:,\d{3})*\.\d{2}\b/,
    binarySafe: false,
  },
];

if (existsSync(clientBlocklistPath)) {
  const clientNames = readFileSync(clientBlocklistPath, "utf8")
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
  for (const name of clientNames) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    bannedPatterns.push({
      label: "client name",
      regex: new RegExp(`\\b${escaped}\\b`, "i"),
      binarySafe: false,
    });
  }
}

function collectFiles(path) {
  if (!existsSync(path)) return [];
  const stats = statSync(path);
  if (stats.isFile()) return [path];

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredSegments.has(entry.name)) return [];
    return collectFiles(join(path, entry.name));
  });
}

function readableContent(path) {
  if (textExtensions.has(extname(path))) return readFileSync(path, "utf8");
  try {
    return execFileSync("strings", [path], {
      encoding: "utf8",
      maxBuffer: 24 * 1024 * 1024,
    });
  } catch {
    return "";
  }
}

function scanContent(content, file, isTextOrOcr) {
  const findings = [];
  for (const pattern of bannedPatterns) {
    if (!isTextOrOcr && !pattern.binarySafe) continue;
    if (pattern.regex.test(content)) findings.push(`${pattern.label}: ${file}`);
  }
  return findings;
}

const missingAssets = assetRoots.filter((path) => !existsSync(path));
if (!allowMissingAssets && missingAssets.length > 0) {
  console.error(
    `Missing rendered demo assets:\n${missingAssets.map((path) => `- ${path}`).join("\n")}`,
  );
  process.exit(1);
}

const findings = [];
const files = [
  ...sourceRoots.flatMap(collectFiles),
  ...assetRoots.filter(existsSync),
  ...requestedTextFiles.filter(existsSync),
];
for (const file of files) {
  findings.push(
    ...scanContent(readableContent(file), file, textExtensions.has(extname(file))),
  );
}

for (const slice of publishedSlices) {
  const content = readFileSync(slice.path, "utf8");
  const start = content.indexOf(slice.start);
  const end = content.indexOf(slice.end, start + slice.start.length);
  if (start === -1 || end === -1) {
    findings.push(`published VoiceLayer surface markers missing: ${slice.path}`);
    continue;
  }
  findings.push(
    ...scanContent(content.slice(start, end), slice.path, true),
  );
}

if (!policyOnly && existsSync(sourceStage)) {
  const staged = collectFiles(sourceStage);
  for (const path of staged) {
    const repoPath = relative(root, path);
    try {
      execFileSync("git", ["check-ignore", "--quiet", "--", repoPath], { cwd: root });
    } catch {
      findings.push(`raw source is not ignored: ${repoPath}`);
    }
    const tracked = execFileSync("git", ["ls-files", "--", repoPath], {
      cwd: root,
      encoding: "utf8",
    }).trim();
    if (tracked) findings.push(`raw source is tracked: ${repoPath}`);
  }
}

for (const frameDir of frameDirs) {
  const images = collectFiles(frameDir).filter((path) =>
    imageExtensions.has(extname(path).toLowerCase()),
  );
  if (images.length === 0) {
    findings.push(`OCR frame directory is empty: ${frameDir}`);
    continue;
  }
  try {
    const ocr = execFileSync(
      "swift",
      [resolve(import.meta.dirname, "ocr-voicelayer-demo-frames.swift"), ...images],
      { encoding: "utf8", maxBuffer: 24 * 1024 * 1024 },
    );
    const recognizedText = ocr.replace(/^FRAME\t.*$/gm, "");
    findings.push(...scanContent(recognizedText, `OCR:${frameDir}`, true));
  } catch (error) {
    findings.push(`OCR execution failed: ${error.message}`);
  }
}

if (findings.length > 0) {
  console.error(`VoiceLayer demo sanitization failed:\n${findings.join("\n")}`);
  process.exit(1);
}

console.log(
  `VoiceLayer demo sanitization passed (${files.length + publishedSlices.length} source/assets scanned, ${frameDirs.length} OCR frame sets, ${missingAssets.length} assets pending).`,
);
