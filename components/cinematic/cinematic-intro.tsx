"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import {
  CINEMATIC_AUTOPLAY_END,
  CINEMATIC_END,
  CINEMATIC_FADE_DURATION,
  CINEMATIC_SCROLL_SECONDS_PER_100PX,
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

function lockDocumentScroll() {
  const html = document.documentElement;
  const body = document.body;
  html.dataset.cinematicScrollLock = "1";
  body.dataset.cinematicScrollLock = "1";
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.overscrollBehavior = "none";
}

function unlockDocumentScroll() {
  const html = document.documentElement;
  const body = document.body;
  delete html.dataset.cinematicScrollLock;
  delete body.dataset.cinematicScrollLock;
  html.style.overflow = "";
  body.style.overflow = "";
  body.style.overscrollBehavior = "";
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
  return (window.scrollY || document.documentElement.scrollTop || 0) <= TOP_SCROLL_EPSILON_PX;
}

/**
 * Full-viewport cinematic overlay for the homepage only.
 * Real HTML (Header + Hero) renders underneath and is revealed via fade.
 * Timeline is fully reversible: website ↔ closed laptop via scroll.
 */
export function CinematicIntro({ locale }: CinematicIntroProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<IntroPhase>("boot");
  const touchStartYRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAutoplayedRef = useRef(false);
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
  }, [setIntroPhase]);

  const syncOverlayVisuals = useCallback((time: number, end: number) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const opacity = fadeOpacityForTime(time, end);
    overlay.style.opacity = String(opacity);
    overlay.style.pointerEvents =
      phaseRef.current === "cinematic" && opacity > 0.001 ? "auto" : "none";
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
    setIntroPhase("website");
    unlockDocumentScroll();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [setIntroPhase]);

  const enterCinematicMode = useCallback(
    (atTime?: number) => {
      const video = videoRef.current;
      if (!video) return;
      const end = resolveVideoEnd(video);
      const next = clampCinematicTime(
        atTime ?? video.currentTime,
        0,
        end
      );
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
      // Full timeline: closed laptop (0) ↔ live HTML (end)
      const clamped = clampCinematicTime(nextTime, 0, end);
      const movingForward = nextTime > prev;

      if (Math.abs(prev - clamped) > 0.001) {
        video.currentTime = clamped;
      }

      syncOverlayVisuals(clamped, end);

      // Only hand off to HTML when scrubbing forward into the end — never on reverse re-entry.
      if (movingForward && clamped >= end - END_EPSILON_SEC) {
        enterWebsiteMode();
      }
    },
    [enterWebsiteMode, syncOverlayVisuals]
  );

  const advanceByScrollDelta = useCallback(
    (deltaY: number) => {
      if (phaseRef.current !== "cinematic") return;
      const video = videoRef.current;
      if (!video) return;

      const seconds = (deltaY / 100) * CINEMATIC_SCROLL_SECONDS_PER_100PX;
      applyScrubTime(video.currentTime + seconds);
    },
    [applyScrubTime]
  );

  const handleScrollIntent = useCallback(
    (deltaY: number) => {
      const phaseNow = phaseRef.current;

      if (phaseNow === "cinematic") {
        advanceByScrollDelta(deltaY);
        return true;
      }

      if (phaseNow === "website" && deltaY < 0 && isPageAtTop()) {
        const video = videoRef.current;
        if (!video) return false;
        const end = resolveVideoEnd(video);
        // Resume from the true end; reverse scrub drives the fade back in.
        enterCinematicMode(end);
        advanceByScrollDelta(deltaY);
        return true;
      }

      return false;
    },
    [advanceByScrollDelta, enterCinematicMode]
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
    if (hasAutoplayedRef.current) return;
    if (phaseRef.current === "skipped" || phaseRef.current === "website") return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    hasAutoplayedRef.current = true;
    lockDocumentScroll();
    setIntroPhase("autoplay");

    const enterCinematicAfterAutoplay = () => {
      if (cancelled) return;
      if (phaseRef.current !== "autoplay") return;
      const end = resolveVideoEnd(video);
      const pauseAt = Math.min(CINEMATIC_AUTOPLAY_END, end);
      video.pause();
      try {
        video.currentTime = pauseAt;
      } catch {
        // ignore
      }
      setIntroPhase("cinematic");
      syncOverlayVisuals(pauseAt, end);
    };

    const onAutoplayTick = () => {
      if (cancelled || phaseRef.current !== "autoplay") return;
      if (
        video.readyState >= 1 &&
        video.currentTime >= CINEMATIC_AUTOPLAY_END - 0.02
      ) {
        enterCinematicAfterAutoplay();
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

        video.currentTime = 0;
        await video.play();
        if (cancelled) return;
        rafRef.current = requestAnimationFrame(onAutoplayTick);
      } catch (error) {
        if (cancelled || isAbortError(error)) return;
        skipIntro();
      }
    };

    const onFatalError = () => {
      if (!cancelled) skipIntro();
    };

    video.addEventListener("error", onFatalError);
    void startPlayback();

    return () => {
      cancelled = true;
      video.removeEventListener("error", onFatalError);
      video.pause();
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    mounted,
    enabled,
    src,
    reduceMotion,
    setIntroPhase,
    skipIntro,
    syncOverlayVisuals,
  ]);

  // Unified wheel + touch for cinematic scrub and website→cinematic reverse
  useEffect(() => {
    if (phase !== "cinematic" && phase !== "website") return;

    const onWheel = (event: WheelEvent) => {
      const consumed = handleScrollIntent(event.deltaY);
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
      const deltaY = touchStartYRef.current - y;
      touchStartYRef.current = y;
      if (Math.abs(deltaY) < 0.5) return;

      const consumed = handleScrollIntent(deltaY);
      if (consumed) {
        event.preventDefault();
      }
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
    };
  }, [phase, handleScrollIntent]);

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
        "fixed inset-0 z-[80] bg-black",
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
      />
    </div>
  );
}
