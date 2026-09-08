"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import type { AppLocale } from "@/i18n/routing";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PRINCIPLE_KEYS = ["understand", "build", "grow"] as const;

const BUILT_AROUND_VISUAL: Record<AppLocale, string> = {
  en: "/images/home/built-around-business-en-transparent.png",
  es: "/images/home/built-around-business-es-transparent.png",
};

/** Intrinsic size of the approved workflow visuals (do not crop/distort). */
const VISUAL_WIDTH = 1024;
const VISUAL_HEIGHT = 866;

/**
 * Homepage philosophy section — HTML copy beside the approved graphic,
 * then Understand / Build / Grow principles.
 */
export function BuiltAroundBusiness() {
  const t = useTranslations("Home.builtAround");
  const locale = useLocale() as AppLocale;
  const reduceMotion = useReducedMotion();
  const visualSrc = BUILT_AROUND_VISUAL[locale] ?? BUILT_AROUND_VISUAL.en;

  return (
    <Section
      tone="white"
      spacing="lg"
      aria-labelledby="built-around-heading"
      className="border-t border-border/60"
    >
      <Container size="lg">
        <motion.div
          className="grid items-start gap-10 md:gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reduceMotion ? undefined : staggerContainer}
        >
          <div className="min-w-0">
            <motion.p
              variants={reduceMotion ? undefined : staggerItem}
              className="text-label font-semibold tracking-[0.14em] text-primary uppercase"
            >
              {t("eyebrow")}
            </motion.p>

            <motion.div variants={reduceMotion ? undefined : staggerItem}>
              <Heading
                id="built-around-heading"
                size="h2"
                className="mt-5 max-w-[18ch] tracking-tight text-balance sm:max-w-[22ch]"
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
          </div>

          <motion.div
            variants={reduceMotion ? undefined : staggerItem}
            className="w-full min-w-0 bg-transparent"
          >
            <Image
              src={visualSrc}
              alt={t("imageAlt")}
              width={VISUAL_WIDTH}
              height={VISUAL_HEIGHT}
              className="h-auto w-full max-w-full bg-transparent object-contain"
              sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 46vw, min(36rem, 46vw)"
              priority={false}
            />
          </motion.div>
        </motion.div>

        <motion.ol
          className={cn(
            "mt-10 grid list-none grid-cols-1 gap-0 sm:mt-12",
            "md:mt-14 md:grid-cols-3 md:gap-0 lg:mt-16"
          )}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={
            reduceMotion
              ? undefined
              : {
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.12,
                      delayChildren: 0.08,
                    },
                  },
                }
          }
        >
          {PRINCIPLE_KEYS.map((key, index) => (
            <motion.li
              key={key}
              variants={reduceMotion ? undefined : fadeUp}
              className={cn(
                "group relative min-w-0 py-8",
                "border-t border-border md:border-t-0 md:py-0 md:pl-8 md:pr-8",
                index === 0 && "border-t-0 pt-0 md:pl-0",
                index === PRINCIPLE_KEYS.length - 1 && "md:pr-0",
                index > 0 && "md:border-l md:border-border"
              )}
            >
              <div className="transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5">
                <p className="flex items-baseline gap-2.5">
                  <span className="font-sans text-sm font-semibold tracking-[0.16em] text-primary tabular-nums">
                    {t(`principles.${key}.number`)}
                  </span>
                  <span
                    aria-hidden
                    className="text-sm font-normal text-border"
                  >
                    —
                  </span>
                  <span className="font-sans text-lg font-semibold tracking-tight text-foreground">
                    {t(`principles.${key}.title`)}
                  </span>
                </p>
                <p className="mt-4 max-w-sm font-sans text-body leading-relaxed text-muted-foreground md:max-w-none">
                  {t(`principles.${key}.description`)}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </Section>
  );
}
