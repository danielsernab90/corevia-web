import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

const textVariants = cva("font-sans", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body",
      caption: "text-caption",
      label: "text-label font-semibold tracking-[0.06em] uppercase",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      inverse: "text-background",
      primary: "text-primary",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
    weight: "normal",
  },
});

type TextProps<T extends ElementType = "p"> = {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof textVariants>;

export function Text<T extends ElementType = "p">({
  as,
  className,
  size,
  tone,
  weight,
  ...props
}: TextProps<T>) {
  const Comp = as ?? (size === "label" ? "span" : "p");

  return (
    <Comp
      data-slot="text"
      className={cn(textVariants({ size, tone, weight }), className)}
      {...props}
    />
  );
}

export { textVariants };
