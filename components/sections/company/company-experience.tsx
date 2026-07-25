"use client";

import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";
import { CompanyCta } from "@/components/sections/company/company-cta";
import { CompanyFounder } from "@/components/sections/company/company-founder";
import { CompanyHero } from "@/components/sections/company/company-hero";
import { CompanyHowWeWork } from "@/components/sections/company/company-how-we-work";
import { CompanyStack } from "@/components/sections/company/company-stack";

export function CompanyExperience() {
  return (
    <BookingProvider>
      <main>
        <CompanyHero />
        <CompanyFounder />
        <CompanyHowWeWork />
        <CompanyStack />
        <CompanyCta />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
