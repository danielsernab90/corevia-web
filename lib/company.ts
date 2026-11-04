/**
 * Shared stack keys for About (merged Company content).
 * Labels live in next-intl (`About.stack.items.*`).
 */

export const companyStackKeys = [
  "nextjs",
  "supabase",
  "vercel",
  "typescript",
  "tailwind",
  "premiere",
  "metaBusiness",
  "googleAds",
] as const;

export type CompanyStackKey = (typeof companyStackKeys)[number];
