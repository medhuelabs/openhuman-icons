import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { optimize } from "svgo";

const iconsDirectory = path.resolve(import.meta.dirname, "..", "icons");
const svgFiles = (await readdir(iconsDirectory))
  .filter((file) => file.endsWith(".svg"))
  .sort();

for (const file of svgFiles) {
  const iconPath = path.join(iconsDirectory, file);
  const source = await readFile(iconPath, "utf8");
  const result = optimize(source, {
    path: iconPath,
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  });
  await writeFile(iconPath, `${result.data}\n`);
}

console.log(`Optimized ${svgFiles.length} SVG files.`);
