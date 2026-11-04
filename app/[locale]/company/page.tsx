import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "next/navigation";

import { routing } from "@/i18n/routing";
import { getLocaleAlternates, getSiteUrl, ogImage } from "@/lib/site";

type CompanyPageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Legacy Company URL — permanently redirected to the merged About page.
 * Metadata retained for crawlers that still resolve the path before redirect.
 */
export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "About.meta",
  });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      url: getSiteUrl(`/${locale}/about`),
    },
    alternates: getLocaleAlternates(locale, "/about"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  setRequestLocale(locale);
  permanentRedirect(`/${locale}/about`);
}
