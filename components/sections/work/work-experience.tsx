"use client";

import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";
import { WorkCta } from "@/components/sections/work/work-cta";
import { WorkHero } from "@/components/sections/work/work-hero";
import { WorkPortfolio } from "@/components/sections/work/work-portfolio";

export function WorkExperience() {
  return (
    <BookingProvider>
      <main id="main-content" tabIndex={-1}>
        <WorkHero />
        <WorkPortfolio />
        <WorkCta />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
