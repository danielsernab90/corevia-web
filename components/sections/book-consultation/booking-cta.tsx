"use client";

import { useTranslations } from "next-intl";

import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";

export function BookingCta() {
  const t = useTranslations("BookConsultation.cta");
  const { openBooking } = useBooking();

  return (
    <Section
      tone="dark"
      spacing="md"
      aria-labelledby="booking-cta-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />

      <Container size="md" className="relative text-center">
        <SectionReveal>
          <Heading
            id="booking-cta-heading"
            size="h2"
            align="center"
            className="tracking-tight text-secondary-foreground"
          >
            {t("title")}
          </Heading>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-secondary-foreground/75">
            {t("description")}
          </p>
          <Button
            type="button"
            size="cta"
            className="mt-8"
            onClick={openBooking}
          >
            {t("button")}
          </Button>
        </SectionReveal>
      </Container>
    </Section>
  );
}
