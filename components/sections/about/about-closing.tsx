"use client";

import { useLocale, useTranslations } from "next-intl";

import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/routing";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function AboutClosing() {
  const tClosing = useTranslations("About.closing");
  const tCta = useTranslations("About.cta");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);
  const { openBooking } = useBooking();

  return (
    <>
      <Section
        tone="surface"
        spacing="tight"
        aria-labelledby="about-closing-heading"
      >
        <Container size="md">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <h2 id="about-closing-heading" className="sr-only">
              {tClosing("label")}
            </h2>
            <p className="font-sans text-body-lg text-muted-foreground">
              {tClosing("body")}
            </p>
          </SectionReveal>
        </Container>
      </Section>

      <Section
        tone="dark"
        spacing="tight"
        aria-labelledby="about-cta-heading"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
        />

        <Container size="md" className="relative text-center">
          <SectionReveal>
            <Heading
              id="about-cta-heading"
              size="h2"
              align="center"
              className="tracking-tight glow-text-white-soft"
              style={{ color: "var(--secondary-foreground)" }}
            >
              {tCta("title")}
            </Heading>
            <p className="mx-auto mt-4 max-w-xl text-body-lg text-secondary-foreground/75">
              {tCta("description")}
            </p>
            <Button
              type="button"
              size="cta"
              className="mt-8"
              onClick={openBooking}
            >
              {tCta("button")}
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-4 block max-w-md text-caption leading-relaxed text-secondary-foreground/60 underline-offset-4 transition-colors hover:text-secondary-foreground/80 hover:underline"
            >
              {tCta("textNote")}
            </a>
          </SectionReveal>
        </Container>
      </Section>
    </>
  );
}
