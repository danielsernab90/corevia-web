/**
 * Site-wide constants used for SEO and absolute URLs.
 * Prefer NEXT_PUBLIC_SITE_URL in Vercel; fallback matches the primary production host.
 */
export const siteConfig = {
  name: "CoreVia",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://corevia-software.vercel.app",
  localeDefault: "en",
  locales: ["en", "es"] as const,
} as const;

/**
 * Default Open Graph / Twitter share image (1200×630).
 * Approved Spanish premium banner — separate from logos/favicon assets.
 */
export const ogImagePath = "/images/social/corevia-social-share-es.png";

export const ogImage = {
  url: ogImagePath,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "CoreVia Software — Soluciones Tecnológicas para tu Negocio. Software a medida, inteligencia artificial y automatización.",
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
