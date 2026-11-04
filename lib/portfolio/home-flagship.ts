/**
 * Homepage flagship screenshot strip — Construction OS demos from the
 * approved V2 prototype (not aggressive crops of every asset).
 */
export const FLAGSHIP_PREVIEW_ASSET_IDS = [
  "3.01.58",
  "3.02.07",
  "3.02.13",
  "3.02.21",
  "3.03.09",
] as const;

export type FlagshipPreviewAssetId =
  (typeof FLAGSHIP_PREVIEW_ASSET_IDS)[number];
