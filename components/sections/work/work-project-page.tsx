"use client";

import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";
import { WorkCta } from "@/components/sections/work/work-cta";
import { WorkPortfolio } from "@/components/sections/work/work-portfolio";

type WorkProjectPageProps = {
  prototypeId: string;
};

export function WorkProjectPageExperience({
  prototypeId,
}: WorkProjectPageProps) {
  return (
    <BookingProvider>
      <main id="main-content" tabIndex={-1}>
        <WorkPortfolio initialPrototypeId={prototypeId} detailOnly />
        <WorkCta />
      </main>
      <BookingModal />
    </BookingProvider>
  );
}
