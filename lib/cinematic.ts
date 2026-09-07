import type { AppLocale } from "@/i18n/routing";

/**
 * Homepage cinematic intro — timing and asset paths.
 * Adjust these constants without touching the overlay component.
 */

/** Seconds of muted autoplay before scroll scrub begins. */
export const CINEMATIC_AUTOPLAY_END = 5.0;

/** Nominal total intro duration (matches exported MP4; runtime uses real duration when available). */
export const CINEMATIC_END = 10.0;

/**
 * Opacity fade length at the end of the scroll range (~0.4s ≈ 10 frames @ 24fps).
 * Fade runs over the final [end - FADE, end] of currentTime.
 */
export const CINEMATIC_FADE_DURATION = 0.4;

/**
 * Scroll sensitivity: how many seconds of video progress per 100px of scroll delta.
 * Higher = reaches the end with less scrolling.
 */
export const CINEMATIC_SCROLL_SECONDS_PER_100PX = 0.55;

const INTRO_BY_LOCALE: Partial<Record<AppLocale, string>> = {
  en: "/cinematic/en/intro.mp4",
  // Spanish cinematic asset lands later at /cinematic/es/intro.mp4
};

/** Whether this locale has a cinematic intro asset ready. */
export function hasCinematicIntro(locale: AppLocale): boolean {
  return Boolean(INTRO_BY_LOCALE[locale]);
}

/** Locale-aware cinematic intro video URL, or null when unavailable. */
export function getCinematicIntroSrc(locale: AppLocale): string | null {
  return INTRO_BY_LOCALE[locale] ?? null;
}

/** Clamp helper for scrubbing within [min, max]. */
export function clampCinematicTime(
  time: number,
  min = 0,
  max = CINEMATIC_END
): number {
  return Math.min(max, Math.max(min, time));
}
