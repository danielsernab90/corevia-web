import { Check, type LucideProps } from "lucide-react";

import { brandColors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type BrandCheckBadgeProps = {
  className?: string;
  iconClassName?: string;
  strokeWidth?: LucideProps["strokeWidth"];
  variant?: "default" | "inverse";
};

/**
 * Shared checkmark badge — light brand-blue tint (#E6F1FB) + solid #1652F0 check.
 * Colors use inline styles so they cannot regress to success/green utilities.
 */
export function BrandCheckBadge({
  className,
  iconClassName,
  strokeWidth,
  variant = "default",
}: BrandCheckBadgeProps) {
  const inverse = variant === "inverse";

  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-md",
        className
      )}
      style={{
        backgroundColor: inverse ? brandColors.background : brandColors.primarySoft,
        color: brandColors.primary,
      }}
    >
      <Check
        className={cn("size-3.5", iconClassName)}
        stroke={brandColors.primary}
        strokeWidth={strokeWidth}
        aria-hidden
      />
    </span>
  );
}
