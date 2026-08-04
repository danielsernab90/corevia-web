"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { ContactDetails } from "@/components/sections/contact/contact-details";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";

export function ContactExperience() {
  const t = useTranslations("Contact");

  return (
    <main id="main-content" tabIndex={-1}>
      <Section
        tone="dark"
        spacing="none"
        aria-labelledby="contact-hero-heading"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
        />
        <Container
          size="xl"
          className="relative flex min-h-[min(52dvh,28rem)] flex-col justify-center py-14 md:py-16 lg:py-20"
        >
          <SectionReveal className="mx-auto max-w-3xl text-center">
            <Heading
              id="contact-hero-heading"
              size="h1"
              align="center"
              className="tracking-tight glow-text-white-soft"
              style={{ color: "var(--secondary-foreground)" }}
            >
              {t("hero.title")}
            </Heading>
            <p className="mt-5 font-sans text-body-lg text-secondary-foreground/75">
              {t("hero.description")}
            </p>
          </SectionReveal>
        </Container>
      </Section>

      <Section
        tone="surface"
        spacing="tight"
        aria-labelledby="contact-details-heading"
      >
        <Container size="xl">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <SectionReveal className="min-w-0">
              <ContactDetails headingId="contact-details-heading" />
            </SectionReveal>

            <FadeUp className="min-w-0">
              <ConsultationFormFlow
                idPrefix="contact-"
                variant="inline"
                inquirySource="contact-page"
              />
            </FadeUp>
          </div>
        </Container>
      </Section>
    </main>
  );
}
