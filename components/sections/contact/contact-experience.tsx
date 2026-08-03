"use client";

import { Clock3, MapPin, MessageSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";
import type { AppLocale } from "@/i18n/routing";
import { brandColors } from "@/lib/design-tokens";
import { coreviaIconProps } from "@/lib/icons";
import {
  WHATSAPP_DISPLAY_NUMBER,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

const INSTAGRAM_HREF = "https://www.instagram.com/corevia_software/";
const INSTAGRAM_HANDLE = "@corevia_software";

const textDetailItems = [
  { key: "location", Icon: MapPin },
  { key: "response", Icon: MessageSquare },
  { key: "hours", Icon: Clock3 },
] as const;

export function ContactExperience() {
  const t = useTranslations("Contact");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);

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
              <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                {t("details.eyebrow")}
              </p>
              <Heading
                id="contact-details-heading"
                size="h2"
                className="mt-3 tracking-tight glow-text-brand-soft"
              >
                {t("details.title")}
              </Heading>
              <p className="mt-4 max-w-md font-sans text-body-lg text-muted-foreground">
                {t("details.framing")}
              </p>

              <ul className="mt-8 space-y-5">
                {textDetailItems.map(({ key, Icon }) => (
                  <li key={key} className="flex gap-3">
                    <span
                      className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: brandColors.primarySoft,
                        color: brandColors.primary,
                      }}
                    >
                      <Icon className="size-5" {...coreviaIconProps} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {t(`details.items.${key}.label`)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {t(`details.items.${key}.value`)}
                      </p>
                    </div>
                  </li>
                ))}

                <li className="flex gap-3">
                  <span
                    className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: brandColors.primarySoft,
                      color: brandColors.primary,
                    }}
                  >
                    <WhatsAppIcon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {t("details.items.whatsapp.label")}
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm leading-relaxed text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {WHATSAPP_DISPLAY_NUMBER}
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span
                    className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: brandColors.primarySoft,
                      color: brandColors.primary,
                    }}
                  >
                    <InstagramIcon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {t("details.items.instagram.label")}
                    </p>
                    <a
                      href={INSTAGRAM_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm leading-relaxed text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {INSTAGRAM_HANDLE}
                    </a>
                  </div>
                </li>
              </ul>
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
