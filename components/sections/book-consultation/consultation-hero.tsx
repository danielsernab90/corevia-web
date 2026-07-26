"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { ConsultationVisual } from "@/components/sections/book-consultation/consultation-visual";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BrandCheckBadge } from "@/components/shared/brand-check-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const highlightKeys = [
  "free",
  "duration",
  "personalized",
  "noObligation",
  "assessment",
  "actionable",
] as const;

export function ConsultationHero() {
  const t = useTranslations("BookConsultation.hero");
  const { openBooking } = useBooking();

  return (
    <Section
      tone="hero"
      spacing="none"
      aria-labelledby="consultation-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[8%] right-[-12%] -z-10 h-[65%] w-[65%] max-w-[48rem] rounded-full bg-[radial-gradient(ellipse_at_center,var(--surface)_0%,transparent_70%)] opacity-90 blur-3xl"
      />

      <Container
        size="xl"
        className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-12 md:py-16 lg:py-20"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10 xl:gap-14">
          <motion.div
            className="relative z-10 flex min-w-0 flex-col"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              id="consultation-hero-heading"
              variants={staggerItem}
              className="w-full max-w-3xl font-sans text-hero font-semibold tracking-tight text-foreground glow-text-consultation-navy"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-5 w-full max-w-xl font-sans text-body-lg text-muted-foreground"
            >
              {t("description")}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mx-auto mt-8 flex w-full max-w-2xl flex-col items-stretch lg:mx-0"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="button" size="cta" onClick={openBooking}>
                  {t("primaryCta")}
                </Button>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "cta" })
                  )}
                >
                  {t("secondaryCta")}
                </Link>
              </div>

              <ul className="mt-10 grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {highlightKeys.map((key) => (
                  <li
                    key={key}
                    className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <BrandCheckBadge className="mt-0.5" />
                    <span className="min-w-0 leading-snug">
                      {t(`highlights.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <ConsultationVisual />
        </div>
      </Container>
    </Section>
  );
}
