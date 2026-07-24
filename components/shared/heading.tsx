import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-sans text-foreground", {
  variants: {
    size: {
      hero: "text-hero",
      display: "text-display",
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "h2",
    weight: "semibold",
    align: "left",
  },
});

const sizeToTag = {
  hero: "h1",
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
} as const;

type HeadingProps<T extends ElementType = "h2"> = {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof headingVariants>;

export function Heading<T extends ElementType = "h2">({
  as,
  className,
  size = "h2",
  weight,
  align,
  ...props
}: HeadingProps<T>) {
  const Comp = as ?? sizeToTag[size ?? "h2"];

  return (
    <Comp
      data-slot="heading"
      className={cn(headingVariants({ size, weight, align }), className)}
      {...props}
    />
  );
}

export { headingVariants };
