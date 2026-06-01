# OpenHuman Icons

Medical icons for human-centered software.

OpenHuman Icons is an open-source SVG icon library for anatomy, clinical, and health applications. It follows a consistent 24px outline system and ships framework-agnostic icon data plus React components.

## Packages

```bash
pnpm add @medhuelabs/openhuman-icons
pnpm add @medhuelabs/openhuman-icons-react
```

```tsx
import { HeartPulse } from "@medhuelabs/openhuman-icons-react";

export function Example() {
  return <HeartPulse size={24} strokeWidth={2} />;
}
```

## Website

Browse icons and documentation at [icons.openhumanatlas.com](https://icons.openhumanatlas.com).

## Development

```bash
pnpm install
pnpm check:icons
pnpm test
pnpm build
pnpm docs:dev
```

Generated package modules and generated documentation indexes are intentionally ignored. Run `pnpm generate` after changing canonical icons.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before adding icons.

## License

OpenHuman Icons is available under the [ISC License](./LICENSE). See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for attribution.
