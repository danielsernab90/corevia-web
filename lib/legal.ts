/**
 * Legal page section keys — copy lives in next-intl (`Privacy.*` / `Terms.*`).
 */

export const privacySectionKeys = [
  "collect",
  "use",
  "retention",
  "clientPlatforms",
  "contact",
] as const;

export const termsSectionKeys = [
  "use",
  "pricing",
  "warranty",
  "ownership",
  "noWarranty",
  "liability",
  "changes",
  "contact",
] as const;

export type PrivacySectionKey = (typeof privacySectionKeys)[number];
export type TermsSectionKey = (typeof termsSectionKeys)[number];
