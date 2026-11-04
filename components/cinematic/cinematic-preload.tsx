import type { AppLocale } from "@/i18n/routing";

/**
 * Early head preload for the cinematic required by this locale.
 * Loads only the active locale's asset(s).
 */
export function CinematicPreload({ locale }: { locale: AppLocale }) {
  if (locale === "es") {
    // Spanish currently ships one portrait asset used for all viewports
    // (desktop/tablet fall back to it until a landscape intro exists).
    return (
      <>
        <link
          rel="preload"
          as="image"
          href="/cinematic/es/intro-mobile-poster.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="video"
          href="/cinematic/es/intro-mobile.mp4"
          type="video/mp4"
        />
      </>
    );
  }

  if (locale === "en") {
    // Poster first for LCP; video preload kept for desktop/tablet where the
    // landscape intro is the intended experience. Phones still fall back to
    // this asset until a dedicated mobile clip ships — do not remove it.
    return (
      <>
        <link
          rel="preload"
          as="image"
          href="/cinematic/en/intro-poster.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="video"
          href="/cinematic/en/intro.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
      </>
    );
  }

  return null;
}
