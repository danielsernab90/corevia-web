/**
 * Site-wide constants used for SEO and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://corevia.com).
 */
export const siteConfig = {
  name: "Corevia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  localeDefault: "en",
  locales: ["en", "es"] as const,
} as const;

export function getSiteUrl(path = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath === "/" ? "" : normalizedPath}`;
}
