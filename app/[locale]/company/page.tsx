import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CompanyExperience } from "@/components/sections/company/company-experience";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

type CompanyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "Company.meta",
  });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getSiteUrl(`/${locale}/company`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/company`),
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <CompanyExperience />;
}
