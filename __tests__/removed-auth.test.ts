import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(filePath)
      : /\.[cm]?[jt]sx?$/.test(entry.name)
        ? [filePath]
        : [];
  });
}

describe("retired authentication surface", () => {
  it.each([
    "app/(portfolio)/api/auth",
    "app/(portfolio)/unauthorized",
    "app/lib/auth.ts",
    "lib/auth",
    "app/providers/SessionProvider.tsx",
    "types/next-auth.d.ts",
  ])("does not ship %s", (filePath) => {
    expect(existsSync(filePath)).toBe(false);
  });

  it("removes NextAuth from the manifest and npm lockfile", () => {
    for (const filePath of ["package.json", "package-lock.json"]) {
      expect(readFileSync(filePath, "utf8")).not.toMatch(/next-auth/);
    }
  });

  it("ships no NextAuth imports or session UI", () => {
    const files = [
      ...["app", "lib", "types"].flatMap(sourceFiles),
      "middleware.ts",
    ];
    for (const filePath of files) {
      expect(readFileSync(filePath, "utf8"), filePath).not.toMatch(
        /["']next-auth(?:\/[^"']*)?["']|\b(?:useSession|signIn|signOut|AuthSessionProvider)\b/,
      );
    }
  });
});
