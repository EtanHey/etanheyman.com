import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
const declared = {
  ...(packageJson.dependencies ?? {}),
  ...(packageJson.devDependencies ?? {}),
};
const declaredRemotion = Object.entries(declared).filter(
  ([name]) => name === "remotion" || name.startsWith("@remotion/"),
);

const installedPackageFiles = [
  join(root, "node_modules/remotion/package.json"),
  ...readdirSync(join(root, "node_modules/@remotion"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) =>
      join(root, "node_modules/@remotion", entry.name, "package.json"),
    ),
];
const installed = installedPackageFiles.map((file) => {
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  return [pkg.name, pkg.version];
});

const declaredVersions = new Set(
  declaredRemotion.map(([, version]) => version),
);
const installedVersions = new Set(installed.map(([, version]) => version));
const installedByName = new Map(installed);
const hasMissingOrMismatchedPackage = declaredRemotion.some(
  ([name, version]) => installedByName.get(name) !== version,
);
const hasRange = declaredRemotion.some(([, version]) =>
  /^[~^*]|[<>=|]/.test(version),
);

for (const [name, version] of installed.sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  console.log(`${name} = ${version}`);
}

if (
  hasRange ||
  hasMissingOrMismatchedPackage ||
  declaredVersions.size !== 1 ||
  installedVersions.size !== 1 ||
  [...declaredVersions][0] !== [...installedVersions][0]
) {
  console.error("Remotion packages must use one identical exact version.");
  process.exit(1);
}

console.log(
  `Remotion version alignment passed (${installed.length} installed packages at ${[...installedVersions][0]}).`,
);
