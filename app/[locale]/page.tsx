import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CinematicIntro } from "@/components/cinematic/cinematic-intro";
import { BuiltAroundBusiness } from "@/components/sections/built-around-business";
import { Hero } from "@/components/sections/hero";
import { routing, type AppLocale } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  const locale = rawLocale as AppLocale;
  setRequestLocale(locale);

  return (
    <>
      <CinematicIntro locale={locale} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <BuiltAroundBusiness />
      </main>
    </>
  );
}
