import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContactExperience } from "@/components/sections/contact/contact-experience";
import { routing } from "@/i18n/routing";
import { getSiteUrl, ogImage } from "@/lib/site";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "Contact.meta",
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
      url: getSiteUrl(`/${locale}/contact`),
    },
    alternates: {
      canonical: getSiteUrl(`/${locale}/contact`),
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <ContactExperience />;
}
