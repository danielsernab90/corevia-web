/**
 * Services page content keys — labels live in next-intl (`Services.*`).
 */

export const serviceCategoryKeys = [
  "software",
  "ai",
  "apps",
  "integrations",
  "dashboards",
  "cloud",
  "videoEditing",
  "marketingStrategy",
  "adCampaigns",
  "contentCreation",
] as const;

export type ServiceCategoryKey = (typeof serviceCategoryKeys)[number];

export const serviceProcessKeys = [
  "reachOut",
  "fixedPrice",
  "build",
] as const;

export type ServiceProcessKey = (typeof serviceProcessKeys)[number];
