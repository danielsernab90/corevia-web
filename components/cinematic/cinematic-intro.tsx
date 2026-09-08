"use client";

import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { AppLocale } from "@/i18n/routing";
import {
  CINEMATIC_AUTOPLAY_HANDOFF_MIN_DELTA_PX,
  CINEMATIC_END,
  CINEMATIC_FADE_DURATION,
  CINEMATIC_INIT_TIMEOUT_MS,
  CINEMATIC_MOBILE_MAX_WIDTH,
  CINEMATIC_PLAYBACK_MIN_DELTA_SEC,
  CINEMATIC_PLAYBACK_VERIFY_MS,
  CINEMATIC_SCROLL_SECONDS_PER_100PX,
  CINEMATIC_TOUCH_MAX_DELTA_PX,
  CINEMATIC_TOUCH_SECONDS_PER_100PX,
  clampCinematicTime,
  getCinematicViewportClass,
  resolveCinematicMedia,
  type CinematicMedia,
  type CinematicViewportClass,
} from "@/lib/cinematic";
import { cn } from "@/lib/utils";

type CinematicIntroProps = {
  locale: AppLocale;
};

/**
 * State machine (modes never mix timelines):
 * boot → initializing → autoplay → (optional) cinematic fast-forward → website
 * website ↔ cinematic (bidirectional scrub after first completion)
 * | skipped
 *
 * AUTOPLAY: native video.play() continuously from 0 → video.duration.
 * No hardcoded midpoint pause (legacy 5s handoff removed).
 * On meaningful downward scroll/touch: hand off at currentTime, scrub forward.
 * CINEMATIC: scroll/touch drives currentTime via rAF-coalesced seeks.
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

function resolveVideoEnd(video: HTMLVideoElement): number {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    return video.duration;
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

/** Confirm the timeline actually advances (iOS can resolve play() while frozen). */
function waitForPlaybackProgress(
  video: HTMLVideoElement,
  timeoutMs: number
): Promise<boolean> {
  const start = video.currentTime;
  return new Promise((resolve) => {
    let settled = false;
    let raf = 0;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      video.removeEventListener("timeupdate", onTick);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      resolve(ok);
    };
    const onTick = () => {
      if (video.currentTime - start >= CINEMATIC_PLAYBACK_MIN_DELTA_SEC) {
        finish(true);
      }
    };
    const poll = () => {
      onTick();
      if (!settled) raf = requestAnimationFrame(poll);
    };
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    video.addEventListener("timeupdate", onTick);
    raf = requestAnimationFrame(poll);
  });
}

function readViewportClass(): CinematicViewportClass {
  if (typeof window === "undefined") return "desktop";
  return getCinematicViewportClass(window.innerWidth);
}

/** Phases where native autoplay may still be starting or running. */
function isNativeAutoplayPhase(phase: IntroPhase): boolean {
  return phase === "boot" || phase === "initializing" || phase === "autoplay";
}

/**
 * Full-viewport cinematic overlay for the homepage only.
 *
 * Mode 1 (first load): muted native autoplay; optional downward scroll/touch
 * fast-forwards from the live currentTime without fighting play().
 * Mode 2 (afterward): at document top, upward scroll re-enters at duration
 * and scrubs the same MP4 both directions. No second autoplay.
 */
