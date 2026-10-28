import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GolemsEcosystem from "../app/components/GolemsEcosystem";

describe("ecosystem server HTML", () => {
  it("keeps external and portfolio links independent so browsers preserve the hydration tree", () => {
    const html = renderToStaticMarkup(createElement(GolemsEcosystem));
    let anchorDepth = 0;
    for (const [tag] of html.matchAll(/<\/?a\b[^>]*>/g)) {
      anchorDepth += tag.startsWith("</") ? -1 : 1;
      expect(anchorDepth, `invalid nested link: ${tag}`).toBeLessThanOrEqual(1);
    }
    expect(anchorDepth).toBe(0);
    for (const slug of ["brainlayer", "voicelayer", "cmuxlayer"]) {
      expect(html).toContain(`href="https://${slug}.etanheyman.com"`);
      expect(html).toContain(`href="/projects/${slug}"`);
    }
  });
});
