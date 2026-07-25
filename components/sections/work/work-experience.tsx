"use client";

import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";
import { WorkCases } from "@/components/sections/work/work-cases";
import { WorkCta } from "@/components/sections/work/work-cta";
import { WorkHero } from "@/components/sections/work/work-hero";

export function WorkExperience() {
  return (
    <BookingProvider>
      <main>
        <WorkHero />
        <WorkCases />
        <WorkCta />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
