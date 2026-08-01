import type { DeviceType } from "@/lib/analytics/types";

/**
 * Browser / request context collectors used to enrich every event.
 * Kept free of provider knowledge (Single Responsibility).
 */

export function detectDeviceType(
  userAgent = typeof navigator !== "undefined" ? navigator.userAgent : ""
): DeviceType {
  if (!userAgent) return "unknown";

  const ua = userAgent.toLowerCase();

  // Tablets before mobile — many tablets include "mobile" in the UA string.
  if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return "tablet";
  }

  if (
    /mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/i.test(
      ua
    )
  ) {
    return "mobile";
  }

  return "desktop";
}

/**
 * Current path without locale prefix when the app uses `/en/...` / `/es/...`.
 * Falls back to pathname or "/" when unavailable (SSR / non-browser).
 */
export function getAnalyticsPage(
  pathname = typeof window !== "undefined" ? window.location.pathname : "/"
): string {
  if (!pathname) return "/";

  const localeStripped = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
  return localeStripped.length > 0 ? localeStripped : "/";
}

/**
 * Best-effort language from the URL locale segment, then `<html lang>`, then "en".
 */
export function getAnalyticsLanguage(
  pathname = typeof window !== "undefined" ? window.location.pathname : ""
): string {
  const match = pathname.match(/^\/(en|es)(?=\/|$)/);
  if (match?.[1]) return match[1];

  if (typeof document !== "undefined") {
    const lang = document.documentElement.lang?.trim().toLowerCase();
    if (lang) return lang.split("-")[0] ?? lang;
  }

  return "en";
}

export function getAnalyticsReferrer(): string {
  if (typeof document === "undefined") return "";
  return document.referrer || "";
}
