"use client";

import { useTranslations } from "next-intl";

import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function ServicesInquiry() {
  const t = useTranslations("Services.inquiry");

  return (
    <Section
      id="services-inquiry"
      tone="dark"
      spacing="md"
      aria-labelledby="services-inquiry-heading"
      className="relative scroll-mt-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_55%)]"
      />

      <Container size="lg" className="relative">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="services-inquiry-heading"
            size="h2"
            align="center"
            className="mt-3 font-display tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-secondary-foreground/75">
            {t("description")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/book-consultation"
              className={cn(buttonVariants({ size: "cta" }))}
            >
              {t("scheduleCta")}
            </Link>
            <a
              href="#services-inquiry-form"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground"
              )}
            >
              {t("projectCta")}
            </a>
          </div>
        </SectionReveal>

        <FadeUp
          id="services-inquiry-form"
          className="mx-auto mt-10 max-w-xl scroll-mt-28"
        >
          <ConsultationFormFlow
            idPrefix="services-"
            variant="inline"
            actionsAlign="center"
            inquirySource="services-page"
          />
        </FadeUp>
      </Container>
    </Section>
  );
}
