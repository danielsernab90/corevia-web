"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { StartProjectCta } from "@/components/shared/start-project-cta";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CAPABILITY_KEYS = [
  "customSoftware",
  "aiAutomation",
  "digitalPlatforms",
  "dataDashboards",
  "growthDigital",
] as const;

/**
 * Homepage capabilities overview — editorial numbered list.
 * Sits after Featured Work. Typography-led; no decorative imagery.
 */
export function WhatWeCanBuild() {
  const t = useTranslations("Home.whatWeCanBuild");
  const reduceMotion = useReducedMotion();

  return (
    <Section
      tone="white"
      spacing="lg"
      aria-labelledby="what-we-can-build-heading"
      className="border-t border-border/60"
    >
      <Container size="lg">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <motion.div
            className="min-w-0 lg:col-span-5"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reduceMotion ? undefined : staggerContainer}
          >
            <motion.p
              variants={reduceMotion ? undefined : staggerItem}
              className="text-label font-semibold tracking-[0.14em] text-primary uppercase"
            >
              {t("eyebrow")}
            </motion.p>

            <motion.div variants={reduceMotion ? undefined : staggerItem}>
              <Heading
                id="what-we-can-build-heading"
                size="h2"
                className="mt-5 max-w-[14ch] tracking-tight text-balance sm:max-w-[16ch]"
              >
                {t("title")}
              </Heading>
            </motion.div>

            <motion.p
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-6 max-w-md font-sans text-body-lg leading-relaxed text-muted-foreground"
            >
              {t("description")}
            </motion.p>
          </motion.div>

          <motion.ol
            className="min-w-0 list-none lg:col-span-7"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.06,
                      },
                    },
                  }
            }
          >
            {CAPABILITY_KEYS.map((key) => (
              <motion.li
                key={key}
                variants={reduceMotion ? undefined : fadeUp}
                className={cn(
                  "group border-t border-border/80 py-6 first:border-t-0 first:pt-0 last:pb-0",
                  "md:py-7 md:first:pt-0"
                )}
              >
                <div
                  className={cn(
                    "grid gap-3 transition-[transform,opacity] duration-300 ease-out sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-5",
                    "motion-safe:group-hover:-translate-y-px"
                  )}
                >
                  <span className="font-sans text-sm font-semibold tracking-[0.16em] text-primary tabular-nums sm:pt-1">
                    {t(`capabilities.${key}.number`)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-sans text-base font-semibold tracking-[0.08em] text-foreground uppercase sm:text-lg sm:tracking-[0.1em]">
                      {t(`capabilities.${key}.title`)}
                    </h3>
                    <p className="mt-2.5 max-w-xl font-sans text-body leading-relaxed text-muted-foreground">
                      {t(`capabilities.${key}.description`)}
                    </p>
                    <span
                      aria-hidden
                      className="mt-4 block h-px w-0 bg-primary/70 transition-[width] duration-300 ease-out motion-safe:group-hover:w-12"
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        <motion.div
          className="mt-12 border-t border-border/60 pt-10 sm:mt-14 sm:pt-12"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <StartProjectCta placement="what-we-can-build" />
        </motion.div>
      </Container>
    </Section>
  );
}
