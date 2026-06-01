import path from "node:path";
import {
  resetDirectory,
  readCanonicalIcons,
  readCategories,
  writeGenerated,
} from "@openhuman-icons/build-helpers";

const root = path.resolve(import.meta.dirname, "../..");
const icons = await readCanonicalIcons(root);
const categories = await readCategories(root);
const baseSource = path.join(root, "packages/openhuman-icons/src");
const reactSource = path.join(root, "packages/openhuman-icons-react/src");
const docsData = path.join(root, "docs/.vitepress/data");
const docsIcons = path.join(root, "docs/icons");

await resetDirectory(path.join(baseSource, "icons"));
await resetDirectory(path.join(reactSource, "icons"));

for (const icon of icons) {
  const iconNodes = JSON.stringify(icon.nodes, null, 2);
  await writeGenerated(
    path.join(baseSource, "icons", `${icon.name}.ts`),
    `import type { IconNode } from "../types";

export const ${icon.componentName}: IconNode = ${iconNodes};`,
  );
  await writeGenerated(
    path.join(reactSource, "icons", `${icon.name}.ts`),
    `import { ${icon.componentName} as iconNode } from "../../../openhuman-icons/src/icons/${icon.name}";
import { createOpenHumanIcon } from "../createOpenHumanIcon";

export const ${icon.componentName} = createOpenHumanIcon("${icon.componentName}", iconNode);`,
  );
  await writeGenerated(
    path.join(docsIcons, `${icon.name}.md`),
    `---
title: ${icon.name}
description: OpenHuman Icons ${icon.name} medical SVG icon.
---`,
  );
}

const iconExports = icons
  .map((icon) => `export { ${icon.componentName} } from "./${icon.name}";`)
  .join("\n");
await writeGenerated(path.join(baseSource, "icons/index.ts"), iconExports);
await writeGenerated(path.join(reactSource, "icons/index.ts"), iconExports);

const iconImports = icons
  .map(
    (icon) => `import { ${icon.componentName} } from "./icons/${icon.name}";`,
  )
  .join("\n");
const iconMap = icons
  .map((icon) => `  "${icon.name}": ${icon.componentName}`)
  .join(",\n");
await writeGenerated(
  path.join(baseSource, "iconNodes.ts"),
  `${iconImports}

export const icons = {
${iconMap}
} as const;`,
);

const aliases = icons.flatMap((icon) =>
  (icon.metadata.aliases ?? []).map((alias) => ({ ...alias, icon })),
);
const baseAliases = aliases
  .map(
    ({ name, icon }) =>
      `export { ${icon.componentName} as ${iconName(name)} } from "./icons/${icon.name}";`,
  )
  .join("\n");
const reactAliases = aliases
  .map(
    ({ name, icon }) =>
      `export { ${icon.componentName} as ${iconName(name)} } from "./icons/${icon.name}";`,
  )
  .join("\n");
await writeGenerated(
  path.join(baseSource, "aliases.ts"),
  baseAliases || "export {};",
);
await writeGenerated(
  path.join(reactSource, "aliases.ts"),
  reactAliases || "export {};",
);

const metadataMap = icons
  .map((icon) => `  "${icon.name}": ${JSON.stringify(icon.metadata)}`)
  .join(",\n");
await writeGenerated(
  path.join(baseSource, "iconMetadata.ts"),
  `import type { IconMetadata } from "./types";

export const iconMetadata = {
${metadataMap}
} as const satisfies Record<string, IconMetadata>;`,
);

await writeGenerated(
  path.join(docsData, "icons.generated.json"),
  JSON.stringify(
    icons.map((icon) => ({
      name: icon.name,
      componentName: icon.componentName,
      nodes: icon.nodes,
      svg: icon.svg,
      ...icon.metadata,
    })),
    null,
    2,
  ),
);
await writeGenerated(
  path.join(docsData, "categories.generated.json"),
  JSON.stringify(categories, null, 2),
);

console.log(`Generated packages and docs data for ${icons.length} icons.`);

function iconName(name) {
  return name
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join("");
}
