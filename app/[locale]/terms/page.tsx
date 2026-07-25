import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LegalDocument } from "@/components/sections/legal/legal-document";
import { routing } from "@/i18n/routing";
import { termsSectionKeys } from "@/lib/legal";
import { getSiteUrl, ogImage } from "@/lib/site";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Terms.meta" });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      url: getSiteUrl(`/${locale}/terms`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/terms`),
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  const t = await getTranslations("Terms");

  return (
    <LegalDocument
      title={t("title")}
      lastUpdatedLabel={t("lastUpdatedLabel")}
      lastUpdated={t("lastUpdated")}
      sections={termsSectionKeys.map((key) => ({
        key,
        heading: t(`sections.${key}.heading`),
        body: t(`sections.${key}.body`),
      }))}
    />
  );
}
