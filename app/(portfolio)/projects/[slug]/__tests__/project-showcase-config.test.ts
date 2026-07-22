import { describe, it, expect } from "vitest";
import { getProjectShowcaseConfig } from "../project-showcase-config";

// Regression guard: the VoiceLayer showcase must reflect the current install
// story (Homebrew tap + socat daemon socket), not the retired
// `bunx voicelayer-mcp` / `qa-voice` MCP-server-name path.
describe("voicelayer showcase config", () => {
  const config = getProjectShowcaseConfig("voicelayer");

  it("exists as a mini-site", () => {
    expect(config).toBeDefined();
    expect(config?.isMiniSite).toBe(true);
  });

  it("advertises the Homebrew install path", () => {
    const commands = (config?.installTabs ?? [])
      .map((t) => t.command)
      .join("\n");
    expect(commands).toContain("brew");
    expect(commands).toContain("etanhey/layers");
  });

  it("uses the socat daemon MCP config, not the retired bunx/qa-voice path", () => {
    const commands = (config?.installTabs ?? [])
      .map((t) => t.command)
      .join("\n");
    expect(commands).not.toContain("qa-voice");
    expect(commands).not.toContain("bunx voicelayer-mcp");
    expect(commands).toContain("voicelayer-mcp.sock");
  });
});
