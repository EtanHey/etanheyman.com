import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modelPath = resolve(import.meta.dirname, "../model.ts");

describe("VoiceLayer demo model", () => {
  it("defines the two approved real-footage cuts", async () => {
    const exists = existsSync(modelPath);
    expect(exists).toBe(true);
    if (!exists) return;

    const model = await import("../model");
    expect(model.DEMO_FPS).toBe(30);
    expect(model.DEMO_WIDTH).toBe(1920);
    expect(model.DEMO_HEIGHT).toBe(1080);
    expect(model.HERO_STATES.map((state) => state.id)).toEqual([
      "ready",
      "recording",
      "transcribing",
      "paste",
      "teleprompter",
      "context-menu",
    ]);
    expect(model.MAKING_OF_STATES.map((state) => state.id)).toEqual([
      "dictate-problem",
      "qa-frame",
      "brief-agents",
      "parallel-fixes",
      "review-prs",
      "verified",
    ]);
    expect(model.HERO_DURATION_FRAMES).toBe(900);
    expect(model.MAKING_OF_DURATION_FRAMES).toBe(2_700);
  });

  it("contains only substituted public copy", () => {
    const source = existsSync(modelPath) ? readFileSync(modelPath, "utf8") : "";
    const banned = [
      "/Users/",
      "~/",
      "HappyCampr",
      "Etan Heyman",
      "etanheyman",
      "voicelayerLead",
      "notch-363",
      "docs.local",
      "Terminal —",
      "token spend",
      "session cost",
      "client",
      "chain-of-thought",
    ];

    for (const marker of banned) {
      expect(source).not.toContain(marker);
    }
    expect(source).toContain("Ship the smallest verified fix");
    expect(source).toContain("voice_speak");
  });

  it("limits redactions to paths, secrets, client names, and costs", async () => {
    const redactions = await import("../redactions");
    const allowedKinds = new Set(["path", "secret", "client", "cost"]);

    expect(redactions.TARGETED_REDACTIONS.length).toBeGreaterThan(0);
    expect(
      redactions.TARGETED_REDACTIONS.every((zone) =>
        allowedKinds.has(zone.kind),
      ),
    ).toBe(true);
    expect(
      redactions.TARGETED_REDACTIONS.some(
        (zone) => zone.kind === "path" && zone.replacement === "/Users/you",
      ),
    ).toBe(true);
    expect(
      redactions.TARGETED_REDACTIONS.every(
        (zone) =>
          zone.width > 0 &&
          zone.height > 0 &&
          zone.width < 520 &&
          zone.height < 90,
      ),
    ).toBe(true);
  });

  it("fails fast when a timeline has no states", async () => {
    const model = await import("../model");
    expect(() => model.stateAtFrame(0, [])).toThrow(
      "At least one demo state is required",
    );
  });
});
