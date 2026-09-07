import type { AppLocale } from "@/i18n/routing";

/**
 * Early head preload for the cinematic required by this locale.
 * Uses CSS media so phones do not fetch desktop assets (and vice versa).
 */
export function CinematicPreload({ locale }: { locale: AppLocale }) {
  if (locale === "es") {
    return (
      <>
        <link
          rel="preload"
          as="video"
          href="/cinematic/es/intro-mobile.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          href="/cinematic/es/intro-mobile-poster.jpg"
          media="(max-width: 767px)"
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
