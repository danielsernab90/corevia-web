"use client";

import { useCallback, useState } from "react";

import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function BookingModal() {
  const { open, setOpen } = useBooking();
  const [flowKey, setFlowKey] = useState(0);
  const [step, setStep] = useState(0);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        // Delay remount so close animation finishes cleanly
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
        className={cn(step >= 4 && step < 5 ? "max-w-3xl" : "max-w-xl")}
      >
        <ConsultationFormFlow
          key={flowKey}
          variant="modal"
          active={open}
          onRequestClose={() => handleOpenChange(false)}
          onStepChange={setStep}
        />
      </DialogPopup>
    </Dialog>
  );
}
