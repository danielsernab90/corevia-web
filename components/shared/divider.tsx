import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const dividerVariants = cva("shrink-0 border-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full border-t",
      vertical: "h-full w-px border-l",
    },
    tone: {
      default: "border-border",
      muted: "border-muted-foreground/20",
      strong: "border-foreground/20",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    tone: "default",
  },
});

type DividerProps = ComponentPropsWithoutRef<"hr"> &
  VariantProps<typeof dividerVariants> & {
    decorative?: boolean;
  };

export function Divider({
  className,
  orientation = "horizontal",
  tone,
  decorative = true,
  ...props
}: DividerProps) {
  return (
    <hr
      data-slot="divider"
      aria-orientation={orientation ?? "horizontal"}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? "presentation" : "separator"}
      className={cn(dividerVariants({ orientation, tone }), className)}
      {...props}
    />
  );
}

export { dividerVariants };
