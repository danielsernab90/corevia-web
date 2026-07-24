import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
    padded: {
      true: "px-gutter md:px-gutter-lg",
      false: "",
    },
  },
  defaultVariants: {
    size: "lg",
    padded: true,
  },
});

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof containerVariants>;

export function Container<T extends ElementType = "div">({
  as,
  className,
  size,
  padded,
  ...props
}: ContainerProps<T>) {
  const Comp = as ?? "div";

  return (
    <Comp
      data-slot="container"
      className={cn(containerVariants({ size, padded }), className)}
      {...props}
    />
  );
}

export { containerVariants };
