"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { ConsultationVisual } from "@/components/sections/book-consultation/consultation-visual";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const highlightKeys = [
  "free",
  "duration",
  "noObligation",
  "personalized",
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
              className="w-full max-w-3xl font-sans text-hero font-semibold tracking-tight text-foreground"
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
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
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
            </motion.div>

            <motion.ul
              variants={staggerItem}
              className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {highlightKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span>{t(`highlights.${key}`)}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <ConsultationVisual />
        </div>
      </Container>
    </Section>
  );
}
