import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { WorkExperience } from "@/components/sections/work/work-experience";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

type WorkPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "Work.meta",
  });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getSiteUrl(`/${locale}/work`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/work`),
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <WorkExperience />;
}
