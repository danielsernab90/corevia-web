import type { SVGProps } from "react";

import { coreviaIconProps } from "@/lib/icons";

/**
 * WhatsApp brand mark sized to match Lucide icons (size-5 / 24 viewBox).
 * Uses currentColor so it inherits the same badge tint as MapPin / MessageSquare / Clock3.
 */
export function WhatsAppIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  const strokeWidth = coreviaIconProps.strokeWidth ?? 2;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Chat outline — stroke weight aligned with Lucide defaults */}
      <path
        d="M12 21.5c-1.55 0-3.03-.34-4.35-.95L3.5 21.5l1.05-3.9A9.45 9.45 0 0 1 2.5 12C2.5 6.75 6.75 2.5 12 2.5S21.5 6.75 21.5 12 17.25 21.5 12 21.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Phone handset — brand cue inside the bubble */}
      <path
        d="M9.2 8.85c.2-.45.42-.47.62-.47h.52c.17 0 .4.06.5.4l.72 1.72c.1.24.04.5-.14.66l-.4.38c-.14.13-.2.32-.12.5.38.85 1.15 1.62 2.02 2.05.18.09.4.04.54-.1l.5-.5c.18-.18.44-.23.67-.13l1.7.72c.34.14.4.37.4.54v.5c0 .2-.02.42-.48.62-.42.18-1.1.4-1.88.22-1.95-.44-3.95-2.28-4.7-4.35-.3-.82-.18-1.5.03-1.96Z"
        fill="currentColor"
      />
    </svg>
  );
}
