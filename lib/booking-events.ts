/**
 * Lightweight bridge so chrome outside BookingProvider (Header / MobileMenu)
 * can open the shared booking modal while on /book-consultation.
 */

export const OPEN_BOOKING_EVENT = "corevia:open-booking";

export function requestOpenBooking() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_BOOKING_EVENT));
}
