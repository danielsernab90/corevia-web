"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { OPEN_BOOKING_EVENT } from "@/lib/booking-events";

type BookingContextValue = {
  open: boolean;
  openBooking: () => void;
  closeBooking: () => void;
  setOpen: (open: boolean) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpenRequest = () => setOpen(true);
    window.addEventListener(OPEN_BOOKING_EVENT, onOpenRequest);
    return () => window.removeEventListener(OPEN_BOOKING_EVENT, onOpenRequest);
  }, []);

  const value = useMemo(
    () => ({ open, openBooking, closeBooking, setOpen }),
    [open, openBooking, closeBooking]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
