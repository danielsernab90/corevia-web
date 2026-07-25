"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/motion";

export function ServicesHero() {
  const t = useTranslations("Services.hero");

  const scrollToInquiry = () => {
    document
      .getElementById("services-inquiry")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section
      tone="hero"
      spacing="none"
      aria-labelledby="services-hero-heading"
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
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            id="services-hero-heading"
            variants={staggerItem}
            className="w-full font-sans text-hero font-semibold tracking-tight text-foreground glow-text-brand-soft"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-5 w-full max-w-2xl font-sans text-body-lg text-muted-foreground"
          >
            {t("description")}
          </motion.p>

          <motion.p
            variants={staggerItem}
            className="mt-4 w-full max-w-xl font-sans text-sm leading-relaxed text-muted-foreground"
          >
            {t("pricingNote")}
          </motion.p>

          <motion.div variants={staggerItem} className="mt-8">
            <Button type="button" size="cta" onClick={scrollToInquiry}>
              {t("primaryCta")}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
