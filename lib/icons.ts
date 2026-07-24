import type { LucideProps } from "lucide-react";

import { iconDefaults } from "@/lib/design-tokens";

/**
 * Shared Lucide props for Corevia UI.
 * Prefer outlined icons; avoid filled variants unless required for status.
 */
export const coreviaIconProps: Pick<
  LucideProps,
  "strokeWidth" | "absoluteStrokeWidth"
> = {
  strokeWidth: iconDefaults.strokeWidth,
  absoluteStrokeWidth: iconDefaults.absoluteStrokeWidth,
};
