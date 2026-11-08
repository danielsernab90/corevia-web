import { CINEMATIC_MOBILE_MAX_WIDTH } from "@/lib/cinematic";

const DESKTOP_MIN = `(min-width: ${CINEMATIC_MOBILE_MAX_WIDTH}px)`;
const MOBILE_MAX = `(max-width: ${CINEMATIC_MOBILE_MAX_WIDTH - 1}px)`;

/**
 * Early head preload for the cinematic required by the current device class.
 * Uses media queries so only the matching orientation is requested — not locale.
 */
export function CinematicPreload() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/cinematic/en/intro-poster.jpg"
        fetchPriority="high"
        media={DESKTOP_MIN}
      />
      <link
        rel="preload"
        as="video"
        href="/cinematic/en/intro.mp4"
        type="video/mp4"
        media={DESKTOP_MIN}
      />
      <link
        rel="preload"
        as="image"
        href="/cinematic/es/intro-mobile-poster.jpg"
        fetchPriority="high"
        media={MOBILE_MAX}
      />
      <link
        rel="preload"
        as="video"
        href="/cinematic/es/intro-mobile.mp4"
        type="video/mp4"
        media={MOBILE_MAX}
      />
    </>
  );
}
