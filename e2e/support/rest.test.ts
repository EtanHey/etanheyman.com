import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { createClient } from "@supabase/supabase-js";
import { createFixtureServer, rows } from "./rest";

test("real GET fixture serves ordered database rows, filters and rejects writes", async () => {
  const server = createFixtureServer().listen(0, "127.0.0.1");
  try {
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}/rest/v1/`;
    const client = createClient(
      `http://127.0.0.1:${address.port}`,
      "public-fixture-placeholder",
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
    const result = await client
      .from("projects")
      .select("*")
      .order("order_index");
    assert.equal(result.error, null);
    assert.deepEqual(result.data, rows);
    const bySlug = await client
      .from("projects")
      .select("*")
      .eq("slug", "brainlayer")
      .single();
    assert.equal(bySlug.error, null);
    assert.equal(bySlug.data.slug, "brainlayer");
    const list = await fetch(base + "projects?select=*&order=order_index.asc");
    assert.deepEqual(await list.json(), rows);
    const single = await fetch(base + "projects?slug=eq.brainlayer", {
      headers: { accept: "application/vnd.pgrst.object+json" },
    });
    assert.deepEqual(
      await single.json(),
      rows.find((p) => p.slug === "brainlayer"),
    );
    assert.equal(
      (
        await fetch(base + "projects?slug=eq.absent", {
          headers: { accept: "application/vnd.pgrst.object+json" },
        })
      ).status,
      406,
    );
    assert.deepEqual(
      await (await fetch(base + "project_journey_steps")).json(),
      [],
    );
    assert.equal((await fetch(base + "private")).status, 404);
    for (const method of ["POST", "PATCH", "DELETE"]) {
      assert.equal((await fetch(base + "projects", { method })).status, 405);
    }
    assert.equal(rows.length, 17);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
