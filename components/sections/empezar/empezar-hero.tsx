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

export function EmpezarHero() {
  const t = useTranslations("Empezar.hero");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale, { intent: "card" });
  const { openBooking } = useBooking();

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="empezar-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />

      <Container
        size="xl"
        className="relative flex min-h-[min(72dvh,38rem)] flex-col justify-center py-16 md:py-20 lg:py-24"
      >
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            id="empezar-hero-heading"
            variants={staggerItem}
            className="w-full font-sans text-hero font-semibold tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-5 w-full max-w-2xl font-sans text-body-lg text-secondary-foreground/85"
          >
            {t("subtitle")}
          </motion.p>

          <motion.p
            variants={staggerItem}
            className="mt-4 w-full max-w-xl font-sans text-body text-secondary-foreground/65"
          >
            {t("description")}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
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
                "w-full whitespace-normal border-secondary-foreground/25 bg-secondary-foreground/5 text-center text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground sm:w-auto sm:whitespace-nowrap"
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
