"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

type WorkLightboxProps = {
  open: boolean;
  images: readonly LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  labels: {
    dialog: string;
    close: string;
    previous: string;
    next: string;
    counter: string;
  };
};

export function WorkLightbox({
  open,
  images,
  index,
  onClose,
  onIndexChange,
  labels,
}: WorkLightboxProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const current = images[index];

  useEffect(() => {
    setMounted(true);
  }, []);

  const move = useCallback(
    (delta: number) => {
      if (images.length === 0) return;
      const next = (index + delta + images.length) % images.length;
      onIndexChange(next);
    },
    [images.length, index, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const html = document.documentElement;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbar = window.innerWidth - html.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }

    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose, move]);

  if (!mounted || !open || !current) {
    return null;
  }

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={labels.dialog}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020a10f5] px-4 py-16 sm:px-10"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={onDialogKeyDown}
    >
      <p id={titleId} className="sr-only">
        {current.alt}
      </p>

      <button
        ref={closeRef}
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full border border-white/20 bg-[#132633] text-2xl text-white transition-colors hover:bg-[#1c3647] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ×
      </button>

      <button
        type="button"
        aria-label={labels.previous}
        onClick={() => move(-1)}
        className="absolute top-1/2 left-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#132633] text-2xl text-white transition-colors hover:bg-[#1c3647] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:left-5"
      >
        ‹
      </button>

      <button
        type="button"
        aria-label={labels.next}
        onClick={() => move(1)}
        className="absolute top-1/2 right-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#132633] text-2xl text-white transition-colors hover:bg-[#1c3647] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:right-5"
      >
        ›
      </button>

      <div className="relative max-h-[84vh] w-full max-w-[90vw]">
        <Image
          src={current.src}
          alt={current.alt}
          width={1920}
          height={1080}
          priority
          sizes="90vw"
          className={cn(
            "mx-auto max-h-[84vh] w-auto max-w-full rounded-[10px] object-contain bg-[#06121c]"
          )}
        />
      </div>

      <p className="absolute bottom-5 left-1/2 max-w-[90vw] -translate-x-1/2 text-center text-xs text-[#d7e4ec]">
        {labels.counter
          .replace("{current}", String(index + 1))
          .replace("{total}", String(images.length))}
        {current.caption ? ` · ${current.caption}` : null}
      </p>
    </div>,
    document.body
  );
}
