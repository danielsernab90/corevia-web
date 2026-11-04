"use client";

import { useLocale, useTranslations } from "next-intl";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { ContactDetails } from "@/components/sections/contact/contact-details";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

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
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,#13334a_0%,transparent_40%),linear-gradient(145deg,#07121e,#10283b)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_55%)]"
        />

        <Container
          size="xl"
          className="relative flex min-h-[min(58dvh,30rem)] flex-col justify-center py-16 md:py-20"
        >
          <SectionReveal className="max-w-3xl">
            <p className="text-caption font-semibold tracking-[0.16em] text-primary uppercase">
              {t("hero.eyebrow")}
            </p>
            <Heading
              id="contact-hero-heading"
              size="hero"
              className="mt-5 font-display tracking-tight glow-text-white-soft"
              style={{ color: "var(--secondary-foreground)" }}
            >
              {t("hero.title")}
            </Heading>
            <p className="mt-5 max-w-xl font-sans text-body-lg text-[#b3c7d5]">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/book-consultation"
                className={cn(
                  buttonVariants({ size: "cta" }),
                  "w-full sm:w-auto"
                )}
              >
                {t("hero.consultationCta")}
              </Link>
              <a
                href="#contact-form"
                className={cn(
                  buttonVariants({ variant: "outline", size: "cta" }),
                  "w-full border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground sm:w-auto"
                )}
              >
                {t("hero.formCta")}
              </a>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-[#8ea8b9] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              {t("hero.whatsappCta")}
            </a>
          </SectionReveal>
        </Container>
      </Section>

      <Section
        tone="white"
        spacing="md"
        aria-labelledby="contact-details-heading"
      >
        <Container size="xl">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <SectionReveal className="min-w-0">
              <ContactDetails headingId="contact-details-heading" />
              <div className="mt-8 rounded-[14px] border border-border bg-muted/40 p-5">
                <p className="font-display text-h3 tracking-tight text-foreground">
                  {t("trust.title")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("trust.body")}
                </p>
                <Link
                  href="/work"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-4 inline-flex"
                  )}
                >
                  {t("trust.cta")}
                </Link>
              </div>
            </SectionReveal>

            <FadeUp
              id="contact-form"
              className="min-w-0 scroll-mt-28 rounded-[18px] border border-border bg-card p-5 shadow-[0_12px_40px_rgb(15_23_42/0.04)] md:p-6"
            >
              <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                {t("form.eyebrow")}
              </p>
              <h2 className="mt-2 font-display text-h2 tracking-tight text-foreground">
                {t("form.title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("form.description")}
              </p>
              <div className="mt-6">
                <ConsultationFormFlow
                  idPrefix="contact-"
                  variant="inline"
                  inquirySource="contact-page"
                />
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>
    </main>
  );
}
