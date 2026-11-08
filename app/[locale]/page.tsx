import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CinematicIntro } from "@/components/cinematic/cinematic-intro";
import { CinematicPreload } from "@/components/cinematic/cinematic-preload";
import { HomeExperience } from "@/components/sections/home/home-experience";
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

  /**
   * Homepage media architecture (Phase 3):
   * A) Existing cinematic intro remains the initial experience (assets preserved).
   * B) Future integrated hero video can mount inside HomeHero without removing A.
   * Do not delete cinematic source assets when evolving the hero.
   */
  return (
    <>
      <CinematicPreload />
      <CinematicIntro />
      <BookingShell>
        <main id="main-content" tabIndex={-1}>
          <HomeExperience />
        </main>
      </BookingShell>
    </>
  );
}
