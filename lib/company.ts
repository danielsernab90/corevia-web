/**
 * Company page content keys — labels live in next-intl (`Company.*`).
 */

export const companyStackKeys = [
  "nextjs",
  "supabase",
  "vercel",
  "typescript",
  "tailwind",
] as const;

export type CompanyStackKey = (typeof companyStackKeys)[number];
