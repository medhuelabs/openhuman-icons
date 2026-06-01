export interface SearchableIcon {
  name: string;
  aliases?: { name: string }[];
  categories: string[];
  tags: string[];
  "use-cases": string[];
}

export function searchIcons<T extends SearchableIcon>(
  icons: T[],
  query: string,
  category = "all",
) {
  const normalizedQuery = query.trim().toLowerCase();
  return icons.filter((icon) => {
    if (category !== "all" && !icon.categories.includes(category)) return false;
    if (!normalizedQuery) return true;
    return [
      icon.name,
      ...icon.categories,
      ...icon.tags,
      ...icon["use-cases"],
      ...(icon.aliases ?? []).map((alias) => alias.name),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
}
