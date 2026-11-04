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
  /**
   * `auto` follows theme (default).
   * `onDark` forces the white lockup (cinematic header / dark bands).
   * `onLight` forces the dark lockup.
   */
  surface?: "auto" | "onDark" | "onLight";
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

function BrandLockup({
  priority = false,
  surface = "auto",
}: {
  priority?: boolean;
  surface?: LogoProps["surface"];
}) {
  const lightImg = (
    <Image
      src="/logos/corevia-nav-logo-light.png"
      alt=""
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "h-full w-auto object-contain",
        surface === "auto" && "dark:hidden",
        surface === "onDark" && "hidden"
      )}
    />
  );

  const darkImg = (
    <Image
      src="/logos/corevia-nav-logo-dark.png"
      alt=""
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "h-full w-auto object-contain",
        surface === "auto" && "hidden dark:block",
        surface === "onLight" && "hidden"
      )}
    />
  );

  return (
    <span
      className="relative inline-flex shrink-0 items-center"
      style={{ height: LOGO_HEIGHT, width: LOGO_WIDTH }}
    >
      {lightImg}
      {darkImg}
    </span>
  );
}

export function Logo({
  label,
  href = "/",
  showMark = true,
  priority = false,
  surface = "auto",
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
        <BrandLockup priority={priority} surface={surface} />
      ) : (
        <span className="font-sans text-sm font-semibold tracking-[0.18em] text-foreground uppercase">
          {label}
        </span>
      )}
    </Link>
  );
}
