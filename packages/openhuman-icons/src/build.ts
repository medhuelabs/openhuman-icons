import type { IconNode, IconNodeAttributes } from "./types";

export const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const renderAttributes = (attributes: IconNodeAttributes) =>
  Object.entries(attributes)
    .map(([key, value]) => `${key}="${escape(String(value))}"`)
    .join(" ");

export function iconToSvg(
  iconNode: IconNode,
  attributes: IconNodeAttributes = {},
) {
  const svgAttributes = renderAttributes({
    ...defaultAttributes,
    ...attributes,
  });
  const children = iconNode
    .map(
      ([tag, childAttributes]) =>
        `<${tag} ${renderAttributes(childAttributes)} />`,
    )
    .join("");
  return `<svg ${svgAttributes}>${children}</svg>`;
}
