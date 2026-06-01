export type IconNodeAttributes = Record<string, string>;
export type IconNode = ReadonlyArray<
  readonly [tag: string, attributes: IconNodeAttributes]
>;

export interface IconAlias {
  name: string;
  deprecated?: true;
  deprecationReason?: string;
  toBeRemovedInVersion?: string;
}

export interface IconMetadata {
  $schema: string;
  aliases?: IconAlias[];
  contributors: string[];
  categories: string[];
  tags: string[];
  "use-cases": string[];
  deprecated?: true;
  deprecationReason?: string;
  toBeRemovedInVersion?: string;
}
