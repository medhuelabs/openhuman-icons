import { createElement, forwardRef } from "react";
import { Icon, type IconNode, type OpenHumanIconProps } from "./Icon";

export function createOpenHumanIcon(displayName: string, iconNode: IconNode) {
  const Component = forwardRef<SVGSVGElement, OpenHumanIconProps>(
    (props, ref) => createElement(Icon, { ref, iconNode, ...props }),
  );
  Component.displayName = displayName;
  return Component;
}
