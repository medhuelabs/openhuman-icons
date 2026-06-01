import { defineConfig } from "vitepress";

export default defineConfig({
  title: "OpenHuman Icons",
  description: "Medical icons for human-centered software.",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["meta", { name: "theme-color", content: "#08758a" }],
    ["meta", { property: "og:title", content: "OpenHuman Icons" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Medical icons for human-centered software.",
      },
    ],
  ],
  sitemap: {
    hostname: "https://icons.openhumanatlas.com",
  },
});
