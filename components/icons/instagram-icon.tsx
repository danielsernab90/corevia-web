"use client";

import { useId, type SVGProps } from "react";

/**
 * Instagram mark as a Lucide-compatible outlined icon (24 viewBox, stroke)
 * with the official Instagram brand gradient (#833AB4 → #E1306C → #F77737).
 */
export function InstagramIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  const rawId = useId();
  const gradientId = `instagram-brand-gradient-${rawId.replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="22"
          x2="22"
          y2="2"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="100%" stopColor="#F77737" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill={`url(#${gradientId})`}
        stroke="none"
      />
    </svg>
  );
}
