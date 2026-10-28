import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { once } from "node:events";
import { createFixtureServer } from "./rest";

// Next loads env files itself. Refuse them rather than risk real credentials/data.
if (readdirSync(".").some((file) => /^\.env(?:\.|$)/.test(file))) {
  throw new Error("Fixture mode requires a checkout without .env files");
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
  NEXTAUTH_URL: "http://127.0.0.1:45320",
  NEXTAUTH_SECRET: "public-fixture-only-not-a-real-secret",
  GITHUB_CLIENT_ID: "fixture",
  GITHUB_CLIENT_SECRET: "fixture",
  RESEND_API_KEY: "re_public_fixture_only",
};
const api = createFixtureServer();
let child: ReturnType<typeof spawn> | undefined;
let stopping = false;
function stop() {
  stopping = true;
  child?.kill("SIGTERM");
  api.close();
  api.closeAllConnections();
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
async function main() {
  try {
    await new Promise<void>((resolve, reject) => {
      api.once("error", reject);
      api.listen(45319, "127.0.0.1", resolve);
    });
    for (const args of [
      ["build"],
      ["start", "--hostname", "127.0.0.1", "--port", "45320"],
    ]) {
      if (stopping) break;
      child = spawn(
        process.execPath,
        ["node_modules/next/dist/bin/next", ...args],
        { env, stdio: "inherit" },
      );
      const [code, signal] = await once(child, "exit");
      if (code !== 0) {
        process.exitCode = typeof code === "number" ? code : 1;
        console.error("Next exited", { code, signal });
        break;
      }
    }
  } finally {
    stop();
  }
}
main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
