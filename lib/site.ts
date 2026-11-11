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

export type SiteLocale = (typeof siteConfig.locales)[number];

type SocialShareImage = {
  url: string;
  width: 1200;
  height: 630;
  type: "image/png";
  alt: string;
};

const SOCIAL_SHARE_IMAGES = {
  en: {
    url: "/images/social/corevia-social-share-en.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "CoreVia Software — Technology Solutions for Your Business. Custom Software, AI and Automation.",
  },
  es: {
    url: "/images/social/corevia-social-share-es.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "CoreVia Software — Soluciones Tecnológicas para tu Negocio. Software a medida, inteligencia artificial y automatización.",
  },
} as const satisfies Record<SiteLocale, SocialShareImage>;

const OG_LOCALES = {
  en: "en_US",
  es: "es_CO",
} as const satisfies Record<SiteLocale, string>;

/** @deprecated Prefer getOgImage(locale). Kept as English company default for shared consumers. */
export const ogImagePath = SOCIAL_SHARE_IMAGES.en.url;

/** English company-default share image (Organization JSON-LD, non-locale callers). */
export const ogImage = SOCIAL_SHARE_IMAGES.en;

export function resolveSiteLocale(locale: string): SiteLocale {
  return siteConfig.locales.includes(locale as SiteLocale)
    ? (locale as SiteLocale)
    : siteConfig.localeDefault;
}

/** Locale-aware Open Graph / Twitter share image (1200×630). */
export function getOgImage(locale: string): SocialShareImage {
  return SOCIAL_SHARE_IMAGES[resolveSiteLocale(locale)];
}

export function getOgLocale(locale: string): string {
  return OG_LOCALES[resolveSiteLocale(locale)];
}

export function getOgAlternateLocales(locale: string): string[] {
  const current = resolveSiteLocale(locale);
  return siteConfig.locales
    .filter((code) => code !== current)
    .map((code) => OG_LOCALES[code]);
}

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
