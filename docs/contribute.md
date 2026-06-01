# Contribute

OpenHuman Icons grows one carefully reviewed medical metaphor at a time.

## Add An Icon

Create matching files:

```text
icons/<name>.svg
icons/<name>.json
```

Use a kebab-case name, follow the `24px` outline design contract, and include searchable tags, categories, contributors, and use cases.

## Verify Your Work

```bash
pnpm optimize
pnpm lint
pnpm test
pnpm build
pnpm docs:build
```

Generated package modules and docs indexes are intentionally ignored.
