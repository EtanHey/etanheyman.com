import { describe, expect, it } from "vitest";
import { getTerminalShowcaseData } from "../terminal-showcase-config";

describe("WhatsApp terminal contact identity", () => {
  it("shows the confirmed name while retaining the demo contact addresses", () => {
    const data = getTerminalShowcaseData("whatsapp-mcp");
    expect(data).not.toBeNull();
    const lines = (id: string) =>
      data?.tabs.find((tab) => tab.id === id)?.lines.map((line) =>
        line.replace(/\x1b\[\d+(?:;\d+)*m/g, ""),
      );

    expect(lines("search")).toContain("#2  איתן היימן");
    expect(lines("search")?.filter((line) => line.includes("JID:"))).toEqual([
      "    JID: 972501234567@s.whatsapp.net",
      "    JID: 972521234567@s.whatsapp.net",
    ]);
    expect(lines("messages")).toEqual([
      '$ whatsapp list_messages --chat "972521234567@s.whatsapp.net"',
      "",
      "WhatsApp MCP  ·  message history",
      "",
      "14:32  איתן  מה קורה עם הפרויקט?",
      "14:30  You   עובד על הפורטפוליו",
      "14:28  איתן  אחלה אחי!",
      "14:25  You   Hey, are you free?",
      "",
      "4 messages (newest first) · bridge: personal (8741)",
    ]);
    expect(data?.tabs.flatMap((tab) => tab.lines).join("\n")).not.toContain("אתן");
  });
});
