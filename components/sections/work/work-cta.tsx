"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionReveal } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { requestOpenBooking } from "@/lib/booking-events";

export function WorkCta() {
  const t = useTranslations("Work.cta");

  return (
    <Section
      tone="dark"
      spacing="md"
      aria-labelledby="work-cta-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,#153950,#071722_70%)]"
      />

      <Container size="lg" className="relative text-center">
        <SectionReveal>
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="work-cta-heading"
            className="mt-3 font-display text-display tracking-tight text-secondary-foreground"
          >
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-[#b1c7d5]">
            {t("description")}
          </p>
          <Button
            type="button"
            size="cta"
            className="mt-8"
            onClick={requestOpenBooking}
          >
            {t("button")}
          </Button>
        </SectionReveal>
      </Container>
    </Section>
  );
}
