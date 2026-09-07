"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { StartProjectCta } from "@/components/shared/start-project-cta";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEP_KEYS = ["tell", "design", "build", "launch"] as const;

/**
 * Homepage process section — four editorial steps + shared project CTA.
 */
export function HowWeWork() {
  const t = useTranslations("Home.howWeWork");
  const reduceMotion = useReducedMotion();

  return (
    <Section
      tone="surface"
      spacing="lg"
      aria-labelledby="how-we-work-heading"
      className="border-t border-border/60"
    >
      <Container size="lg">
        <motion.div
          className="max-w-2xl"
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
              id="how-we-work-heading"
              size="h2"
              className="mt-5 max-w-[18ch] tracking-tight text-balance sm:max-w-[22ch]"
            >
              {t("title")}
            </Heading>
          </motion.div>

          {t("description") ? (
            <motion.p
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-6 max-w-md font-sans text-body-lg leading-relaxed text-muted-foreground"
            >
              {t("description")}
            </motion.p>
          ) : null}
        </motion.div>

        <motion.ol
          className={cn(
            "mt-12 grid list-none grid-cols-1 gap-0 sm:mt-14",
            "md:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          )}
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
                      staggerChildren: 0.1,
                      delayChildren: 0.06,
                    },
                  },
                }
          }
        >
          {STEP_KEYS.map((key, index) => (
            <motion.li
              key={key}
              variants={reduceMotion ? undefined : fadeUp}
              className={cn(
                "group relative min-w-0 py-8",
                "border-t border-border md:border-t-0 md:px-6 md:py-0 lg:px-7",
                index === 0 && "border-t-0 pt-0 md:pl-0",
                index === STEP_KEYS.length - 1 && "md:pr-0",
                index > 0 && "md:border-l md:border-border",
                // On 2-col tablet, top border for second row items
                index >= 2 && "md:border-t md:border-border md:pt-8 lg:border-t-0 lg:pt-0"
              )}
            >
              <div className="transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5">
                <p className="flex items-baseline gap-2.5">
                  <span className="font-sans text-sm font-semibold tracking-[0.16em] text-primary tabular-nums">
                    {t(`steps.${key}.number`)}
                  </span>
                  <span aria-hidden className="text-sm font-normal text-border">
                    —
                  </span>
                </p>
                <h3 className="mt-4 font-sans text-base font-semibold tracking-tight text-foreground uppercase sm:text-lg sm:tracking-[0.04em]">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-3 max-w-sm font-sans text-body leading-relaxed text-muted-foreground md:max-w-none">
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div
          className="mt-10 sm:mt-12 lg:mt-14"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <StartProjectCta placement="how-we-work" />
        </motion.div>
      </Container>
    </Section>
  );
}
