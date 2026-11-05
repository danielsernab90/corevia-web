import type { AppLocale } from "@/i18n/routing";

/**
 * Homepage cinematic intro — timing, viewport breakpoints, and asset paths.
 * Adjust these constants without touching the overlay component.
 */

/** Nominal total intro duration fallback when media duration is not yet known. */
export const CINEMATIC_END = 10.0;

/**
 * HTML video playbackRate for the first-session intro autoplay.
 * 1.3 = 30% faster than the authored timeline (asset unchanged).
 */
export const CINEMATIC_PLAYBACK_RATE = 1.3;

/**
 * sessionStorage key: intro already started (or completed) in this browser tab session.
 * Shared across locales so EN ↔ ES does not replay the opening.
 */
export const CINEMATIC_INTRO_SEEN_KEY = "corevia_intro_seen_v1";

/**
 * Opacity fade when leaving the cinematic into live HTML.
 * Base handoff was ~0.4s; scaled by 1 / PLAYBACK_RATE so the CSS transition
 * matches the 30% faster intro pacing.
 */
export const CINEMATIC_FADE_DURATION = 0.4 / CINEMATIC_PLAYBACK_RATE;

/**
 * Scroll sensitivity: how many seconds of video progress per 100px of scroll delta.
 * Higher = reaches the end with less scrolling.
 */
export const CINEMATIC_SCROLL_SECONDS_PER_100PX = 0.55;

/**
 * Touch scrub sensitivity (mobile). Slightly higher than wheel so a normal
 * swipe can finish the remaining timeline without extreme finger travel.
 */
export const CINEMATIC_TOUCH_SECONDS_PER_100PX = 0.85;

/** Clamp a single touchmove sample so one event cannot jump the timeline. */
export const CINEMATIC_TOUCH_MAX_DELTA_PX = 48;

/**
 * Max time to wait for the first painted cinematic frame before falling back
 * to the normal homepage (avoids permanent black-screen lock on mobile).
 */
export const CINEMATIC_INIT_TIMEOUT_MS = 12000;

/**
 * After play() resolves, require currentTime to advance within this window.
 * iOS Safari can resolve play() while the timeline stays frozen.
 */
export const CINEMATIC_PLAYBACK_VERIFY_MS = 2500;

/** Minimum currentTime delta that counts as real playback progress. */
export const CINEMATIC_PLAYBACK_MIN_DELTA_SEC = 0.05;

/**
 * Viewport widths strictly below this use the phone/mobile cinematic asset.
 * Matches Tailwind's `md` (768px): phones → mobile; tablet/iPad/desktop → landscape.
 */
export const CINEMATIC_MOBILE_MAX_WIDTH = 768;

export type CinematicViewportClass = "mobile" | "desktop";

export type CinematicMedia = {
  video: string;
  poster: string | null;
  /** Portrait 9:16 asset designed for phone viewports. */
  orientation: "landscape" | "portrait";
};

type LocaleCinematicAssets = {
  /** Landscape cinematic for tablet + desktop (>= 768px). */
  desktop?: { video: string; poster?: string };
  /** Portrait cinematic for phones (< 768px). */
  mobile?: { video: string; poster?: string };
};

/**
 * Locale → viewport media map.
 *
 * EN: landscape intro ready; dedicated phone asset can land at
 *     /cinematic/en/intro-mobile.mp4 later (phones currently fall back to landscape).
 * ES: portrait intro-mobile ready; landscape /cinematic/es/intro.mp4 can land later.
 *     Until then, larger /es viewports fall back to the portrait asset — never skip.
 */
const INTRO_BY_LOCALE: Partial<Record<AppLocale, LocaleCinematicAssets>> = {
  en: {
    desktop: {
      video: "/cinematic/en/intro.mp4",
      poster: "/cinematic/en/intro-poster.jpg",
    },
    // mobile: { video: "/cinematic/en/intro-mobile.mp4", poster: "..." },
  },
  es: {
    mobile: {
      video: "/cinematic/es/intro-mobile.mp4",
      poster: "/cinematic/es/intro-mobile-poster.jpg",
    },
    // desktop: { video: "/cinematic/es/intro.mp4", poster: "..." },
  },
};

/** Classify a viewport width into phone vs tablet/desktop cinematic buckets. */
export function getCinematicViewportClass(
  width: number
): CinematicViewportClass {
  return width < CINEMATIC_MOBILE_MAX_WIDTH ? "mobile" : "desktop";
}

/**
 * Resolve the cinematic media for a locale + viewport.
 * Returns null only when this locale has no cinematic asset at all.
 *
 * Fallback rules (asymmetric by design until both orientations ship):
 * - mobile viewport → preferred mobile asset, else desktop
 * - desktop viewport → preferred desktop asset, else mobile
 */
export function resolveCinematicMedia(
  locale: AppLocale,
  viewportClass: CinematicViewportClass
): CinematicMedia | null {
  const assets = INTRO_BY_LOCALE[locale];
  if (!assets) return null;

  if (viewportClass === "mobile") {
    if (assets.mobile) {
      return {
        video: assets.mobile.video,
        poster: assets.mobile.poster ?? null,
        orientation: "portrait",
      };
    }
    // Temporary EN phone fallback: landscape asset until intro-mobile.mp4 exists.
    if (assets.desktop) {
      return {
        video: assets.desktop.video,
        poster: assets.desktop.poster ?? null,
        orientation: "landscape",
      };
    }
    return null;
  }

  // Tablet / desktop
  if (assets.desktop) {
    return {
      video: assets.desktop.video,
      poster: assets.desktop.poster ?? null,
      orientation: "landscape",
    };
  }

  // Spanish (and similar): show the available portrait cinematic rather than
  // skipping the entire intro on tablet/desktop until landscape ships.
  if (assets.mobile) {
    return {
      video: assets.mobile.video,
      poster: assets.mobile.poster ?? null,
      orientation: "portrait",
    };
  }

  return null;
}

/** Whether this locale + viewport should attempt a cinematic intro. */
export function hasCinematicIntro(
  locale: AppLocale,
  viewportClass: CinematicViewportClass
): boolean {
  return resolveCinematicMedia(locale, viewportClass) != null;
}

/** @deprecated Prefer resolveCinematicMedia — kept for narrow call sites. */
export function getCinematicIntroSrc(
  locale: AppLocale,
  viewportClass: CinematicViewportClass = "desktop"
): string | null {
  return resolveCinematicMedia(locale, viewportClass)?.video ?? null;
}

/** @deprecated Prefer resolveCinematicMedia */
export function getCinematicIntroPoster(
  locale: AppLocale,
  viewportClass: CinematicViewportClass = "desktop"
): string | null {
  return resolveCinematicMedia(locale, viewportClass)?.poster ?? null;
}

/** Clamp helper for scrubbing within [min, max]. */
export function clampCinematicTime(
  time: number,
  min = 0,
  max = CINEMATIC_END
): number {
  return Math.min(max, Math.max(min, time));
}

/** True when this browser session has already started the homepage intro. */
export function hasCinematicIntroBeenSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(CINEMATIC_INTRO_SEEN_KEY) === "1";
  } catch {
    // Private mode / blocked storage — treat as unseen and fail open.
    return false;
  }
}

/**
 * Persist that the intro has begun for this session.
 * Called when autoplay starts so mid-intro navigation does not replay it.
 */
export function markCinematicIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CINEMATIC_INTRO_SEEN_KEY, "1");
  } catch {
    // Ignore quota / privacy errors — intro still plays this visit.
  }
}
