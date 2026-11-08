/**
 * Homepage cinematic intro — timing, viewport breakpoints, and asset paths.
 * Video selection is device-based only (not locale).
 */

/** Nominal total intro duration fallback when media duration is not yet known. */
export const CINEMATIC_END = 10.0;

/**
 * HTML video playbackRate for the first-session intro autoplay.
 * 1.75 = 1.75× the original authored timeline (source asset unchanged).
 */
export const CINEMATIC_PLAYBACK_RATE = 1.75;

/**
 * sessionStorage key: intro already started (or completed) in this browser tab session.
 * Shared across locales and devices so EN ↔ ES and Home revisits do not replay.
 */
export const CINEMATIC_INTRO_SEEN_KEY = "corevia_intro_seen_v1";

/**
 * Opacity fade when leaving the cinematic into live HTML.
 * Base handoff was ~0.4s; scaled by 1 / PLAYBACK_RATE so the CSS transition
 * matches the faster intro pacing.
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

/** Shared desktop/tablet landscape intro (used for /en and /es). */
const DESKTOP_INTRO: CinematicMedia = {
  video: "/cinematic/en/intro.mp4",
  poster: "/cinematic/en/intro-poster.jpg",
  orientation: "landscape",
};

/** Shared phone portrait intro (used for /en and /es). */
const MOBILE_INTRO: CinematicMedia = {
  video: "/cinematic/es/intro-mobile.mp4",
  poster: "/cinematic/es/intro-mobile-poster.jpg",
  orientation: "portrait",
};

/** Classify a viewport width into phone vs tablet/desktop cinematic buckets. */
export function getCinematicViewportClass(
  width: number
): CinematicViewportClass {
  return width < CINEMATIC_MOBILE_MAX_WIDTH ? "mobile" : "desktop";
}

/**
 * Resolve the cinematic media for the current viewport only.
 * Language routes share the same assets — never select by locale.
 */
export function resolveCinematicMedia(
  viewportClass: CinematicViewportClass
): CinematicMedia {
  return viewportClass === "mobile" ? MOBILE_INTRO : DESKTOP_INTRO;
}

/** Whether this viewport should attempt a cinematic intro. */
export function hasCinematicIntro(
  viewportClass: CinematicViewportClass
): boolean {
  return resolveCinematicMedia(viewportClass) != null;
}

/** @deprecated Prefer resolveCinematicMedia — kept for narrow call sites. */
export function getCinematicIntroSrc(
  viewportClass: CinematicViewportClass = "desktop"
): string {
  return resolveCinematicMedia(viewportClass).video;
}

/** @deprecated Prefer resolveCinematicMedia */
export function getCinematicIntroPoster(
  viewportClass: CinematicViewportClass = "desktop"
): string | null {
  return resolveCinematicMedia(viewportClass).poster;
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
 * Persist that this session has handled the intro (successful start or graceful skip).
 * Call only after playback begins successfully, or when autoplay is blocked and the
 * overlay is dismissed — never before the first play() attempt settles.
 */
export function markCinematicIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CINEMATIC_INTRO_SEEN_KEY, "1");
  } catch {
    // Ignore quota / privacy errors — intro still plays this visit.
  }
}
