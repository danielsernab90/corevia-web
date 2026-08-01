"use client";

import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";
import { EmpezarActions } from "@/components/sections/empezar/empezar-actions";
import { EmpezarCta } from "@/components/sections/empezar/empezar-cta";
import { EmpezarHero } from "@/components/sections/empezar/empezar-hero";
import { EmpezarHowWeWork } from "@/components/sections/empezar/empezar-how-we-work";

export function EmpezarExperience() {
  return (
    <BookingProvider>
      <main id="main-content" tabIndex={-1}>
        <EmpezarHero />
        <EmpezarActions />
        <EmpezarHowWeWork />
        <EmpezarCta />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
