import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BookConsultationExperience } from "@/components/sections/book-consultation/book-consultation-experience";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

type BookConsultationPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: BookConsultationPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "BookConsultation.meta",
  });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getSiteUrl(`/${locale}/book-consultation`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/book-consultation`),
    },
  };
}

export default async function BookConsultationPage({
  params,
}: BookConsultationPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <BookConsultationExperience />;
}
