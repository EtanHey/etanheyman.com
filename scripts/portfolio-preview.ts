// Portfolio design preview: serves the committed public fixture snapshot
// (e2e/fixtures/projects.json) with the claim-checked blurbs from
// supabase/migrations applied on top, then runs `next build` + `next start`.
//
// AIDEV-NOTE: Preview/proof only. Production reads Supabase. The fixture rows are a
// historical public snapshot; the overlay replaces only the rows that a committed
// claim-checked migration rewrote, so screenshots never show retired numbers for
// those rows. No credentials, no .env, GET-only. Usage:
//   node --import tsx scripts/portfolio-preview.ts            # build + start :45320
//   PREVIEW_SKIP_BUILD=1 node --import tsx scripts/portfolio-preview.ts
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { rows } from "../e2e/support/rest";

const MIGRATIONS = [
  "supabase/migrations/20261028_portfolio_blurbs_claim_checked.sql",
  "supabase/migrations/20261029_cmuxlayer_blurb.sql",
];

type Overlay = { description: string; short_description: string };

export function parseClaimCheckedBlurbs(sql: string): Map<string, Overlay> {
  const out = new Map<string, Overlay>();
  const sqlString = "'((?:[^']|'')*)'";
  const re = new RegExp(
    `SET description = ${sqlString},\\s*short_description = ${sqlString}\\s*WHERE slug = '([^']+)'`,
    "g",
  );
  for (const m of sql.matchAll(re)) {
    out.set(m[3], {
      description: m[1].replace(/''/g, "'"),
      short_description: m[2].replace(/''/g, "'"),
    });
  }
  return out;
}

const overlay = new Map<string, Overlay>();
for (const file of MIGRATIONS) {
  for (const [slug, blurb] of parseClaimCheckedBlurbs(readFileSync(file, "utf8")))
    overlay.set(slug, blurb);
}
const previewRows = rows.map((row) => {
  const blurb = row.slug ? overlay.get(row.slug) : undefined;
  return blurb ? { ...row, ...blurb } : row;
});

function createPreviewServer() {
  return createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method !== "GET") return void res.writeHead(405).end();
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (!["/rest/v1/projects", "/rest/v1/project_journey_steps"].includes(url.pathname))
      return void res.writeHead(404).end();
    let data = url.pathname.endsWith("/projects") ? [...previewRows] : [];
    for (const key of ["id", "slug"] as const) {
      const filter = url.searchParams.get(key);
      if (filter?.startsWith("eq.")) data = data.filter((p) => p[key] === filter.slice(3));
    }
    data.sort((a, b) => (a.order_index ?? Infinity) - (b.order_index ?? Infinity));
    const single = req.headers.accept?.includes("vnd.pgrst.object");
    if (single && data.length !== 1)
      return void res
        .writeHead(406)
        .end(JSON.stringify({ code: "PGRST116", message: "Expected one row" }));
    res.end(JSON.stringify(single ? data[0] : data));
  });
}

const env: NodeJS.ProcessEnv = {
  PATH: process.env.PATH,
  HOME: process.env.HOME,
  TMPDIR: process.env.TMPDIR,
  NODE_ENV: "production",
  TZ: "UTC",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:45319",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-fixture-placeholder",
  NEXTAUTH_SECRET: "public-fixture-only-not-a-real-secret",
  RESEND_API_KEY: "re_public_fixture_only",
};
// next/font downloads Google fonts at build time; keep the host's proxy/CA settings.
for (const key of ["HTTPS_PROXY", "https_proxy", "NO_PROXY", "no_proxy", "NODE_EXTRA_CA_CERTS"])
  if (process.env[key]) env[key] = process.env[key];

async function main() {
  // Next loads env files itself; refuse them rather than risk real credentials/data.
  if (readdirSync(".").some((f) => /^\.env(?:\.|$)/.test(f)))
    throw new Error("Preview requires a checkout without .env files");
  const api = createPreviewServer();
  await new Promise<void>((r) => api.listen(45319, "127.0.0.1", r));
  console.log(`preview REST on :45319 (${overlay.size} claim-checked overlays)`);
  const steps = process.env.PREVIEW_SKIP_BUILD ? [] : [["build"]];
  steps.push(["start", "--hostname", "127.0.0.1", "--port", "45320"]);
  for (const args of steps) {
    const child = spawn(process.execPath, [join("node_modules/next/dist/bin/next"), ...args], {
      env,
      stdio: "inherit",
    });
    const stop = () => child.kill("SIGTERM");
    process.once("SIGTERM", stop);
    process.once("SIGINT", stop);
    const [code] = await once(child, "exit");
    if (code !== 0) {
      process.exitCode = typeof code === "number" ? code : 1;
      break;
    }
  }
  api.close();
}

if (process.argv[1]?.endsWith("portfolio-preview.ts")) void main();
