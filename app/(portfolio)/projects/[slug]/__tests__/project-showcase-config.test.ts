import { describe, it, expect } from "vitest";
import { getProjectShowcaseConfig, isArchived } from "../project-showcase-config";

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

describe("maintenance notice", () => {
  it("marks cmuxLayer as archived", () => {
    expect(isArchived(getProjectShowcaseConfig("cmuxlayer"))).toBe(true);
  });

  it.each(["brainlayer", "voicelayer", "golems", "whatsapp-mcp"])(
    "keeps %s active",
    (slug) => expect(isArchived(getProjectShowcaseConfig(slug))).toBe(false),
  );

  it("derives archived state from notice presence, not project identity", () => {
    const config = getProjectShowcaseConfig("cmuxlayer")!;
    expect(isArchived({ ...config, maintenanceNotice: undefined })).toBe(false);
    expect(isArchived(null)).toBe(false);
  });

  it("announces cmuxLayer's move to T3 Code", () => {
    const notice = getProjectShowcaseConfig("cmuxlayer")?.maintenanceNotice;
    expect(notice).toEqual({
      beforeLink: "cmuxLayer is no longer maintained. We used it before moving to ",
      link: { text: "T3 Code", href: "https://github.com/pingdotgg/t3code" },
      afterLink: ", which now covers most of what it did.",
    });
  });

  it.each(["brainlayer", "voicelayer", "golems", "whatsapp-mcp"])(
    "does not show a maintenance notice for %s",
    (slug) => expect(getProjectShowcaseConfig(slug)).not.toHaveProperty("maintenanceNotice"),
  );
});
