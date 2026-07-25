import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LegalDocument } from "@/components/sections/legal/legal-document";
import { routing } from "@/i18n/routing";
import { privacySectionKeys } from "@/lib/legal";
import { getSiteUrl } from "@/lib/site";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Privacy.meta" });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getSiteUrl(`/${locale}/privacy`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/privacy`),
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  const t = await getTranslations("Privacy");

  return (
    <LegalDocument
      title={t("title")}
      lastUpdatedLabel={t("lastUpdatedLabel")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      sections={privacySectionKeys.map((key) => ({
        key,
        heading: t(`sections.${key}.heading`),
        body: t(`sections.${key}.body`),
      }))}
    />
  );
}
