"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { requestOpenBooking } from "@/lib/booking-events";
import { cn } from "@/lib/utils";

type StartProjectCtaProps = {
  className?: string;
  /** Optional analytics / placement hint for future use. */
  placement?: string;
};

/**
 * Shared "Start Your Project" / "Comienza Tu Proyecto" trigger.
 * Opens the existing BookingModal via the established booking event bridge.
 */
export function StartProjectCta({ className }: StartProjectCtaProps) {
  const t = useTranslations("Common");

  return (
    <Button
      type="button"
      size="cta"
      className={cn(
        "min-h-12 w-full touch-manipulation sm:w-auto",
        className
      )}
      onClick={requestOpenBooking}
    >
      {t("startProject")}
    </Button>
  );
}
