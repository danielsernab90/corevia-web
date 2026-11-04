/**
 * Site-wide constants used for SEO and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in Vercel when a custom domain is approved.
 * Until then, keep the live Vercel production host as canonical.
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

/**
 * Locale-prefixed path without a leading locale segment.
 * Pass "" for homepage, "/services" for Services, etc.
 */
export function getLocalizedPath(locale: string, path = "") {
  const normalized =
    !path || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;
  return `/${locale}${normalized}`;
}

/** Canonical + hreflang alternates for a locale-scoped page path. */
export function getLocaleAlternates(locale: string, path = "") {
  const languages = Object.fromEntries(
    siteConfig.locales.map((code) => [
      code,
      getSiteUrl(getLocalizedPath(code, path)),
    ])
  );

  return {
    canonical: getSiteUrl(getLocalizedPath(locale, path)),
    languages: {
      ...languages,
      "x-default": getSiteUrl(getLocalizedPath(siteConfig.localeDefault, path)),
    },
  };
}
