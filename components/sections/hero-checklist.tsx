"use client";

import { useReducedMotion } from "framer-motion";

import { BrandCheckBadge } from "@/components/shared/brand-check-badge";
import { cn } from "@/lib/utils";

export type HeroChecklistProps = {
  items: string[];
};

function ChecklistItem({ item }: { item: string }) {
  return (
    <li className="flex shrink-0 items-center gap-2.5 text-sm whitespace-nowrap text-primary-foreground">
      <BrandCheckBadge variant="inverse" className="rounded-full" />
      <span
        className="leading-snug"
        style={{
          textShadow:
            "0 0 16px rgba(255, 255, 255, 0.5), 0 0 32px rgba(255, 255, 255, 0.25)",
        }}
      >
        {item}
      </span>
    </li>
  );
}

/**
 * Full-width brand-blue checklist band — single-row infinite marquee.
 * All trust items (including neverMiss) render; the set is duplicated for
 * a seamless -50% translate loop. Pauses on hover (desktop).
 */
export function HeroChecklist({ items }: HeroChecklistProps) {
  const reduceMotion = useReducedMotion();

  // Always render every passed item — never slice/hardcode length.
  const track = items;

  if (reduceMotion) {
    return (
      <div
        className="relative z-10 w-full overflow-x-auto bg-primary"
        style={{ boxShadow: "0 0 40px rgba(22, 82, 240, 0.4)" }}
      >
        <ul className="flex w-max items-center gap-10 px-6 py-8 md:gap-12 md:px-10 md:py-10">
          {track.map((item) => (
            <ChecklistItem key={item} item={item} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className="hero-checklist-marquee relative z-10 w-full overflow-hidden bg-primary"
      style={{ boxShadow: "0 0 40px rgba(22, 82, 240, 0.4)" }}
      role="region"
      aria-label="Corevia benefits"
    >
      <div className="flex overflow-hidden py-8 md:py-10" aria-hidden="true">
        <ul
          className={cn(
            "hero-checklist-marquee-track flex w-max items-center gap-10 md:gap-12",
            "motion-safe:animate-hero-checklist-marquee"
          )}
        >
          {/* Primary set — all 6 (or N) items */}
          {track.map((item, index) => (
            <ChecklistItem key={`a-${index}-${item}`} item={item} />
          ))}
          {/* Duplicate set for seamless loop (aria-hidden — screen readers use primary) */}
          {track.map((item, index) => (
            <ChecklistItem key={`b-${index}-${item}`} item={item} />
          ))}
        </ul>
      </div>

      {/* Screen-reader accessible static list (visual list is decorative duplicate) */}
      <ul className="sr-only">
        {track.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
