import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { EmpezarExperience } from "@/components/sections/empezar/empezar-experience";
import { routing } from "@/i18n/routing";
import { getSiteUrl, ogImage } from "@/lib/site";

type EmpezarPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: EmpezarPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "Empezar.meta",
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
      url: getSiteUrl(`/${locale}/empezar`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/empezar`),
    },
  };
}

export default async function EmpezarPage({ params }: EmpezarPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <EmpezarExperience />;
}
