"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { BrandCheckBadge } from "@/components/shared/brand-check-badge";
import { staggerContainer, staggerItem } from "@/lib/motion";

export type HeroChecklistProps = {
  items: string[];
};

/**
 * Full-width brand-blue band beneath the hero.
 * Edge-to-edge #1652F0 surface, single row on large screens.
 */
export function HeroChecklist({ items }: HeroChecklistProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative z-10 w-full overflow-visible bg-primary"
      style={{
        boxShadow: "0 0 40px rgba(22, 82, 240, 0.4)",
      }}
    >
      <Container size="xl" className="overflow-visible py-8 md:py-10">
        <motion.ul
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reduceMotion ? undefined : staggerContainer}
          className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {items.map((item) => (
            <motion.li
              key={item}
              variants={reduceMotion ? undefined : staggerItem}
              className="flex min-w-0 items-center gap-2.5 text-sm text-primary-foreground"
            >
              <BrandCheckBadge variant="inverse" className="rounded-full" />
              <span
                className="min-w-0 leading-snug"
                style={{
                  textShadow:
                    "0 0 16px rgba(255, 255, 255, 0.5), 0 0 32px rgba(255, 255, 255, 0.25)",
                }}
              >
                {item}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </div>
  );
}
