import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroVisualProps = {
  className?: string;
};

/**
 * Hero product visual — multi-device dashboard mockup.
 * Intrinsic 1536×1024; always scales within its grid track (object-contain).
 * Never overflows into the text column — no percentage widths >100% or translate bleed.
 */
export function HeroVisual({ className }: HeroVisualProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full min-w-0 max-w-md md:max-w-lg",
        "lg:mx-0 lg:max-w-none lg:w-full lg:justify-self-stretch",
        className
      )}
    >
      <Image
        src="/images/hero-devices.png"
        alt="Laptop, tablet, and phone showing Corevia analytics dashboards"
        width={1536}
        height={1024}
        priority
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 32rem, (max-width: 1279px) 42vw, 48vw"
        className="h-auto w-full max-w-full object-contain"
      />
    </div>
  );
}
