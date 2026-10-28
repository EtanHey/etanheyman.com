import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("retired admin and mutation surfaces", () => {
  it.each([
    "app/(portfolio)/admin",
    "app/(portfolio)/projects/add",
    "app/(portfolio)/projects/[slug]/edit",
    "app/(portfolio)/api/projects",
    "app/(portfolio)/api/uploadthing",
    "app/components/AdminEditButton.tsx",
    "app/components/AdminFloatingMenu.tsx",
    "app/components/ImageUploader.tsx",
    "app/contexts/AuthContext.tsx",
    "app/utils/uploadthing.ts",
    "lib/supabase/admin.ts",
  ])("does not ship %s", (filePath) => {
    expect(existsSync(filePath)).toBe(false);
  });

  it("removes UploadThing from the manifest and npm lockfile", () => {
    for (const filePath of [
      "package.json",
      "package-lock.json",
      "tailwind.config.js",
    ]) {
      expect(readFileSync(filePath, "utf8")).not.toMatch(/uploadthing/i);
    }
  });

  it("keeps project access read-only", () => {
    expect(readFileSync("lib/projects.ts", "utf8")).not.toMatch(
      /\.(insert|update|delete|upsert)\(/,
    );
  });

  it("keeps the public Golems docs and contact entry points", () => {
    for (const filePath of [
      "app/(golems)/golems/page.tsx",
      "app/(golems)/golems/docs/[...slug]/page.tsx",
      "app/(portfolio)/contact/page.tsx",
      "app/(portfolio)/contact/actions.ts",
    ]) {
      expect(existsSync(filePath)).toBe(true);
    }
  });
});
