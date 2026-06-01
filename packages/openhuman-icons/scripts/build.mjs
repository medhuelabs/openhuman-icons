import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { build } from "tsup";

const packageRoot = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(packageRoot, "../..");
const iconsDirectory = path.join(packageRoot, "src/icons");
const iconEntries = Object.fromEntries(
  (await readdir(iconsDirectory))
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .map((file) => [
      `icons/${path.basename(file, ".ts")}`,
      path.join(iconsDirectory, file),
    ]),
);

await build({
  entry: {
    index: path.join(packageRoot, "src/index.ts"),
    build: path.join(packageRoot, "src/build.ts"),
    ...iconEntries,
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  outDir: path.join(packageRoot, "dist"),
});

await mkdir(path.join(packageRoot, "dist/svg"), { recursive: true });
await cp(path.join(repoRoot, "icons"), path.join(packageRoot, "dist/svg"), {
  recursive: true,
  filter: (source) => !source.endsWith(".json"),
});
await cp(path.join(repoRoot, "LICENSE"), path.join(packageRoot, "LICENSE"));
