"use client";

import { useCallback, useState } from "react";

import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { getCalendlyBookingUrl } from "@/lib/calendly";
import { cn } from "@/lib/utils";

export function BookingModal() {
  const { open, setOpen } = useBooking();
  const [flowKey, setFlowKey] = useState(0);
  const [step, setStep] = useState(0);

  const calendlyConfigured = Boolean(getCalendlyBookingUrl());
  /** Widen only when optional Calendly iframe is actually shown (schedule step). */
  const wideSchedule = calendlyConfigured && step === 4;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        window.setTimeout(() => {
          setFlowKey((prev) => prev + 1);
          setStep(0);
        }, 280);
      }
    },
    [setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup
        className={cn(
          wideSchedule ? "max-w-3xl" : "max-w-xl",
          "shadow-[0_1px_2px_rgb(11_15_25/0.04),0_0_24px_rgba(22,82,240,0.25)]"
        )}
      >
        <ConsultationFormFlow
          key={flowKey}
          variant="modal"
          inquirySource="book-consultation-modal"
          active={open}
          onRequestClose={() => handleOpenChange(false)}
          onStepChange={setStep}
        />
      </DialogPopup>
    </Dialog>
  );
}
