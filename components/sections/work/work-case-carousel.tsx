"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { coreviaIconProps } from "@/lib/icons";
import { motionEasing } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WorkCaseCarouselProps = {
  images: readonly string[];
  alts: readonly string[];
  className?: string;
  priority?: boolean;
};

export function WorkCaseCarousel({
  images,
  alts,
  className,
  priority = false,
}: WorkCaseCarouselProps) {
  const t = useTranslations("Work.cases.carousel");
  const [index, setIndex] = useState(0);
  const total = images.length;
  const current = ((index % total) + total) % total;

  function go(delta: number) {
    setIndex((prev) => prev + delta);
  }

  return (
    <div className={cn("group relative", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[1672/941] w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={images[current]}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: motionEasing }}
            >
              <Image
                src={images[current]}
                alt={alts[current] ?? alts[0]}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1023px) 100vw, 50vw"
                priority={priority && current === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        aria-label={t("previous")}
        onClick={() => go(-1)}
        className={cn(
          "absolute top-1/2 left-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur-sm",
          "opacity-70 transition-opacity hover:opacity-100 hover:bg-background focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        )}
      >
        <ChevronLeft {...coreviaIconProps} className="size-5" aria-hidden />
      </button>

      <button
        type="button"
        aria-label={t("next")}
        onClick={() => go(1)}
        className={cn(
          "absolute top-1/2 right-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur-sm",
          "opacity-70 transition-opacity hover:opacity-100 hover:bg-background focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        )}
      >
        <ChevronRight {...coreviaIconProps} className="size-5" aria-hidden />
      </button>
    </div>
  );
}
