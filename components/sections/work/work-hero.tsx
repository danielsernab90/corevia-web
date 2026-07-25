"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { staggerContainer, staggerItem } from "@/lib/motion";

export function WorkHero() {
  const t = useTranslations("Work.hero");

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="work-hero-heading"
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
            id="work-hero-heading"
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
        </motion.div>
      </Container>
    </Section>
  );
}
