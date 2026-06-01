import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "svgson";

export const toPascalCase = (value) =>
  value
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join("");

export async function resetDirectory(directory) {
  await rm(directory, { force: true, recursive: true });
  await mkdir(directory, { recursive: true });
}

export async function writeGenerated(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${contents.trim()}\n`);
}

export async function readCanonicalIcons(root) {
  const iconsDirectory = path.join(root, "icons");
  const files = (await readdir(iconsDirectory))
    .filter((file) => file.endsWith(".svg"))
    .sort();
  return Promise.all(
    files.map(async (file) => {
      const name = path.basename(file, ".svg");
      const svg = await readFile(path.join(iconsDirectory, file), "utf8");
      const parsed = await parse(svg);
      const metadata = JSON.parse(
        await readFile(path.join(iconsDirectory, `${name}.json`), "utf8"),
      );
      return {
        name,
        componentName: toPascalCase(name),
        svg,
        nodes: parsed.children.map(({ name: tag, attributes }) => [
          tag,
          attributes,
        ]),
        metadata,
      };
    }),
  );
}

export async function readCategories(root) {
  const categoriesDirectory = path.join(root, "categories");
  const files = (await readdir(categoriesDirectory))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const categories = await Promise.all(
    files.map(async (file) => ({
      name: path.basename(file, ".json"),
      ...JSON.parse(
        await readFile(path.join(categoriesDirectory, file), "utf8"),
      ),
    })),
  );
  return categories.sort(
    (left, right) => (left.weight ?? 0) - (right.weight ?? 0),
  );
}
