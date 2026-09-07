"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import {
  CINEMATIC_AUTOPLAY_END,
  CINEMATIC_END,
  CINEMATIC_FADE_DURATION,
  CINEMATIC_INIT_TIMEOUT_MS,
  CINEMATIC_SCROLL_SECONDS_PER_100PX,
  CINEMATIC_TOUCH_MAX_DELTA_PX,
  CINEMATIC_TOUCH_SECONDS_PER_100PX,
  clampCinematicTime,
  getCinematicIntroPoster,
  getCinematicIntroSrc,
  hasCinematicIntro,
} from "@/lib/cinematic";
import { cn } from "@/lib/utils";

type CinematicIntroProps = {
  locale: AppLocale;
};

/**
 * boot → initializing → autoplay → cinematic (bidirectional scrub)
 * → website ↔ cinematic | skipped (fallback / reduced motion)
 */
type IntroPhase =
  | "boot"
  | "initializing"
  | "autoplay"
  | "cinematic"
  | "website"
  | "skipped";

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

function waitForEvent(
  target: EventTarget,
  eventName: string,
  timeoutMs: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      target.removeEventListener(eventName, onEvent);
      window.clearTimeout(timer);
    };
    const onEvent = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(`timeout:${eventName}`));
    }, timeoutMs);
    target.addEventListener(eventName, onEvent);
  });
}

/**
 * Full-viewport cinematic overlay for the homepage only.
 * Poster covers the opening closed-laptop frame until the video paints.
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
  const autoplaySettledRef = useRef(false);
  const frameReadyRef = useRef(false);
  const [phase, setPhase] = useState<IntroPhase>("boot");
  const [mounted, setMounted] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  const src = getCinematicIntroSrc(locale);
  const poster = getCinematicIntroPoster(locale);
  const enabled = hasCinematicIntro(locale);

  const setIntroPhase = useCallback((next: IntroPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const markFrameReady = useCallback(() => {
    if (frameReadyRef.current) return;
    frameReadyRef.current = true;
    setFrameReady(true);
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
      (phaseRef.current === "cinematic" ||
        phaseRef.current === "autoplay" ||
        phaseRef.current === "initializing") &&
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

  // Media init → muted autoplay → scrub handoff (with poster + timeout safety)
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
    setIntroPhase("initializing");
    // Do NOT lock until we have a visible frame — keeps page recoverable.
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
        video.readyState >= 2 &&
        video.currentTime >= CINEMATIC_AUTOPLAY_END - 0.02
      ) {
        settleIntoCinematic(CINEMATIC_AUTOPLAY_END);
        return;
      }
      rafRef.current = requestAnimationFrame(onAutoplayTick);
    };

    const onPlaying = () => {
      markFrameReady();
    };

    const onSeeked = () => {
      // After a seek paints a frame (common when scrubbing a paused video).
      if (video.videoWidth > 0) markFrameReady();
    };

    const initTimeout = window.setTimeout(() => {
      if (cancelled || autoplaySettledRef.current || frameReadyRef.current) {
        return;
      }
      if (
        phaseRef.current === "autoplay" ||
        phaseRef.current === "cinematic" ||
        phaseRef.current === "website"
      ) {
        // Playback started; keep waiting for the first painted frame briefly,
        // but never leave a locked black overlay if paint never arrives.
        if (document.documentElement.dataset.cinematicScrollLock === "1") {
          skipIntro();
        }
        return;
      }
      // Still initializing with no painted frame — reveal the real homepage.
      skipIntro();
    }, CINEMATIC_INIT_TIMEOUT_MS);

    const startPlayback = async () => {
      try {
        if (video.readyState < 1) {
          await waitForEvent(video, "loadedmetadata", CINEMATIC_INIT_TIMEOUT_MS);
        }
        if (cancelled) return;

        prepareVideoForMobileAutoplay(video);

        // Prefer canplay so mobile has enough buffered media before play().
        if (video.readyState < 3) {
          try {
            await waitForEvent(video, "canplay", 8000);
          } catch {
            // Continue — play() may still succeed with partial buffer.
          }
        }
        if (cancelled) return;

        // Avoid unnecessary seeks before first paint — they cause black frames
        // on some iOS versions.
        if (video.currentTime > 0.05) {
          video.currentTime = 0;
        }

        const playAttempt = video.play();
        if (playAttempt !== undefined) {
          await playAttempt;
        }
        if (cancelled) return;

        // play() resolved — lock and enter autoplay. Poster remains until
        // the `playing` event confirms a painted frame.
        lockDocumentScroll();
        setIntroPhase("autoplay");
        syncOverlayVisuals(video.currentTime, resolveVideoEnd(video));
        rafRef.current = requestAnimationFrame(onAutoplayTick);
      } catch (error) {
        if (cancelled) return;
        if (isAbortError(error)) return;

        // Autoplay blocked with no painted frame yet → reveal the real site.
        if (!frameReadyRef.current) {
          skipIntro();
          return;
        }

        settleIntoCinematic(video.currentTime || 0);
      }
    };

    const onFatalError = () => {
      if (!cancelled) skipIntro();
    };

    const onPreventFullscreen = (event: Event) => {
      event.preventDefault();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onFatalError);
    video.addEventListener("webkitbeginfullscreen", onPreventFullscreen);
    void startPlayback();

    return () => {
      cancelled = true;
      window.clearTimeout(initTimeout);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onFatalError);
      video.removeEventListener("webkitbeginfullscreen", onPreventFullscreen);
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
    syncOverlayVisuals,
    markFrameReady,
    skipIntro,
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

      deltaY = Math.max(
        -CINEMATIC_TOUCH_MAX_DELTA_PX,
        Math.min(CINEMATIC_TOUCH_MAX_DELTA_PX, deltaY)
      );

      const shouldConsume =
        phaseRef.current === "cinematic" ||
        phaseRef.current === "autoplay" ||
        (phaseRef.current === "website" && deltaY < 0 && isPageAtTop());

      if (!shouldConsume) return;

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

  const showPosterCover = Boolean(poster) && !frameReady;

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className={cn(
        "fixed inset-0 z-[80] h-[100dvh] w-full overflow-hidden bg-black",
        phase === "website" ? "pointer-events-none" : "touch-none select-none"
      )}
      style={
        poster
          ? {
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200",
          frameReady ? "opacity-100" : "opacity-0"
        )}
        src={src}
        poster={poster ?? undefined}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />

      {showPosterCover ? (
        // Explicit image layer: iOS often paints a black <video> over poster=
        // until the first decoded frame, which looks like a broken black screen.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster ?? undefined}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />
      ) : null}
    </div>
  );
}
