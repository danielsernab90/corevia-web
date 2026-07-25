import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

/**
 * Section surface variants map to Corevia brand backgrounds.
 * Prefer these over one-off background classes.
 */
const sectionVariants = cva("relative w-full", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-section-sm",
      md: "py-section",
      /** ~20% tighter than md — used on book-consultation page */
      tight: "py-section-tight",
      lg: "py-section-lg",
    },
    tone: {
      default: "bg-transparent",
      white: "bg-background text-foreground",
      surface: "bg-surface text-foreground",
      muted: "bg-muted text-foreground",
      gradient: "bg-gradient-surface text-foreground",
      dark: "bg-secondary text-secondary-foreground",
      accent: "bg-primary text-primary-foreground",
      hero: "bg-background text-foreground",
    },
  },
  defaultVariants: {
    spacing: "md",
    tone: "default",
  },
});

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof sectionVariants>;

export function Section<T extends ElementType = "section">({
  as,
  className,
  spacing,
  tone,
  ...props
}: SectionProps<T>) {
  const Comp = as ?? "section";

  return (
    <Comp
      data-slot="section"
      data-tone={tone ?? "default"}
      className={cn(sectionVariants({ spacing, tone }), className)}
      {...props}
    />
  );
}

export { sectionVariants };
