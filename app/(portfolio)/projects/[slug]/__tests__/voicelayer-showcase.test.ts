import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getTerminalShowcaseData } from "../terminal-showcase-config";

const stripAnsi = (value: string) => value.replace(/\x1b\[[0-9;]*m/g, "");

describe("VoiceLayer v2.1.17 showcase", () => {
  const terminal = getTerminalShowcaseData("voicelayer");
  const terminalText = stripAnsi(
    terminal?.tabs.flatMap((tab) => tab.lines).join("\n") ?? "",
  );

  it("does not advertise MCP voice modes as CLI subcommands", () => {
    expect(terminalText).not.toMatch(/voicelayer (announce|converse|think)\b/);
  });

  it("shows shipped MCP, F5 dictation, and CLI surfaces", () => {
    expect(terminalText).toContain("voice_speak");
    expect(terminalText).toContain("F5");
    expect(terminalText).toContain("voicelayer doctor");
  });

  it("integrates the rendered demo only for the VoiceLayer mini-site", () => {
    const componentPath = resolve(
      import.meta.dirname,
      "../components/VoiceLayerDemo.tsx",
    );
    const componentExists = existsSync(componentPath);
    expect(componentExists).toBe(true);
    if (!componentExists) return;

    const page = readFileSync(
      resolve(import.meta.dirname, "../page.tsx"),
      "utf8",
    );
    const component = readFileSync(componentPath, "utf8");

    expect(page).toContain(
      'import { VoiceLayerDemo } from "./components/VoiceLayerDemo"',
    );
    expect(page).toMatch(
      /\{slug === "voicelayer" && \([\s\S]{0,800}<VoiceLayerDemo\s*\/>[\s\S]{0,100}\)\}/,
    );
    expect(component).toContain("/demos/voicelayer-hero.mp4");
    expect(component).toContain("/demos/voicelayer-hero-poster.png");
    expect(component).toContain("/demos/voicelayer-making-of.mp4");
    expect(component).toContain("/demos/voicelayer-making-of-poster.png");
    expect(component).toContain("Real Mac footage");
    expect(component).toContain("path-level redaction");
  });

  it("stages private QA recordings outside git", () => {
    const root = resolve(import.meta.dirname, "../../../../..");
    const stageScript = resolve(
      root,
      "scripts/prepare-voicelayer-demo-sources.mjs",
    );
    const gitignore = readFileSync(resolve(root, ".gitignore"), "utf8");

    expect(existsSync(stageScript)).toBe(true);
    expect(gitignore).toContain("/public/demos/source-private/");
  });

  it("keeps the captured Claude and Codex panes instead of reconstructing them", () => {
    const root = resolve(import.meta.dirname, "../../../../..");
    const showcase = readFileSync(
      resolve(root, "remotion/voicelayer/VoiceLayerShowcase.tsx"),
      "utf8",
    );
    const realDesktop = readFileSync(
      resolve(root, "remotion/voicelayer/components/RealDesktop.tsx"),
      "utf8",
    );

    expect(showcase).not.toContain("SyntheticDesktop");
    expect(showcase).not.toContain("Timeline");
    expect(showcase).toContain("<RealFootageBase");
    expect(showcase).toContain("<TargetedRedactions");
    expect(showcase).not.toContain("<PrivacyDesktop");
    expect(realDesktop).toContain("OffthreadVideo");
    expect(realDesktop).toContain("muted");
    for (const reconstructedSurface of [
      "PrivacyDesktop",
      "SessionRail",
      "SafePane",
      "SeamMask",
      "SafeLine",
      "heroLeadLines",
      "makingLeadLines",
    ]) {
      expect(realDesktop).not.toContain(reconstructedSurface);
    }
  });

  it("keeps the hero's real captured macOS menu bar in the making-of cut", () => {
    const root = resolve(import.meta.dirname, "../../../../..");
    const showcase = readFileSync(
      resolve(root, "remotion/voicelayer/VoiceLayerShowcase.tsx"),
      "utf8",
    );
    const realDesktop = readFileSync(
      resolve(root, "remotion/voicelayer/components/RealDesktop.tsx"),
      "utf8",
    );

    expect(realDesktop).toContain("const CapturedMacMenuBar");
    expect(realDesktop).toMatch(
      /const CapturedMacMenuBar[\s\S]*?<SourceVideo src=\{SOURCE\.hero\}/,
    );
    expect(realDesktop).toContain("<CapturedMacMenuBar />");
    expect(showcase).not.toContain(
      'theme={frame >= 1_800 ? "light" : "dark"}',
    );
    expect(showcase).not.toContain("SourceNotchMask");
    expect(showcase).not.toMatch(/width:\s*520[\s\S]{0,180}background:/);
  });

  it("executes the narrow sanitizer policy against controlled fixtures", () => {
    const root = resolve(import.meta.dirname, "../../../../..");
    const sanitizer = resolve(
      root,
      "scripts/check-voicelayer-demo-sanitization.mjs",
    );
    const fixtureRoot = mkdtempSync(join(tmpdir(), "voicelayer-sanitize-"));

    try {
      const authentic = resolve(fixtureRoot, "authentic.txt");
      writeFileSync(
        authentic,
        "brain_store tool call · agent reasoning · 324,660 tokens · voicelayerLead · real diff",
      );
      expect(() =>
        execFileSync(
          process.execPath,
          [sanitizer, "--policy-only", `--scan-text=${authentic}`],
          { cwd: root, encoding: "utf8" },
        ),
      ).not.toThrow();

      const privateValues = resolve(fixtureRoot, "private.txt");
      writeFileSync(
        privateValues,
        "/Users/private-account/Gits/voicelayer sk-proj-abcdefghijklmnop $102.19",
      );
      const result = spawnSync(
        process.execPath,
        [sanitizer, "--policy-only", `--scan-text=${privateValues}`],
        { cwd: root, encoding: "utf8" },
      );
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("real macOS user path");
      expect(result.stderr).toContain("credential-shaped value");
      expect(result.stderr).toContain("session cost or spend figure");
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });
});
