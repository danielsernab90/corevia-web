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
  en: "/images/home/built-around-business-en.png",
  es: "/images/home/built-around-business-es.png",
};

/** Intrinsic size of the approved workflow visuals (do not crop/distort). */
const VISUAL_WIDTH = 1024;
const VISUAL_HEIGHT = 576;

/**
 * Homepage philosophy section — editorial copy + localized visual + principles.
 * Sits directly below the hero value strip. Does not alter Hero.
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
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
          <motion.div
            className="min-w-0 lg:col-span-5"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
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
                id="built-around-heading"
                size="h2"
                className="mt-5 max-w-[18ch] tracking-tight text-balance sm:max-w-[22ch]"
              >
                {t("title")}
              </Heading>
            </motion.div>

            <motion.p
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-6 max-w-2xl font-sans text-body-lg leading-relaxed text-muted-foreground lg:max-w-none"
            >
              {t("description")}
            </motion.p>
          </motion.div>

          <motion.div
            className="min-w-0 lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }
            }
          >
            <Image
              src={visualSrc}
              alt={t("imageAlt")}
              width={VISUAL_WIDTH}
              height={VISUAL_HEIGHT}
              className="h-auto w-full max-w-full object-contain"
              sizes="(max-width: 1023px) 100vw, min(60vw, 720px)"
              priority={false}
            />
          </motion.div>
        </div>

        <motion.ol
          className={cn(
            "mt-12 grid list-none grid-cols-1 gap-0 md:mt-16",
            "md:grid-cols-3 md:gap-0 lg:mt-20"
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
