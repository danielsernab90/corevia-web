import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ReferralExperience } from "@/components/sections/referral/referral-experience";
import { routing } from "@/i18n/routing";

type ReferralPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "Referral.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <ReferralExperience />;
}
