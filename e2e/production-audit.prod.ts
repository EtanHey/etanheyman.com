// Dedicated production config selects this file; fixture *.spec.ts discovery excludes it.
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { writeFile } from "node:fs/promises";

type PolicyEvent = {
  at: string; documentURI: string; blockedURI: string; effectiveDirective: string;
  violatedDirective: string; originalPolicy: string; disposition: string;
  sourceFile: string; lineNumber: number; columnNumber: number; statusCode: number;
};
declare global {
  interface Window {
    __productionAudit?: { installedAt: string; documentURL: string; events: PolicyEvent[] };
  }
}

const routes = ["/", "/projects", "/projects/brainlayer", "/golems/docs", "/golems/docs/architecture"];
const errorText = (error: unknown) => error instanceof Error ? error.stack ?? error.message : String(error);

// Each hook receives the still-live page before fixture teardown, even after a body timeout.
const finalizers = new WeakMap<TestInfo, (page: Page) => Promise<void>>();
test.afterEach(async ({ page }, testInfo) => {
  const finalize = finalizers.get(testInfo);
  finalizers.delete(testInfo);
  if (finalize) await finalize(page);
});

for (const route of routes) {
  test(`production audit ${route}`, async ({ page, baseURL }, testInfo) => {
    if (baseURL !== process.env.PROD_BASE_URL ||
      (baseURL !== "https://etanheyman.com" && baseURL !== "https://www.etanheyman.com")) {
      throw new Error("Production audit requires the dedicated config and explicit allowed PROD_BASE_URL");
    }
    const startedAt = new Date().toISOString();
    const targetURL = new URL(route, baseURL).href;
    const consoleErrors: object[] = [];
    const pageErrors: object[] = [];
    const networkErrors: object[] = [];
    const documents: { url: string; status: number; at: string; headers: Record<string, string> }[] = [];
    const diagnosticErrors: { stage: string; error: string }[] = [];
    const headerReads: Promise<void>[] = [];
    const images: object[] = [];
    let documentRead: "NOT_READ" | "READ" | "FAILED" = "NOT_READ";
    let documentDiagnostics: unknown = null;
    let documentStatus: number | null = null;
    const now = () => new Date().toISOString();

    page.on("pageerror", (error) => pageErrors.push({ at: now(), message: error.message, stack: error.stack }));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push({
        at: now(), text: message.text(), location: message.location(),
      });
    });
    page.on("requestfailed", (request) => networkErrors.push({
      kind: "requestfailed", at: now(), url: request.url(),
      resourceType: request.resourceType(), failure: request.failure(),
    }));
    page.on("response", (response) => {
      const request = response.request();
      if (response.status() >= 400) networkErrors.push({
        kind: "http", at: now(), url: response.url(),
        resourceType: request.resourceType(), status: response.status(),
      });
      if (request.resourceType() === "document" && request.frame() === page.mainFrame()) {
        headerReads.push(response.allHeaders().then((headers) => {
          documents.push({ url: response.url(), status: response.status(), at: now(),
            headers: Object.fromEntries(Object.entries(headers).filter(([name]) =>
              /^(content-security-policy(?:-report-only)?|x-.*(?:build|deploy|commit|sha).*|x-vercel-.*|etag|last-modified|date|server)$/.test(name))),
          });
        }).catch((error: unknown) => { diagnosticErrors.push({ stage: "headers", error: errorText(error) }); }));
      }
    });

    finalizers.set(testInfo, async (page) => {
      try {
        const diagnostics = await page.evaluate(() => ({
          url: location.href, readyState: document.readyState,
          policy: window.__productionAudit ?? null,
          headings: Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]"), (heading) => ({
            tag: heading.tagName, level: heading.getAttribute("aria-level"), text: heading.textContent,
            rendered: heading.getClientRects().length > 0 && getComputedStyle(heading).visibility !== "hidden",
          })),
          mermaidSVGCount: document.querySelectorAll('svg[id^="mermaid-"]').length,
          inlineSVGCount: document.querySelectorAll("svg").length,
          metaCSP: Array.from(document.querySelectorAll('meta[http-equiv="Content-Security-Policy" i]'), (meta) => meta.getAttribute("content")),
          rawNextData: document.querySelector("script#__NEXT_DATA__")?.textContent ?? null,
          exposedBuildMeta: Array.from(document.querySelectorAll('meta[name*="build" i],meta[name*="deploy" i],meta[name*="commit" i]'), (meta) => ({
            name: meta.getAttribute("name"), content: meta.getAttribute("content"),
          })),
        }));
        documentDiagnostics = diagnostics;
        documentRead = "READ";
        expect.soft(diagnostics.policy?.documentURL, "CSP instrumentation present in final document").toBe(diagnostics.url);
        expect.soft(diagnostics.policy?.events ?? null, "Observed policy events (null means unavailable)").toEqual([]);
      } catch (error) {
        documentRead = "FAILED";
        diagnosticErrors.push({ stage: "document-diagnostics", error: errorText(error) });
        expect.soft(false, "Document/CSP evidence unavailable").toBe(true);
      }
      await Promise.all(headerReads);
      const finalDocument = documents.find((document) => document.url === page.url() && document.status === 200);
      expect.soft(finalDocument?.headers["content-security-policy"], "Final document enforces CSP").toBeTruthy();
      try {
        const evidencePath = testInfo.outputPath("production-audit.json");
        const evidence = {
          targetURL, finalURL: page.url(), startedAt, finishedAt: now(),
          project: testInfo.project.name, viewport: page.viewportSize(),
          artifactDirectory: testInfo.project.outputDir,
          device: { isMobile: testInfo.project.use.isMobile ?? false,
            hasTouch: testInfo.project.use.hasTouch ?? false, deviceScaleFactor: testInfo.project.use.deviceScaleFactor ?? 1 },
          sourceDeploymentSHA: documents.filter((document) => document.url === page.url() && document.status === 200)
            .flatMap((document) => Object.entries(document.headers))
            .find(([name, value]) => /^(x-vercel-git-commit-sha|x-git-commit-sha|x-deployment-sha)$/.test(name) && /^[a-f0-9]{40}$/i.test(value))?.[1] ?? "UNKNOWN",
          documents, documentStatus, documentRead, documentDiagnostics,
          consoleErrors, pageErrors, networkErrors, images, diagnosticErrors,
          observation: "Bounded navigation/landmark/image interval; not a perpetual or interactive audit",
        };
        await writeFile(evidencePath, JSON.stringify(evidence, null, 2));
        await testInfo.attach("production-audit", { path: evidencePath, contentType: "application/json" });
      } finally {
        expect.soft(pageErrors, "Page errors, including hydration/React 418").toEqual([]);
        expect.soft(consoleErrors, "Console errors, including hydration/React 418").toEqual([]);
        expect.soft(networkErrors, "HTTP >=400 and failed requests").toEqual([]);
        expect.soft(diagnosticErrors, "Evidence collection failures").toEqual([]);
      }
    });

    await page.addInitScript(() => {
      const events: PolicyEvent[] = [];
      window.__productionAudit = { installedAt: new Date().toISOString(), documentURL: location.href, events };
      document.addEventListener("securitypolicyviolation", (event) => events.push({
        at: new Date().toISOString(), documentURI: event.documentURI,
        blockedURI: event.blockedURI, effectiveDirective: event.effectiveDirective,
        violatedDirective: event.violatedDirective, originalPolicy: event.originalPolicy,
        disposition: event.disposition, sourceFile: event.sourceFile,
        lineNumber: event.lineNumber, columnNumber: event.columnNumber, statusCode: event.statusCode,
      }));
    });
    try {
      const response = await page.goto(targetURL, { waitUntil: "load" });
      documentStatus = response?.status() ?? null;
    } catch (error) {
      diagnosticErrors.push({ stage: "navigation", error: errorText(error) });
      expect.soft(false, "Navigation completed within its original bound").toBe(true);
    }
    expect.soft(documentStatus, "Document HTTP status").toBe(200);
    await expect.soft(page.getByRole("main")).toBeVisible();
    const landmark = route === "/" ? page.getByRole("heading", { level: 1, name: /Etan Heyman/ })
      : route === "/projects" ? page.getByRole("heading", { level: 1, name: "All Projects", exact: true })
      : route === "/projects/brainlayer" ? page.getByRole("heading", { level: 1, name: /BrainLayer/i })
      : page.getByRole("main").locator("article");
    await expect.soft(landmark).toBeVisible();
    if (route === "/golems/docs/architecture") {
      await expect.soft(page.getByRole("heading", { level: 1 }).first(), "Architecture accessible H1").toBeVisible();
    }

    // Playwright visibility includes offscreen lazy images; scrolling triggers their real loads.
    const renderedImages = page.locator("img");
    for (let index = 0; index < await renderedImages.count(); index++) {
      const image = renderedImages.nth(index);
      let identity: { src: string; currentSrc: string } | null = null;
      try {
        identity = await image.evaluate((img: HTMLImageElement) => ({ src: img.src, currentSrc: img.currentSrc }));
        if (!await image.isVisible()) {
          images.push({ index, visibility: "hidden", ...await image.evaluate((img: HTMLImageElement) => ({
            src: img.src, currentSrc: img.currentSrc, width: img.naturalWidth, height: img.naturalHeight,
          })) });
          continue;
        }
        await image.scrollIntoViewIfNeeded();
        const result = await image.evaluate(async (img: HTMLImageElement) => {
          let timer: ReturnType<typeof setTimeout> | undefined;
          let decodeError: string | null = null;
          try {
            await Promise.race([
              img.decode(),
              new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Image decode exceeded 3000ms")), 3000); }),
            ]);
          } catch (error) { decodeError = String(error); }
          finally { clearTimeout(timer); }
          return {
            src: img.src, currentSrc: img.currentSrc, alt: img.alt,
            kind: (img.currentSrc || img.src).startsWith("data:") ? "data/possible-placeholder"
              : /\.svg(?:[?#]|$)/i.test(img.currentSrc || img.src) ? "svg-image" : "image",
            loading: img.loading, complete: img.complete,
            width: img.naturalWidth, height: img.naturalHeight, decodeError,
          };
        });
        images.push({ index, visibility: "rendered", ...result });
        expect.soft(result.decodeError, `Image ${index}: ${result.currentSrc || result.src}`).toBeNull();
        expect.soft(result.width, `Image ${index} natural width`).toBeGreaterThan(0);
        expect.soft(result.height, `Image ${index} natural height`).toBeGreaterThan(0);
      } catch (error) {
        images.push({ index, identity, error: errorText(error) });
        expect.soft(false, `Image ${index} could not be observed`).toBe(true);
      }
    }
  });
}
