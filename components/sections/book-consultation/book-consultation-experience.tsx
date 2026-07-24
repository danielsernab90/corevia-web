"use client";

import { BookingCta } from "@/components/sections/book-consultation/booking-cta";
import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";
import { ConsultationFaq } from "@/components/sections/book-consultation/consultation-faq";
import { ConsultationHero } from "@/components/sections/book-consultation/consultation-hero";
import { HowItWorks } from "@/components/sections/book-consultation/how-it-works";
import { Outcomes } from "@/components/sections/book-consultation/outcomes";
import { TrustSection } from "@/components/sections/book-consultation/trust-section";
import { WhatToExpect } from "@/components/sections/book-consultation/what-to-expect";
import { WhoThisIsFor } from "@/components/sections/book-consultation/who-this-is-for";

export function BookConsultationExperience() {
  return (
    <BookingProvider>
      <main>
        <ConsultationHero />
        <WhatToExpect />
        <Outcomes />
        <WhoThisIsFor />
        <HowItWorks />
        <ConsultationFaq />
        <TrustSection />
        <BookingCta />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
