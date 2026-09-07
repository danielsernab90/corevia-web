"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import {
  CINEMATIC_AUTOPLAY_END,
  CINEMATIC_END,
  CINEMATIC_FADE_DURATION,
  CINEMATIC_SCROLL_SECONDS_PER_100PX,
  CINEMATIC_TOUCH_MAX_DELTA_PX,
  CINEMATIC_TOUCH_SECONDS_PER_100PX,
  clampCinematicTime,
  getCinematicIntroSrc,
  hasCinematicIntro,
} from "@/lib/cinematic";
import { cn } from "@/lib/utils";

type CinematicIntroProps = {
  locale: AppLocale;
};

/**
 * boot → autoplay (first visit) → cinematic (bidirectional scrub)
 * → website (HTML scroll) ↔ cinematic (re-enter by scrolling up at top)
 */
type IntroPhase = "boot" | "autoplay" | "cinematic" | "website" | "skipped";

const TOP_SCROLL_EPSILON_PX = 2;
const END_EPSILON_SEC = 0.02;

/** Saved window.scrollY while body is position:fixed (iOS-safe lock). */
let lockedScrollY = 0;

function lockDocumentScroll() {
  const html = document.documentElement;
  const body = document.body;
  if (html.dataset.cinematicScrollLock === "1") return;

  lockedScrollY = window.scrollY || html.scrollTop || 0;
  html.dataset.cinematicScrollLock = "1";
  body.dataset.cinematicScrollLock = "1";
  html.style.overflow = "hidden";
  html.style.overscrollBehavior = "none";
  body.style.overflow = "hidden";
  body.style.overscrollBehavior = "none";
  // iOS Safari ignores overflow:hidden alone — pin the body instead.
  body.style.position = "fixed";
  body.style.top = `-${lockedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
}

function unlockDocumentScroll() {
  const html = document.documentElement;
  const body = document.body;
  if (html.dataset.cinematicScrollLock !== "1") return;

  delete html.dataset.cinematicScrollLock;
  delete body.dataset.cinematicScrollLock;
  html.style.overflow = "";
  html.style.overscrollBehavior = "";
  body.style.overflow = "";
  body.style.overscrollBehavior = "";
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  window.scrollTo(0, lockedScrollY);
}

function fadeOpacityForTime(time: number, end: number): number {
  const fadeStart = end - CINEMATIC_FADE_DURATION;
  if (time <= fadeStart) return 1;
  if (time >= end) return 0;
  return 1 - (time - fadeStart) / CINEMATIC_FADE_DURATION;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "AbortError"
  );
}

function resolveVideoEnd(video: HTMLVideoElement): number {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    return Math.min(CINEMATIC_END, video.duration);
  }
  return CINEMATIC_END;
}

function isPageAtTop(): boolean {
  return (
    (window.scrollY || document.documentElement.scrollTop || 0) <=
    TOP_SCROLL_EPSILON_PX
  );
}

function prepareVideoForMobileAutoplay(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x5-playsinline", "");
}

/**
 * Full-viewport cinematic overlay for the homepage only.
 * Real HTML (Header + Hero) renders underneath and is revealed via fade.
 * Timeline is fully reversible: website ↔ closed laptop via scroll/touch.
 */
export function CinematicIntro({ locale }: CinematicIntroProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<IntroPhase>("boot");
  const touchStartYRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrubRafRef = useRef<number | null>(null);
  const pendingScrubDeltaRef = useRef(0);
  /** True once autoplay has handed off to cinematic/website (or failed open). */
  const autoplaySettledRef = useRef(false);
  const [phase, setPhase] = useState<IntroPhase>("boot");
  const [mounted, setMounted] = useState(false);

  const src = getCinematicIntroSrc(locale);
  const enabled = hasCinematicIntro(locale);

  const setIntroPhase = useCallback((next: IntroPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const skipIntro = useCallback(() => {
    setIntroPhase("skipped");
    unlockDocumentScroll();
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (scrubRafRef.current != null) {
      cancelAnimationFrame(scrubRafRef.current);
      scrubRafRef.current = null;
    }
    pendingScrubDeltaRef.current = 0;
  }, [setIntroPhase]);

  const syncOverlayVisuals = useCallback((time: number, end: number) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const opacity = fadeOpacityForTime(time, end);
    overlay.style.opacity = String(opacity);
    overlay.style.pointerEvents =
      (phaseRef.current === "cinematic" || phaseRef.current === "autoplay") &&
      opacity > 0.001
        ? "auto"
        : "none";
  }, []);

  const enterWebsiteMode = useCallback(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (video) {
      const end = resolveVideoEnd(video);
      try {
        video.pause();
        video.currentTime = end;
      } catch {
        // ignore seek errors
      }
    }
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }
    pendingScrubDeltaRef.current = 0;
    setIntroPhase("website");
    // Unlock restores prior lock offset; force homepage top for handoff.
    lockedScrollY = 0;
    unlockDocumentScroll();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [setIntroPhase]);

  const enterCinematicMode = useCallback(
    (atTime?: number) => {
      const video = videoRef.current;
      if (!video) return;
      const end = resolveVideoEnd(video);
      const next = clampCinematicTime(atTime ?? video.currentTime, 0, end);
      try {
        video.pause();
        video.currentTime = next;
      } catch {
        // ignore
      }
      lockDocumentScroll();
      setIntroPhase("cinematic");
      syncOverlayVisuals(next, end);
    },
    [setIntroPhase, syncOverlayVisuals]
  );

  const applyScrubTime = useCallback(
    (nextTime: number) => {
      if (phaseRef.current !== "cinematic") return;
      const video = videoRef.current;
      if (!video) return;

      const end = resolveVideoEnd(video);
      const prev = video.currentTime;
      const clamped = clampCinematicTime(nextTime, 0, end);
      const movingForward = nextTime > prev;

      if (Math.abs(prev - clamped) > 0.001) {
        try {
          video.currentTime = clamped;
        } catch {
          // Mobile browsers may reject seeks while metadata is thin.
          return;
        }
      }

      syncOverlayVisuals(clamped, end);

      if (movingForward && clamped >= end - END_EPSILON_SEC) {
        enterWebsiteMode();
      }
    },
    [enterWebsiteMode, syncOverlayVisuals]
  );

  const advanceByScrollDelta = useCallback(
    (deltaY: number, secondsPer100px: number) => {
      if (phaseRef.current !== "cinematic") return;
      const video = videoRef.current;
      if (!video) return;

      const seconds = (deltaY / 100) * secondsPer100px;
      applyScrubTime(video.currentTime + seconds);
    },
    [applyScrubTime]
  );

  const handleScrollIntent = useCallback(
    (deltaY: number, secondsPer100px: number) => {
      const phaseNow = phaseRef.current;

      // User gesture during autoplay — hand off to scrub immediately.
      if (phaseNow === "autoplay") {
        const video = videoRef.current;
        if (!video) return false;
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        try {
          video.pause();
        } catch {
          // ignore
        }
        autoplaySettledRef.current = true;
        setIntroPhase("cinematic");
        syncOverlayVisuals(video.currentTime, resolveVideoEnd(video));
        advanceByScrollDelta(deltaY, secondsPer100px);
        return true;
      }

      if (phaseNow === "cinematic") {
        advanceByScrollDelta(deltaY, secondsPer100px);
        return true;
      }

      if (phaseNow === "website" && deltaY < 0 && isPageAtTop()) {
        const video = videoRef.current;
        if (!video) return false;
        const end = resolveVideoEnd(video);
        enterCinematicMode(end);
        advanceByScrollDelta(deltaY, secondsPer100px);
        return true;
      }

      return false;
    },
    [advanceByScrollDelta, enterCinematicMode, setIntroPhase, syncOverlayVisuals]
  );

  const queueScrubDelta = useCallback(
    (deltaY: number, secondsPer100px: number) => {
      pendingScrubDeltaRef.current += deltaY;
      if (scrubRafRef.current != null) return;

      scrubRafRef.current = requestAnimationFrame(() => {
        scrubRafRef.current = null;
        const batched = pendingScrubDeltaRef.current;
        pendingScrubDeltaRef.current = 0;
        if (batched === 0) return;
        handleScrollIntent(batched, secondsPer100px);
      });
    },
    [handleScrollIntent]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reduced motion / missing asset → skip
  useEffect(() => {
    if (!mounted) return;
    if (!enabled || reduceMotion === true) {
      skipIntro();
    }
  }, [mounted, enabled, reduceMotion, skipIntro]);

  // First-load autoplay: 0 → CINEMATIC_AUTOPLAY_END, then cinematic control
  useEffect(() => {
    if (!mounted || !enabled || !src || reduceMotion !== false) return;
    if (
      autoplaySettledRef.current ||
      phaseRef.current === "skipped" ||
      phaseRef.current === "website" ||
      phaseRef.current === "cinematic"
    ) {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    lockDocumentScroll();
    setIntroPhase("autoplay");
    prepareVideoForMobileAutoplay(video);

    const settleIntoCinematic = (atTime: number) => {
      if (cancelled) return;
      if (phaseRef.current === "skipped" || phaseRef.current === "website") {
        return;
      }
      const end = resolveVideoEnd(video);
      const pauseAt = clampCinematicTime(atTime, 0, end);
      try {
        video.pause();
        video.currentTime = pauseAt;
      } catch {
        // ignore
      }
      autoplaySettledRef.current = true;
      lockDocumentScroll();
      setIntroPhase("cinematic");
      syncOverlayVisuals(pauseAt, end);
    };

    const onAutoplayTick = () => {
      if (cancelled || phaseRef.current !== "autoplay") return;
      if (
        video.readyState >= 1 &&
        video.currentTime >= CINEMATIC_AUTOPLAY_END - 0.02
      ) {
        settleIntoCinematic(CINEMATIC_AUTOPLAY_END);
        return;
      }
      rafRef.current = requestAnimationFrame(onAutoplayTick);
    };

    const startPlayback = async () => {
      try {
        if (video.readyState < 1) {
          await new Promise<void>((resolve, reject) => {
            const onLoaded = () => {
              cleanup();
              resolve();
            };
            const onError = () => {
              cleanup();
              reject(new Error("cinematic-media-error"));
            };
            const cleanup = () => {
              video.removeEventListener("loadedmetadata", onLoaded);
              video.removeEventListener("error", onError);
            };
            video.addEventListener("loadedmetadata", onLoaded);
            video.addEventListener("error", onError);
            if (video.readyState >= 1) {
              cleanup();
              resolve();
            }
          });
        }
        if (cancelled) return;

        prepareVideoForMobileAutoplay(video);
        video.currentTime = 0;
        const playAttempt = video.play();
        if (playAttempt !== undefined) {
          await playAttempt;
        }
        if (cancelled) return;
        rafRef.current = requestAnimationFrame(onAutoplayTick);
      } catch (error) {
        if (cancelled) return;
        // Abort from effect cleanup — let the remount retry.
        if (isAbortError(error)) return;
        // Autoplay blocked or media issue — keep overlay and allow scrub.
        settleIntoCinematic(video.currentTime || 0);
      }
    };

    const onFatalError = () => {
      if (!cancelled) settleIntoCinematic(video.currentTime || 0);
    };

    const onPreventFullscreen = (event: Event) => {
      event.preventDefault();
    };

    video.addEventListener("error", onFatalError);
    video.addEventListener("webkitbeginfullscreen", onPreventFullscreen);
    void startPlayback();

    return () => {
      cancelled = true;
      video.removeEventListener("error", onFatalError);
      video.removeEventListener("webkitbeginfullscreen", onPreventFullscreen);
      video.pause();
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Strict Mode remount: allow autoplay to start again if we never settled.
      if (!autoplaySettledRef.current) {
        // keep phase; remount effect will restart autoplay
      }
    };
  }, [
    mounted,
    enabled,
    src,
    reduceMotion,
    setIntroPhase,
    syncOverlayVisuals,
  ]);

  // Wheel + touch for cinematic scrub, autoplay takeover, and website→cinematic reverse
  useEffect(() => {
    if (
      phase !== "cinematic" &&
      phase !== "website" &&
      phase !== "autoplay"
    ) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const consumed = handleScrollIntent(
        event.deltaY,
        CINEMATIC_SCROLL_SECONDS_PER_100PX
      );
      if (consumed) {
        event.preventDefault();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartYRef.current == null || event.touches.length !== 1) return;
      const y = event.touches[0]?.clientY;
      if (y == null) return;

      let deltaY = touchStartYRef.current - y;
      touchStartYRef.current = y;
      if (Math.abs(deltaY) < 0.5) return;

      // Cap per-event deltas so one noisy touch sample cannot jump the timeline.
      deltaY = Math.max(
        -CINEMATIC_TOUCH_MAX_DELTA_PX,
        Math.min(CINEMATIC_TOUCH_MAX_DELTA_PX, deltaY)
      );

      const shouldConsume =
        phaseRef.current === "cinematic" ||
        phaseRef.current === "autoplay" ||
        (phaseRef.current === "website" && deltaY < 0 && isPageAtTop());

      if (!shouldConsume) return;

      // preventDefault must run synchronously (non-passive listener).
      event.preventDefault();
      queueScrubDelta(deltaY, CINEMATIC_TOUCH_SECONDS_PER_100PX);
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      if (scrubRafRef.current != null) {
        cancelAnimationFrame(scrubRafRef.current);
        scrubRafRef.current = null;
      }
      pendingScrubDeltaRef.current = 0;
    };
  }, [phase, handleScrollIntent, queueScrubDelta]);

  useEffect(() => {
    return () => {
      unlockDocumentScroll();
    };
  }, []);

  if (!mounted || !enabled || !src || reduceMotion == null) {
    return null;
  }

  if (reduceMotion || phase === "skipped") {
    return null;
  }

  // Opacity + pointer-events are driven imperatively so React re-renders
  // (phase changes) never reset the fade mid-scrub.
  return (
    <div
      ref={overlayRef}
      aria-hidden
      className={cn(
        "fixed inset-0 z-[80] h-[100dvh] w-full bg-black",
        phase === "website" ? "pointer-events-none" : "touch-none select-none"
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover object-center"
        src={src}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />
    </div>
  );
}
