# React

`@medhuelabs/openhuman-icons-react` exports one component for every icon.

```tsx
import { HeartPulse } from "@medhuelabs/openhuman-icons-react";

export function Example() {
  return <HeartPulse color="#08758a" size={32} strokeWidth={2} />;
}
```

## Props

| Prop                  | Type               | Default        |
| --------------------- | ------------------ | -------------- |
| `size`                | `number \| string` | `24`           |
| `color`               | `string`           | `currentColor` |
| `strokeWidth`         | `number \| string` | `2`            |
| `absoluteStrokeWidth` | `boolean`          | `false`        |
| `title`               | `string`           | none           |

All standard SVG properties are forwarded to the rendered `<svg>` element.
