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
          as="video"
          href="/cinematic/es/intro-mobile.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="image"
          href="/cinematic/es/intro-mobile-poster.jpg"
        />
      </>
    );
  }

  if (locale === "en") {
    return (
      <>
        <link
          rel="preload"
          as="video"
          href="/cinematic/en/intro.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="image"
          href="/cinematic/en/intro-poster.jpg"
        />
      </>
    );
  }

  return null;
}
