"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionReveal } from "@/components/shared/motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { requestOpenBooking } from "@/lib/booking-events";
import { cn } from "@/lib/utils";

export function HomeFinalCta() {
  const t = useTranslations("Home.finalCta");

  return (
    <Section
      tone="dark"
      spacing="md"
      aria-labelledby="home-final-cta-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_55%)]"
      />

      <Container size="lg" className="relative">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2
            id="home-final-cta-heading"
            className="font-display text-display tracking-tight text-secondary-foreground"
          >
            {t("title")}
          </h2>
          <p className="mt-5 font-sans text-body-lg text-[#b3c7d5]">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="cta"
              className="w-full sm:w-auto"
              onClick={requestOpenBooking}
            >
              {t("primaryCta")}
            </Button>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "w-full border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground sm:w-auto"
              )}
            >
              {t("secondaryCta")}
            </Link>
          </div>
        </SectionReveal>
      </Container>
    </Section>
  );
}
