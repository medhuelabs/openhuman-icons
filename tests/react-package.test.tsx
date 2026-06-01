import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeartPulse } from "../packages/openhuman-icons-react/src";

describe("@medhuelabs/openhuman-icons-react", () => {
  it("renders a generated medical icon component", () => {
    const markup = renderToStaticMarkup(
      <HeartPulse size={48} color="#08758a" title="Heart pulse" />,
    );
    expect(markup).toContain('width="48"');
    expect(markup).toContain('stroke="#08758a"');
    expect(markup).toContain("<title>Heart pulse</title>");
    expect(markup).toContain('role="img"');
  });

  it("keeps the visual stroke fixed when requested", () => {
    const markup = renderToStaticMarkup(
      <HeartPulse size={48} absoluteStrokeWidth />,
    );
    expect(markup).toContain('stroke-width="1"');
    expect(markup).toContain('aria-hidden="true"');
  });
});
