# OpenHuman Icons Repository Guide

OpenHuman Icons is a standalone public medical SVG icon library. Keep the canonical source of truth in `icons/*.svg` and adjacent `icons/*.json` metadata files.

## Commands

- Install: `pnpm install`
- Validate canonical icons: `pnpm check:icons`
- Generate package source and docs indexes: `pnpm generate`
- Test: `pnpm test`
- Build packages: `pnpm build`
- Run docs: `pnpm docs:dev`
- Build docs: `pnpm docs:build`

## Conventions

- Add or change canonical SVG files only in `icons/`.
- Do not commit generated package modules or generated docs indexes.
- Use kebab-case icon filenames and Lucide-compatible 24px outline geometry.
- Keep framework packages generated from the canonical SVG source.
- Use Conventional Commits such as `feat(icons): add heart-pulse`.
