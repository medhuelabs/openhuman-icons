import { createElement, forwardRef } from "react";
import type { SVGProps } from "react";

export type IconNode = ReadonlyArray<
  readonly [tag: string, attributes: Record<string, string>]
>;

const toReactAttribute = (attribute: string) =>
  attribute.replace(/-([a-z])/g, (_, character: string) =>
    character.toUpperCase(),
  );

const reactAttributes = (attributes: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [
      toReactAttribute(key),
      value,
    ]),
  );

export interface OpenHumanIconProps extends SVGProps<SVGSVGElement> {
  absoluteStrokeWidth?: boolean;
  size?: number | string;
  title?: string;
}

export interface IconProps extends OpenHumanIconProps {
  iconNode: IconNode;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      absoluteStrokeWidth,
      children,
      className,
      color = "currentColor",
      iconNode,
      size = 24,
      strokeWidth = 2,
      title,
      ...props
    },
    ref,
  ) => {
    const computedStrokeWidth =
      absoluteStrokeWidth && typeof size === "number"
        ? (Number(strokeWidth) * 24) / size
        : strokeWidth;
    const accessible = Boolean(
      title || props["aria-label"] || props["aria-labelledby"],
    );

    return createElement(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: computedStrokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: ["openhuman-icon", className].filter(Boolean).join(" "),
        "aria-hidden": accessible ? undefined : "true",
        role: accessible ? "img" : undefined,
        ...props,
      },
      title ? createElement("title", null, title) : null,
      ...iconNode.map(([tag, attributes], index) =>
        createElement(tag, {
          ...reactAttributes(attributes),
          key: `${tag}-${index}`,
        }),
      ),
      children,
    );
  },
);

Icon.displayName = "OpenHumanIcon";
