import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CinematicIntro } from "@/components/cinematic/cinematic-intro";
import { CinematicPreload } from "@/components/cinematic/cinematic-preload";
import { BuiltAroundBusiness } from "@/components/sections/built-around-business";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Hero } from "@/components/sections/hero";
import { HowWeWork } from "@/components/sections/how-we-work";
import { WhatWeCanBuild } from "@/components/sections/what-we-can-build";
import { BookingShell } from "@/components/shared/booking-shell";
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
      <CinematicPreload locale={locale} />
      <CinematicIntro locale={locale} />
      <BookingShell>
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <BuiltAroundBusiness />
          <FeaturedWork />
          <WhatWeCanBuild />
          <HowWeWork />
        </main>
      </BookingShell>
    </>
  );
}
