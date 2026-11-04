"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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

const HERO_LOGO_WIDTH = 220;
const HERO_LOGO_HEIGHT = 73;

export function AboutHero() {
  const t = useTranslations("About.hero");
  const tCommon = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);
  const { openBooking } = useBooking();
  const reduceMotion = useReducedMotion();

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />

      <Container
        size="xl"
        className="relative flex min-h-[min(64dvh,34rem)] flex-col justify-center py-14 md:py-16 lg:py-20"
      >
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <Image
              src="/logos/corevia-logo-3d-white.png"
              alt={tCommon("brand")}
              width={HERO_LOGO_WIDTH}
              height={HERO_LOGO_HEIGHT}
              priority
              className="h-auto w-[min(11.5rem,55vw)] object-contain sm:w-[13.75rem]"
            />
          </motion.div>
          <motion.p
            variants={staggerItem}
            className="mt-6 text-caption font-semibold tracking-[0.16em] text-primary uppercase"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            id="about-hero-heading"
            variants={staggerItem}
            className="mt-4 w-full font-display text-hero tracking-tight glow-text-white-soft"
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
              {tCommon("startProject")}
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "w-full border-white/25 bg-transparent text-secondary-foreground whitespace-normal text-center hover:bg-white/10 hover:text-secondary-foreground sm:w-auto sm:whitespace-nowrap"
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
