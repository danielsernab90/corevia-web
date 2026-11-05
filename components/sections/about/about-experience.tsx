"use client";

import { AboutClosing } from "@/components/sections/about/about-closing";
import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutHowWeWork } from "@/components/sections/about/about-how-we-work";
import { AboutMission } from "@/components/sections/about/about-mission";
import { AboutStack } from "@/components/sections/about/about-stack";
import { AboutStory } from "@/components/sections/about/about-story";
import { AboutTeam } from "@/components/sections/about/about-team";
import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";

/**
 * Merged About experience: former Company + About Us content in one narrative.
 */
export function AboutExperience() {
  return (
    <BookingProvider>
      <main id="main-content" tabIndex={-1}>
        <AboutHero />
        <AboutMission />
        <AboutStory />
        <AboutTeam />
        <AboutHowWeWork />
        <AboutStack />
        <AboutClosing />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
