import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import { parse } from "svgson";

const root = path.resolve(import.meta.dirname, "..");
const iconsDirectory = path.join(root, "icons");
const categoriesDirectory = path.join(root, "categories");
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const expectedSvgAttributes = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

const ajv = new Ajv2020({ allErrors: true });
const iconSchema = JSON.parse(
  await readFile(path.join(root, "icon.schema.json"), "utf8"),
);
const categorySchema = JSON.parse(
  await readFile(path.join(root, "category.schema.json"), "utf8"),
);
const validateIcon = ajv.compile(iconSchema);
const validateCategory = ajv.compile(categorySchema);
const failures = [];

const unique = (items) => new Set(items).size === items.length;
const iconFiles = await readdir(iconsDirectory);
const svgNames = iconFiles
  .filter((file) => file.endsWith(".svg"))
  .map((file) => path.basename(file, ".svg"))
  .sort();
const jsonNames = iconFiles
  .filter((file) => file.endsWith(".json"))
  .map((file) => path.basename(file, ".json"))
  .sort();
const categoryFiles = (await readdir(categoriesDirectory))
  .filter((file) => file.endsWith(".json"))
  .sort();
const categoryNames = new Set(
  categoryFiles.map((file) => path.basename(file, ".json")),
);
const svgNameSet = new Set(svgNames);

if (svgNames.join("\n") !== jsonNames.join("\n")) {
  failures.push(
    "Every canonical SVG must have one adjacent JSON metadata file.",
  );
}

for (const name of svgNames) {
  if (!kebabCase.test(name))
    failures.push(`${name}: icon filename must be kebab-case.`);

  const svg = await parse(
    await readFile(path.join(iconsDirectory, `${name}.svg`), "utf8"),
  );
  for (const [attribute, value] of Object.entries(expectedSvgAttributes)) {
    if (svg.attributes[attribute] !== value)
      failures.push(`${name}.svg: expected ${attribute}="${value}".`);
  }

  const metadata = JSON.parse(
    await readFile(path.join(iconsDirectory, `${name}.json`), "utf8"),
  );
  if (!validateIcon(metadata))
    failures.push(`${name}.json: ${ajv.errorsText(validateIcon.errors)}`);
  for (const category of metadata.categories ?? []) {
    if (!categoryNames.has(category))
      failures.push(`${name}.json: unknown category "${category}".`);
  }
  for (const field of ["contributors", "categories", "tags", "use-cases"]) {
    if (!unique(metadata[field] ?? []))
      failures.push(`${name}.json: ${field} must contain unique values.`);
  }
  const aliases = (metadata.aliases ?? []).map((alias) => alias.name);
  if (!unique(aliases))
    failures.push(`${name}.json: aliases must contain unique names.`);
}

for (const file of categoryFiles) {
  const category = JSON.parse(
    await readFile(path.join(categoriesDirectory, file), "utf8"),
  );
  if (!validateCategory(category))
    failures.push(`${file}: ${ajv.errorsText(validateCategory.errors)}`);
  if (!svgNameSet.has(category.icon))
    failures.push(`${file}: icon reference "${category.icon}" does not exist.`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${svgNames.length} icons and ${categoryFiles.length} categories.`,
);
