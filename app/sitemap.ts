import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { portfolioProjects } from "@/lib/portfolio/registry";
import { getLocalizedPath, getSiteUrl, siteConfig } from "@/lib/site";

/** Static customer-facing paths (locale prefix applied below). */
const STATIC_PATHS = [
  "",
  "/services",
  "/work",
  "/about",
  "/contact",
  "/book-consultation",
  "/privacy",
  "/terms",
  "/referral",
  "/empezar",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const languages = Object.fromEntries(
        routing.locales.map((code) => [
          code,
          getSiteUrl(getLocalizedPath(code, path)),
        ])
      );

      entries.push({
        url: getSiteUrl(getLocalizedPath(locale, path)),
        lastModified,
        alternates: {
          languages: {
            ...languages,
            "x-default": getSiteUrl(
              getLocalizedPath(siteConfig.localeDefault, path)
            ),
          },
        },
      });
    }

    for (const project of portfolioProjects) {
      const path = `/work/${project.prototypeId}`;
      const languages = Object.fromEntries(
        routing.locales.map((code) => [
          code,
          getSiteUrl(getLocalizedPath(code, path)),
        ])
      );

      entries.push({
        url: getSiteUrl(getLocalizedPath(locale, path)),
        lastModified,
        alternates: {
          languages: {
            ...languages,
            "x-default": getSiteUrl(
              getLocalizedPath(siteConfig.localeDefault, path)
            ),
          },
        },
      });
    }
  }

  return entries;
}
