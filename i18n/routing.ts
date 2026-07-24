import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for locales.
 * To add a language later: append to `locales` and add `messages/{code}.json`.
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type AppLocale = (typeof routing.locales)[number];
