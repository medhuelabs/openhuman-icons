import { describe, expect, it } from "vitest";
import { searchIcons } from "../docs/.vitepress/theme/search";

const icons = [
  {
    name: "heart-pulse",
    aliases: [{ name: "cardiac-pulse" }],
    categories: ["anatomy", "diagnostics"],
    tags: ["heartbeat", "cardiac"],
    "use-cases": ["patient monitoring"],
  },
  {
    name: "pill",
    aliases: [{ name: "capsule" }],
    categories: ["medications"],
    tags: ["pharmacy"],
    "use-cases": ["medication management"],
  },
];

describe("catalog search", () => {
  it("matches names, aliases, tags, categories, and use cases", () => {
    expect(searchIcons(icons, "heart").map((icon) => icon.name)).toEqual([
      "heart-pulse",
    ]);
    expect(searchIcons(icons, "capsule").map((icon) => icon.name)).toEqual([
      "pill",
    ]);
    expect(
      searchIcons(icons, "patient monitoring").map((icon) => icon.name),
    ).toEqual(["heart-pulse"]);
    expect(searchIcons(icons, "pharmacy").map((icon) => icon.name)).toEqual([
      "pill",
    ]);
    expect(searchIcons(icons, "diagnostics").map((icon) => icon.name)).toEqual([
      "heart-pulse",
    ]);
  });

  it("filters by category", () => {
    expect(
      searchIcons(icons, "", "medications").map((icon) => icon.name),
    ).toEqual(["pill"]);
  });
});
