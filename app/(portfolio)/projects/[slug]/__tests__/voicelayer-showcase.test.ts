import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
    expect(component).toContain("hard-redacted");
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

  it("does not retain the synthetic-desktop premise", () => {
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
    expect(showcase).toContain("<PrivacyDesktop");
    expect(realDesktop).toContain("OffthreadVideo");
    expect(realDesktop).toContain("muted");
  });
});
