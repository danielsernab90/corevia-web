/**
 * Site-wide constants used for SEO and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://corevia.com).
 */
export const siteConfig = {
  name: "CoreVia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://coreviasoftware.vercel.app",
  localeDefault: "en",
  locales: ["en", "es"] as const,
} as const;

/**
 * Open Graph / Twitter share image (1200×630).
 * Brand navy canvas with centered 3D wordmark — separate from favicon assets.
 */
export const ogImagePath = "/logos/corevia-og-1200x630.png";

export const ogImage = {
  url: ogImagePath,
  width: 1200,
  height: 630,
  alt: "CoreVia — Custom Software for Your Business",
} as const;

export function getSiteUrl(path = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath === "/" ? "" : normalizedPath}`;
}
