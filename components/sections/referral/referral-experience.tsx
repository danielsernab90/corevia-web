"use client";

import { useLocale, useTranslations } from "next-intl";

import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";
import type { AppLocale } from "@/i18n/routing";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ReferralExperience() {
  const t = useTranslations("Referral");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale, { intent: "referral" });

  return (
    <main>
      <Section
        tone="dark"
        spacing="none"
        aria-labelledby="referral-hero-heading"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
        />
        <Container
          size="xl"
          className="relative flex min-h-[min(44dvh,22rem)] flex-col justify-center py-14 md:py-16 lg:py-20"
        >
          <SectionReveal className="mx-auto max-w-3xl text-center">
            <Heading
              id="referral-hero-heading"
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
        aria-labelledby="referral-form-heading"
      >
        <Container size="md">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <Heading
              id="referral-form-heading"
              size="h2"
              align="center"
              className="tracking-tight glow-text-brand-soft"
            >
              {t("form.title")}
            </Heading>
            <p className="mt-4 font-sans text-body-lg text-muted-foreground">
              {t("form.description")}
            </p>
          </SectionReveal>

          <FadeUp className="mx-auto mt-10 max-w-xl">
            <ConsultationFormFlow
              idPrefix="referral-"
              variant="inline"
              actionsAlign="center"
            />
            <p className="mt-6 text-center font-sans text-sm text-muted-foreground">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {t("whatsappLink")}
              </a>
            </p>
          </FadeUp>
        </Container>
      </Section>
    </main>
  );
}
