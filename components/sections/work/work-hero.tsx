"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function WorkHero() {
  const t = useTranslations("Work.hero");
  const reduceMotion = useReducedMotion();

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="work-hero-heading"
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
        className="relative flex min-h-[min(70dvh,36rem)] flex-col justify-center py-16 md:py-20"
      >
        <motion.div
          className="relative z-10 max-w-4xl"
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={staggerItem}
            className="text-caption font-semibold tracking-[0.16em] text-primary uppercase"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            id="work-hero-heading"
            variants={staggerItem}
            className="mt-5 font-display text-hero tracking-tight text-secondary-foreground glow-text-white-soft"
          >
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
              br: () => <br />,
            })}
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="mt-6 max-w-xl font-sans text-body-lg text-[#b3c7d5]"
          >
            {t("description")}
          </motion.p>
          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#projects"
              className={cn(buttonVariants({ size: "cta" }), "w-full sm:w-auto")}
            >
              {t("primaryCta")}
            </a>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "w-full border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground sm:w-auto"
              )}
            >
              {t("secondaryCta")}
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
