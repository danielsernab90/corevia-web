"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeShortKey = {
  en: "enShort",
  es: "esShort",
} as const satisfies Record<AppLocale, "enShort" | "esShort">;

type LanguageSwitcherProps = {
  className?: string;
  surface?: "default" | "onDark";
};

/**
 * Pill language switcher. Preference is persisted by next-intl (`NEXT_LOCALE` cookie).
 */
export function LanguageSwitcher({
  className,
  surface = "default",
}: LanguageSwitcherProps) {
  const t = useTranslations("Common");
  const tLocale = useTranslations("Locale");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const onDark = surface === "onDark";

  function onLocaleChange(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("language")}
      className={cn(
        "inline-flex items-center rounded-pill border p-0.5",
        onDark
          ? "border-white/15 bg-white/5"
          : "border-border bg-muted/60",
        className
      )}
    >
      {routing.locales.map((code) => {
        const selected = code === locale;

        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${tLocale(localeShortKey[code])} — ${tLocale(code)}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onLocaleChange(code)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                return;
              }

              event.preventDefault();
              const index = routing.locales.indexOf(code);
              const delta = event.key === "ArrowRight" ? 1 : -1;
              const next =
                routing.locales[
                  (index + delta + routing.locales.length) %
                    routing.locales.length
                ];
              onLocaleChange(next);
            }}
            className={cn(
              "inline-flex min-h-9 min-w-9 items-center justify-center rounded-pill px-3 py-2 text-caption font-semibold tracking-wide uppercase transition-colors",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              onDark
                ? selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-[#b4c8d5] hover:text-white"
                : selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tLocale(localeShortKey[code])}
          </button>
        );
      })}
    </div>
  );
}
