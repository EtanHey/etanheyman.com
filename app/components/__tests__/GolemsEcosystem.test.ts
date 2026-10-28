import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GolemsEcosystem from "../GolemsEcosystem";

describe("GolemsEcosystem", () => {
  it("shows the current MCP tool counts", () => {
    const html = renderToStaticMarkup(createElement(GolemsEcosystem));
    expect(html).toContain("3 open-source MCP servers. 28 tools.");
    expect(html).toContain("16 MCP tools");
  });
});
