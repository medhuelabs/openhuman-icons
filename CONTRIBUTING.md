# Contributing To OpenHuman Icons

## Icon Contributions

Each icon has two canonical source files:

```text
icons/<name>.svg
icons/<name>.json
```

Use kebab-case names. SVGs must use a `24 24` viewbox, no fill, `currentColor`, a `2px` stroke, and round caps and joins. Keep geometry optically balanced and readable at 24px.

Metadata must include at least one contributor, category, tag, and use case. Categories are flat and an icon may belong to more than one category.

## Local Checks

```bash
pnpm install
pnpm optimize
pnpm lint
pnpm test
pnpm build
pnpm docs:build
```

Do not commit generated package modules or docs indexes.

## Pull Requests

Keep pull requests focused. Include a short rationale and a preview screenshot for visible icon or website changes.
