"use client";

import type { ReactNode } from "react";

import { BookingModal } from "@/components/sections/book-consultation/booking-modal";
import { BookingProvider } from "@/components/sections/book-consultation/booking-provider";

/**
 * Mounts the existing questionnaire modal for homepage (and similar surfaces)
 * without duplicating form logic. Section CTAs open it via requestOpenBooking /
 * useBooking.
 */
export function BookingShell({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      {children}
      <BookingModal />
    </BookingProvider>
  );
}
