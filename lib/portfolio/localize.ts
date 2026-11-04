import type { LocalizedText } from "@/types/portfolio";
import type { AppLocale } from "@/i18n/routing";

/** Prefer Spanish when present; fall back to English source copy. */
export function localizeText(
  text: LocalizedText,
  locale: AppLocale
): string {
  if (locale === "es" && text.es) {
    return text.es;
  }
  return text.en;
}
