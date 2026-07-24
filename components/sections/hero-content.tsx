"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { HeroVisual } from "@/components/sections/hero-visual";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type HeroContentProps = {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  trustItems: string[];
};

/**
 * Fluid hero composition.
 * - Stacked below lg; two flexible columns from lg up.
 * - Image never leaves its grid track (no % overflow / translate bleed).
 * - Columns use minmax(0, …) so content can shrink under zoom without overlap.
 */
export function HeroContent({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  trustItems,
}: HeroContentProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "grid w-full min-w-0 grid-cols-1 items-center",
        /* 40–64px gap between text and image */
        "gap-10 md:gap-12 lg:gap-12 xl:gap-14 2xl:gap-16",
        /* Flexible tracks — both columns can shrink; image track slightly prefers space */
        "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]",
        "xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      )}
    >
      <motion.div
        className="relative z-10 flex w-full min-w-0 flex-col justify-center"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={reduceMotion ? undefined : staggerContainer}
      >
        <motion.div variants={reduceMotion ? undefined : staggerItem}>
          <p className="mb-5 inline-flex w-fit items-center rounded-md border border-border bg-background px-2.5 py-1 text-label font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {badge}
          </p>
        </motion.div>

        <motion.h1
          id="hero-heading"
          variants={reduceMotion ? undefined : staggerItem}
          className="w-full max-w-[20ch] font-sans text-hero font-semibold tracking-tight text-foreground sm:max-w-[22ch] lg:max-w-[18ch] xl:max-w-[20ch]"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={reduceMotion ? undefined : staggerItem}
          className="mt-5 w-full max-w-xl font-sans text-body-lg text-muted-foreground"
        >
          {description}
        </motion.p>

        <motion.div
          variants={reduceMotion ? undefined : staggerItem}
          className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="/book-consultation"
            className={cn(
              buttonVariants({ size: "cta" }),
              "w-full whitespace-normal text-center sm:w-auto sm:whitespace-nowrap"
            )}
          >
            {primaryCta}
          </Link>
          <Link
            href="/work"
            className={cn(
              buttonVariants({ variant: "outline", size: "cta" }),
              "w-full whitespace-normal text-center sm:w-auto sm:whitespace-nowrap"
            )}
          >
            {secondaryCta}
          </Link>
        </motion.div>

        <motion.ul
          variants={reduceMotion ? undefined : staggerItem}
          className="mt-8 grid w-full min-w-0 grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 xl:grid-cols-3"
        >
          {trustItems.map((item) => (
            <li
              key={item}
              className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground"
            >
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                <Check className="size-3.5" aria-hidden />
              </span>
              <span className="min-w-0 leading-snug">{item}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <div className="relative z-0 w-full min-w-0 self-center">
        <HeroVisual />
      </div>
    </div>
  );
}
