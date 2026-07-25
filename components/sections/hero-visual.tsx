import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroVisualProps = {
  className?: string;
};

/**
 * Hero product visual — multi-device dashboard mockup.
 * Intrinsic 1536×1024; always scales within its grid track (object-contain).
 * Soft brand-blue glow reads as ambient light around the dark device plate.
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
      {/* Soft bloom behind the plate — extends past the image box without a hard edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-primary/30 blur-3xl sm:-inset-7 lg:-inset-8"
      />
      <div
        className={cn(
          "relative",
          "shadow-[0_0_40px_rgb(22_82_240/0.35),0_0_80px_rgb(22_82_240/0.15)]"
        )}
      >
        <Image
          src="/images/hero-devices.png"
          alt="Laptop, tablet, and phone showing Corevia analytics dashboards"
          width={1536}
          height={1024}
          priority
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 32rem, (max-width: 1279px) 42vw, 48vw"
          className="relative h-auto w-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}