export function CinematicIntro({ locale }: CinematicIntroProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<IntroPhase>("boot");
  const touchStartYRef = useRef<number | null>(null);
  const scrubRafRef = useRef<number | null>(null);
  const pendingScrubDeltaRef = useRef(0);
  const autoplayHandoffAccumRef = useRef(0);
  const introCompletedRef = useRef(false);
  const frameReadyRef = useRef(false);
  const finishingRef = useRef(false);
  const mediaRef = useRef<CinematicMedia | null>(null);

  const [phase, setPhase] = useState<IntroPhase>("boot");
  const [mounted, setMounted] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [viewportClass, setViewportClass] =
    useState<CinematicViewportClass | null>(null);
  const [media, setMedia] = useState<CinematicMedia | null>(null);

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
    if (scrubRafRef.current != null) {
      cancelAnimationFrame(scrubRafRef.current);
      scrubRafRef.current = null;
    }
    pendingScrubDeltaRef.current = 0;
    autoplayHandoffAccumRef.current = 0;
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
    autoplayHandoffAccumRef.current = 0;
    introCompletedRef.current = true;
    setIntroPhase("website");
    lockedScrollY = 0;
    unlockDocumentScroll();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [setIntroPhase]);

  const finishAutoplayWithFade = useCallback(() => {
    if (finishingRef.current || introCompletedRef.current) return;
    if (phaseRef.current !== "autoplay") return;

    finishingRef.current = true;

    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (video) {
      try {
        video.pause();
      } catch {
        // ignore
      }
    }

    // Soft opacity handoff into live HTML (no black interstitial).
    if (overlay) {
      overlay.style.transition = `opacity ${CINEMATIC_FADE_DURATION}s ease-out`;
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }

    window.setTimeout(() => {
      if (overlay) {
        overlay.style.transition = "";
      }
      enterWebsiteMode();
    }, Math.round(CINEMATIC_FADE_DURATION * 1000));
  }, [enterWebsiteMode]);

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
      markFrameReady();
      lockDocumentScroll();
      setIntroPhase("cinematic");
      syncOverlayVisuals(next, end);
    },
    [markFrameReady, setIntroPhase, syncOverlayVisuals]
  );

  /**
   * Seamless autoplay → interactive fast-forward.
   * Leaves native playback once, keeps the live currentTime, then scrubs forward.
   * Phase flips to cinematic BEFORE pause so autoplay keep-alive cannot resume.
   */
  const handoffAutoplayToScrub = useCallback(
    (deltaY: number, secondsPer100px: number) => {
      if (phaseRef.current !== "autoplay") return false;
      if (finishingRef.current || introCompletedRef.current) return false;

      const video = videoRef.current;
      if (!video) return false;

      // Only downward intent starts fast-forward during the first intro.
      if (deltaY <= 0) return false;

      autoplayHandoffAccumRef.current += deltaY;
      if (
        autoplayHandoffAccumRef.current < CINEMATIC_AUTOPLAY_HANDOFF_MIN_DELTA_PX
      ) {
        return true; // consume trackpad jitter; wait for meaningful swipe
      }

      const handoffDelta = autoplayHandoffAccumRef.current;
      autoplayHandoffAccumRef.current = 0;

      const liveTime = video.currentTime;
      const end = resolveVideoEnd(video);

      markFrameReady();
      lockDocumentScroll();
      // Take scroll control before pausing so autoplay resume cannot fight scrub.
      setIntroPhase("cinematic");

      try {
        video.pause();
      } catch {
        // ignore
      }

      // Preserve the autoplay clock — never reset / jump backward on handoff.
      try {
        if (Math.abs(video.currentTime - liveTime) > 0.001) {
          video.currentTime = liveTime;
        }
      } catch {
        // ignore
      }

      syncOverlayVisuals(liveTime, end);

      const seconds = (handoffDelta / 100) * secondsPer100px;
      const next = clampCinematicTime(liveTime + seconds, 0, end);
      try {
        video.currentTime = next;
      } catch {
        return true;
      }
      syncOverlayVisuals(next, end);

      if (next >= end - END_EPSILON_SEC) {
        enterWebsiteMode();
      }

      return true;
    },
    [
      enterWebsiteMode,
      markFrameReady,
      setIntroPhase,
      syncOverlayVisuals,
    ]
  );

  const applyScrubTime = useCallback(
    (nextTime: number) => {
      if (phaseRef.current !== "cinematic") return;
      const video = videoRef.current;
      if (!video) return;

      const end = resolveVideoEnd(video);
      const prev = video.currentTime;

      // During the first intro (before website), only allow forward scrubbing.
      // Reverse remains available after completion via website re-entry.
      let target = nextTime;
      if (!introCompletedRef.current && target < prev) {
        target = prev;
      }

      const clamped = clampCinematicTime(target, 0, end);
      const movingForward = clamped > prev;

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

      // First intro: ignore upward deltas so reverse cannot surprise mid-open.
      const effectiveDelta =
        !introCompletedRef.current && deltaY < 0 ? 0 : deltaY;
      if (effectiveDelta === 0) return;

      const seconds = (effectiveDelta / 100) * secondsPer100px;
      applyScrubTime(video.currentTime + seconds);
    },
    [applyScrubTime]
  );

  const handleScrollIntent = useCallback(
    (deltaY: number, secondsPer100px: number) => {
      const phaseNow = phaseRef.current;

      // Optional fast-forward while native autoplay is running.
      if (phaseNow === "autoplay") {
        return handoffAutoplayToScrub(deltaY, secondsPer100px);
      }

      if (phaseNow === "cinematic") {
        advanceByScrollDelta(deltaY, secondsPer100px);
        return true;
      }

      // Re-entry: only after the initial intro finished. Do NOT autoplay again.
      if (
        phaseNow === "website" &&
        introCompletedRef.current &&
        deltaY < 0 &&
        isPageAtTop()
      ) {
        const video = videoRef.current;
        if (!video) return false;
        const end = resolveVideoEnd(video);
        enterCinematicMode(end);
        advanceByScrollDelta(deltaY, secondsPer100px);
        return true;
      }

      return false;
    },
    [
      advanceByScrollDelta,
      enterCinematicMode,
      handoffAutoplayToScrub,
    ]
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

  useLayoutEffect(() => {
    // Resolve viewport + mount before paint so the <video> can start loading
    // immediately instead of waiting for a post-paint useEffect tick.
    setMounted(true);
    const applyViewport = (next: CinematicViewportClass) => {
      setViewportClass(next);
      const resolved = resolveCinematicMedia(locale, next);
      mediaRef.current = resolved;
      setMedia((prev) => {
        if (
          prev?.video === resolved?.video &&
          prev?.poster === resolved?.poster &&
          prev?.orientation === resolved?.orientation
        ) {
          return prev;
        }
        return resolved;
      });
    };
    applyViewport(readViewportClass());

    const onResize = () => {
      const next = readViewportClass();
      setViewportClass((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [locale]);

  // Refresh media on rotate only before intro completes — avoid mid-play swaps.
  useLayoutEffect(() => {
    if (!mounted || viewportClass == null) return;
    if (introCompletedRef.current) return;
    if (
      phaseRef.current === "autoplay" ||
      phaseRef.current === "cinematic" ||
      phaseRef.current === "website"
    ) {
      return;
    }
    const resolved = resolveCinematicMedia(locale, viewportClass);
    mediaRef.current = resolved;
    setMedia((prev) => {
      if (
        prev?.video === resolved?.video &&
        prev?.poster === resolved?.poster &&
        prev?.orientation === resolved?.orientation
      ) {
        return prev;
      }
      return resolved;
    });
  }, [mounted, viewportClass, locale]);

  // Kick the browser to fetch only the active locale+viewport asset ASAP.
  useLayoutEffect(() => {
    if (!media?.video) return;
    const href = media.video;
    if (document.querySelector(`link[data-cinematic-preload="${href}"]`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = href;
    link.type = "video/mp4";
    link.setAttribute("data-cinematic-preload", href);
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [media?.video]);

  // Reduced motion / missing asset → skip (null = unknown; allow start).
  useEffect(() => {
    if (!mounted || viewportClass == null) return;
    if (reduceMotion === true || media == null) {
      skipIntro();
    }
  }, [mounted, viewportClass, media, reduceMotion, skipIntro]);

  // Prefer a boolean dep so null → false does not tear down a healthy autoplay.
  const preferReducedMotion = reduceMotion === true;

  // Media init → muted native autoplay through FULL duration → fade into live HTML
  useEffect(() => {
    if (!mounted || !media || preferReducedMotion) return;
    if (
      introCompletedRef.current ||
      phaseRef.current === "skipped" ||
      phaseRef.current === "website" ||
      phaseRef.current === "cinematic"
    ) {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    finishingRef.current = false;
    autoplayHandoffAccumRef.current = 0;
    setIntroPhase("initializing");
    prepareVideoForMobileAutoplay(video);
    // src + preload="auto" already kick the network — do not call load() here
    // (it aborts and restarts the fetch).

    const onLoadedData = () => {
      if (video.videoWidth > 0) markFrameReady();
    };

    const onPlaying = () => {
      markFrameReady();
    };

    const onSeeked = () => {
      if (video.videoWidth > 0) markFrameReady();
    };

    const maybeFinishAutoplay = () => {
      if (cancelled) return;
      if (phaseRef.current !== "autoplay") return;
      if (finishingRef.current || introCompletedRef.current) return;
      const end = resolveVideoEnd(video);
      // Always end on the real media duration — never a hardcoded midpoint.
      if (end > 0 && video.currentTime >= end - END_EPSILON_SEC) {
        finishAutoplayWithFade();
      }
    };

    const onEnded = () => {
      if (cancelled) return;
      // Only natural autoplay completion — scrub mode finishes via currentTime.
      if (phaseRef.current !== "autoplay") return;
      finishAutoplayWithFade();
    };

    const onTimeUpdate = () => {
      if (cancelled || phaseRef.current !== "autoplay") return;
      if (finishingRef.current || introCompletedRef.current) return;
      const end = resolveVideoEnd(video);
      syncOverlayVisuals(video.currentTime, end);
      maybeFinishAutoplay();
    };

    const onPause = () => {
      // Keep native autoplay alive until scroll takes control or the video ends.
      // Defer one frame so intentional pause→phase changes (handoff / finish / skip)
      // settle before we decide whether to resume.
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        if (phaseRef.current !== "autoplay") return;
        if (finishingRef.current || introCompletedRef.current) return;
        if (video.ended) return;
        const end = resolveVideoEnd(video);
        // Near the real duration, finish — do not call play() again.
        if (end > 0 && video.currentTime >= end - END_EPSILON_SEC) {
          finishAutoplayWithFade();
          return;
        }
        prepareVideoForMobileAutoplay(video);
        void video.play().catch(() => undefined);
      });
    };

    const onWaiting = () => {
      if (phaseRef.current === "autoplay") markFrameReady();
    };

    const onStalled = () => {
      // Fail-open via init timeout if playback never recovers.
    };

    const initTimeout = window.setTimeout(() => {
      if (cancelled || introCompletedRef.current) return;

      const phaseNow = phaseRef.current;
      if (
        phaseNow === "website" ||
        phaseNow === "skipped" ||
        phaseNow === "cinematic"
      ) {
        return;
      }

      if (phaseNow === "autoplay") {
        if (video.currentTime < CINEMATIC_PLAYBACK_MIN_DELTA_SEC) {
          try {
            video.pause();
          } catch {
            // ignore
          }
          skipIntro();
        }
        // Healthy long autoplay — never abort mid-flight at an arbitrary second.
        return;
      }

      try {
        video.pause();
      } catch {
        // ignore
      }
      skipIntro();
    }, CINEMATIC_INIT_TIMEOUT_MS);

    const ensureStartAtZero = async () => {
      // Only correct a restored near-end position. Do NOT rewind a healthy
      // autoplay that has already advanced a few hundred ms.
      if (!video.ended && video.currentTime <= 0.35) return;

      try {
        video.pause();
        video.currentTime = 0;
        await waitForEvent(video, "seeked", 1200).catch(() => undefined);
      } catch {
        // ignore
      }

      // Only reload when a seek alone cannot recover a cached near-end position.
      if (video.ended || video.currentTime > 0.05) {
        try {
          video.load();
          await waitForEvent(video, "loadedmetadata", 4000).catch(
            () => undefined
          );
          prepareVideoForMobileAutoplay(video);
          video.currentTime = 0;
          await waitForEvent(video, "seeked", 1200).catch(() => undefined);
        } catch {
          // ignore
        }
      }
    };

    const startPlayback = async () => {
      try {
        // Metadata is enough to seek/play — do NOT wait for canplay/canplaythrough.
        if (video.readyState < 1) {
          await Promise.race([
            waitForEvent(video, "loadedmetadata", 8000),
            waitForEvent(video, "loadeddata", 8000),
          ]).catch(() => undefined);
        }
        if (cancelled || introCompletedRef.current) return;
        if (!isNativeAutoplayPhase(phaseRef.current)) return;

        prepareVideoForMobileAutoplay(video);
        await ensureStartAtZero();
        if (cancelled || introCompletedRef.current) return;
        if (!isNativeAutoplayPhase(phaseRef.current)) return;

        // Reveal the first decoded frame as soon as it exists (poster match).
        if (video.readyState >= 2 && video.videoWidth > 0) {
          markFrameReady();
        }

        lockDocumentScroll();

        // Native autoPlay may already be running — do not pause/restart it.
        if (!video.paused && !video.ended && video.currentTime <= 0.35) {
          markFrameReady();
          setIntroPhase("autoplay");
          syncOverlayVisuals(video.currentTime, resolveVideoEnd(video));

          const progressedEarly = await waitForPlaybackProgress(
            video,
            CINEMATIC_PLAYBACK_VERIFY_MS
          );
          if (cancelled || introCompletedRef.current) return;
          if (phaseRef.current !== "autoplay") return;
          if (!progressedEarly) {
            try {
              video.pause();
            } catch {
              // ignore
            }
            skipIntro();
          }
          return;
        }

        const playAttempt = video.play();
        if (playAttempt !== undefined) {
          try {
            await Promise.race([
              playAttempt,
              new Promise<never>((_, reject) => {
                window.setTimeout(
                  () => reject(new Error("timeout:play")),
                  CINEMATIC_PLAYBACK_VERIFY_MS
                );
              }),
            ]);
          } catch {
            if (!cancelled && !introCompletedRef.current) {
              try {
                video.pause();
              } catch {
                // ignore
              }
              skipIntro();
            }
            return;
          }
        }
        if (cancelled || introCompletedRef.current) return;
        if (!isNativeAutoplayPhase(phaseRef.current)) {
          return;
        }

        // Guard against browsers that resume near the end after play().
        if (video.ended || video.currentTime > 0.35) {
          await ensureStartAtZero();
          if (cancelled || introCompletedRef.current) return;
          if (!isNativeAutoplayPhase(phaseRef.current)) return;
          try {
            await video.play().catch(() => undefined);
          } catch {
            // ignore
          }
        }
        if (cancelled || introCompletedRef.current) return;
        if (!isNativeAutoplayPhase(phaseRef.current)) {
          return;
        }

        // Enter autoplay immediately so motion is not gated on verification.
        markFrameReady();
        setIntroPhase("autoplay");
        syncOverlayVisuals(video.currentTime, resolveVideoEnd(video));

        const progressed = await waitForPlaybackProgress(
          video,
          CINEMATIC_PLAYBACK_VERIFY_MS
        );
        if (cancelled || introCompletedRef.current) return;
        if (phaseRef.current !== "autoplay") return;

        if (!progressed) {
          try {
            video.pause();
          } catch {
            // ignore
          }
          skipIntro();
        }
      } catch {
        if (cancelled || introCompletedRef.current) return;
        try {
          video.pause();
        } catch {
          // ignore
        }
        skipIntro();
      }
    };

    const onFatalError = () => {
      if (!cancelled) skipIntro();
    };

    const onPreventFullscreen = (event: Event) => {
      event.preventDefault();
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("error", onFatalError);
    video.addEventListener("webkitbeginfullscreen", onPreventFullscreen);
    void startPlayback();

    return () => {
      cancelled = true;
      window.clearTimeout(initTimeout);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("error", onFatalError);
      video.removeEventListener("webkitbeginfullscreen", onPreventFullscreen);
      try {
        video.pause();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- media object identity; preferReducedMotion avoids null→false remount
  }, [
    mounted,
    media?.video,
    media?.poster,
    preferReducedMotion,
    setIntroPhase,
    syncOverlayVisuals,
    markFrameReady,
    skipIntro,
    finishAutoplayWithFade,
  ]);

  /**
   * Wheel/touch during autoplay (optional fast-forward) + cinematic scrub +
   * website reverse re-entry. Not attached during initializing.
   */
  useEffect(() => {
    if (
      phase !== "autoplay" &&
      phase !== "cinematic" &&
      phase !== "website"
    ) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      // Normalize high-res trackpad / mouse wheel deltas into pixel-ish units.
      let deltaY = event.deltaY;
      if (event.deltaMode === 1) deltaY *= 16;
      if (event.deltaMode === 2) deltaY *= 800;

      const consumed = handleScrollIntent(
        deltaY,
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

      const phaseNow = phaseRef.current;
      const shouldConsume =
        phaseNow === "cinematic" ||
        (phaseNow === "autoplay" && deltaY > 0) ||
        (phaseNow === "website" &&
          introCompletedRef.current &&
          deltaY < 0 &&
          isPageAtTop());

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

  if (!mounted || viewportClass == null) {
    return null;
  }

  // Unknown reduced-motion preference: still mount so media can start.
  // Confirmed reduced motion / missing asset / skipped → no overlay.
  if (reduceMotion === true || phase === "skipped" || !media) {
    return null;
  }

  const showPosterCover = Boolean(media.poster) && !frameReady;
  const poster = media.poster;

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
      data-cinematic-orientation={media.orientation}
      data-cinematic-viewport={viewportClass}
      data-cinematic-phase={phase}
    >
      <video
        ref={videoRef}
        key={media.video}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200",
          frameReady ? "opacity-100" : "opacity-0"
        )}
        src={media.video}
        poster={poster ?? undefined}
        muted
        playsInline
        autoPlay
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />

      {showPosterCover ? (
        // Explicit image layer: iOS often paints a black <video> over poster=
        // until the first decoded frame.
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

// Re-export breakpoint for tests / docs
export { CINEMATIC_MOBILE_MAX_WIDTH };
