import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Matches prior nav/footer mark footprint (`size-8` = 32px). */
const MARK_SIZE = 32;

type LogoProps = {
  label: string;
  href?: "/";
  /** Brand mark image + wordmark. */
  showMark?: boolean;
  /** Prefer true only for the primary header instance (LCP). */
  priority?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/corevia-logo.png"
      alt=""
      width={MARK_SIZE}
      height={MARK_SIZE}
      priority={priority}
      className={cn("size-8 shrink-0 object-contain", className)}
    />
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
        "inline-flex items-center gap-2.5 rounded-md text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      {showMark ? <BrandMark priority={priority} /> : null}
      <span className="font-sans text-sm font-semibold tracking-[0.18em] text-foreground uppercase">
        {label}
      </span>
    </Link>
  );
}
