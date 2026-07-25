/**
 * Site-wide constants used for SEO and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://corevia.com).
 */
export const siteConfig = {
  name: "CoreVia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://corevia-web-iota.vercel.app",
  localeDefault: "en",
  locales: ["en", "es"] as const,
} as const;

/**
 * Open Graph / Twitter share image.
 * Filename contains spaces — always use this URL-encoded path in metadata
 * and absolute links. Actual pixels: 1731×909 (≈1.91:1 OG ratio).
 */
export const ogImagePath = "/logos/COREVIA%20FLAVICON%201200X630.png";

export const ogImage = {
  url: ogImagePath,
  width: 1731,
  height: 909,
  alt: "CoreVia — Custom Software for Your Business",
} as const;

export function getSiteUrl(path = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath === "/" ? "" : normalizedPath}`;
}
