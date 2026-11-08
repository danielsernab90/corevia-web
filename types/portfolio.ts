/**
 * Typed portfolio / case-study registry shapes for the redesign.
 * Copy may also live in next-intl message namespaces; registry holds structure + EN source.
 */

export type PortfolioCategoryId = "all" | "websites" | "software" | "commerce";

export type PortfolioCategoryTag = Exclude<PortfolioCategoryId, "all">;

export type DemoStatusKind =
  | "interactive-fictional-demo"
  | "website-operations-preview"
  | "simulated-ordering-demo"
  | "website-demo"
  | "unofficial-simulated-payments-demo";

export type LocalizedText = {
  en: string;
  /** Spanish copy is filled in Phase 2 via messages or registry — omit rather than invent. */
  es?: string;
};

export type PortfolioScreenshot = {
  /** Manifest asset_id (e.g. "3.01.58") — stable across renames. */
  assetId: string;
  /** Exact original screenshot filename from asset-manifest.csv */
  exactOriginalFilename: string;
  /** Public path under /public (leading slash). */
  src: string;
  /** Group / section label from the approved prototype. */
  groupLabel: LocalizedText;
  alt: LocalizedText;
  /** Manifest optimized basename (webp planned; Phase 1 ships JPEG). */
  optimizedBasename: string;
};

export type PortfolioScreenshotGroup = {
  id: string;
  label: LocalizedText;
  screenshotAssetIds: readonly string[];
};

export type PortfolioDemo = {
  /** Verified public demo URL only. */
  url: string;
  status: DemoStatusKind;
  statusLabel: LocalizedText;
  disclaimer: LocalizedText;
  /** Optional override for the external demo button label. */
  ctaLabel?: LocalizedText;
};

export type PortfolioProject = {
  /** Stable kebab-case ID used in routes and anchors. */
  id: string;
  /** Prototype short id (summit, cotinga, …). */
  prototypeId: string;
  displayOrder: number;
  name: LocalizedText;
  industry: LocalizedText;
  eyebrow: LocalizedText;
  shortDescription: LocalizedText;
  detailedDescription: LocalizedText;
  caseStudySummary: LocalizedText;
  categoryTags: readonly PortfolioCategoryTag[];
  featureHighlights: readonly LocalizedText[];
  accentColor: string;
  coverAssetId: string;
  coverImage: string;
  screenshotGroups: readonly PortfolioScreenshotGroup[];
  screenshots: readonly PortfolioScreenshot[];
  demo: PortfolioDemo;
  /** Optional secondary verified routes — empty until routes are confirmed. */
  verifiedSecondaryUrls: readonly string[];
};

export type PortfolioRegistry = {
  version: 1;
  brandBlueApproved: "#00AEEF";
  categories: readonly {
    id: PortfolioCategoryId;
    label: LocalizedText;
  }[];
  projects: readonly PortfolioProject[];
};
