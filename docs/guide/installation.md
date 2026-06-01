# Installation

Choose the smallest package that fits your application.

## Framework-Agnostic Icon Data

```bash
pnpm add @medhuelabs/openhuman-icons
```

```ts
import { HeartPulse, iconToSvg } from "@medhuelabs/openhuman-icons";

const svg = iconToSvg(HeartPulse);
```

## React Components

```bash
pnpm add @medhuelabs/openhuman-icons-react
```

```tsx
import { HeartPulse } from "@medhuelabs/openhuman-icons-react";

export function Example() {
  return <HeartPulse />;
}
```
