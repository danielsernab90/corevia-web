"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button, buttonVariants } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/routing";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function CompanyHero() {
  const t = useTranslations("Company.hero");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);
  const { openBooking } = useBooking();

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="company-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />

      <Container
        size="xl"
        className="relative flex min-h-[min(70dvh,36rem)] flex-col justify-center py-14 md:py-16 lg:py-20"
      >
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            id="company-hero-heading"
            variants={staggerItem}
            className="w-full font-sans text-hero font-semibold tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="mt-5 w-full max-w-2xl font-sans text-body-lg text-secondary-foreground/75"
          >
            {t("description")}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <Button
              type="button"
              size="cta"
              className="w-full whitespace-normal text-center sm:w-auto sm:whitespace-nowrap"
              onClick={openBooking}
            >
              {t("primaryCta")}
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "w-full whitespace-normal text-center sm:w-auto sm:whitespace-nowrap"
              )}
            >
              <WhatsAppIcon className="size-5" />
              {t("whatsappCta")}
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
