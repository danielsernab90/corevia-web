import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Navbar/footer lockup footprint.
 * Base was 32×96 (mark-height match); bumped ~15% for stronger presence
 * while still fitting the h-16 header comfortably.
 */
const LOGO_HEIGHT = Math.round(32 * 1.15); // 37
const LOGO_WIDTH = Math.round((1024 / 341) * LOGO_HEIGHT); // 111

type LogoProps = {
  label: string;
  href?: "/";
  /** Full 3D lockup image. When false, renders text-only. */
  showMark?: boolean;
  /** Prefer true only for the primary header instance (LCP). */
  priority?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

function BrandLockup({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center"
      style={{ height: LOGO_HEIGHT, width: LOGO_WIDTH }}
    >
      {/* Light mode: black "CORE" */}
      <Image
        src="/logos/corevia-nav-logo-light.png"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className="h-full w-auto object-contain dark:hidden"
      />
      {/* Dark mode: white "CORE" — CSS swap follows next-themes `class` strategy */}
      <Image
        src="/logos/corevia-nav-logo-dark.png"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className="hidden h-full w-auto object-contain dark:block"
      />
    </span>
  );
}

export function Logo({
  label,
  href = "/",
  showMark = true,
  priority = false,
  className,
  ...props
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      {showMark ? (
        <BrandLockup priority={priority} />
      ) : (
        <span className="font-sans text-sm font-semibold tracking-[0.18em] text-foreground uppercase">
          {label}
        </span>
      )}
    </Link>
  );
}
