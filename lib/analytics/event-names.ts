/**
 * Canonical analytics event names for the Corevia website.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD A NEW EVENT
 * ---------------------------------------------------------------------------
 * 1. Add a SCREAMING_SNAKE key here with a stable human-readable string value.
 * 2. Prefer Title Case values — they surface cleanly in Command Center later.
 * 3. Call `trackEvent(AnalyticsEvents.YOUR_NEW_EVENT, { ...metadata })` from
 *    the component / handler that owns the interaction.
 * 4. Never invent ad-hoc string literals in UI code when a catalog entry exists.
 * 5. Do not rename existing values once they are in production — treat them as
 *    durable analytics keys (add a new event instead of mutating an old one).
 *
 * UI components must only call `trackEvent()` — they must never import providers
 * or know whether events go to a database, GA, PostHog, etc.
 */

export const AnalyticsEvents = {
  LANDING_PAGE_VIEWED: "Landing Page Viewed",
  CONSULTATION_STARTED: "Consultation Started",
  CONSULTATION_SUBMITTED: "Consultation Submitted",
  WHATSAPP_CLICKED: "WhatsApp Clicked",
  INSTAGRAM_CLICKED: "Instagram Clicked",
  PORTFOLIO_CLICKED: "Portfolio Clicked",
  SERVICES_CLICKED: "Services Clicked",
  NAVIGATION_CLICKED: "Navigation Clicked",
  /** Reserved namespace for future Command Center / dashboard interactions. */
  DASHBOARD_EVENT: "Dashboard Event",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
