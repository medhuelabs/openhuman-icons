import { describe, expect, it } from "vitest";
import {
  HeartPulse,
  iconMetadata,
  icons,
  iconToSvg,
} from "../packages/openhuman-icons/src";

describe("@medhuelabs/openhuman-icons", () => {
  it("exports generated icon nodes and metadata", () => {
    expect(icons["heart-pulse"]).toBe(HeartPulse);
    expect(iconMetadata["heart-pulse"].categories).toContain("diagnostics");
    expect(iconMetadata["heart-pulse"].categories).toContain("anatomy");
  });

  it("serializes icon nodes into a standard SVG", () => {
    expect(iconToSvg(HeartPulse)).toContain('viewBox="0 0 24 24"');
    expect(iconToSvg(HeartPulse)).toContain('stroke="currentColor"');
  });
});
