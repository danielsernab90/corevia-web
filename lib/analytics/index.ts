/**
 * Corevia analytics foundation — public API.
 *
 * ============================================================================
 * ARCHITECTURE
 * ============================================================================
 *
 * This package is a reusable internal analytics service for the website and,
 * later, the Command Center dashboard. It follows dependency inversion:
 *
 *   UI components ──► trackEvent() ──► AnalyticsProvider ──► destination(s)
 *
 * Layers:
 * - `event-names.ts`  — durable event catalog (add new events here first)
 * - `types.ts`        — provider-agnostic event shape
 * - `context.ts`      — page / language / device / referrer collectors
 * - `session.ts`      — anonymous session id
 * - `enrich.ts`       — builds the full AnalyticsEvent
 * - `provider.ts`     — destination interface (SOLID: DIP)
 * - `providers/*`     — noop, console, composite, http (extensible)
 * - `runtime.ts`      — configureAnalytics + trackEvent facade
 *
 * ============================================================================
 * HOW UI DEVELOPERS SHOULD USE THIS
 * ============================================================================
 *
 * 1. Import only from `@/lib/analytics` (this barrel).
 * 2. Prefer catalog names from `AnalyticsEvents`.
 * 3. Call `trackEvent(...)` from click handlers, effects, or form success paths.
 * 4. Never import providers from feature components.
 * 5. Never call fetch/GA/PostHog directly from UI for product analytics.
 *
 * @example
 * ```ts
 * import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
 *
 * function onWhatsAppClick() {
 *   trackEvent(AnalyticsEvents.WHATSAPP_CLICKED, { placement: "empezar" });
 * }
 * ```
 *
 * ============================================================================
 * HOW TO CONNECT A NEW DESTINATION LATER
 * ============================================================================
 *
 * 1. Implement `AnalyticsProvider` (see `providers/http-provider.ts` as a template).
 * 2. At app bootstrap, call:
 *    `configureAnalytics(createCompositeAnalyticsProvider(new YourProvider(), ...))`
 * 3. Leave every `trackEvent()` call site unchanged.
 *
 * Destinations prepared for (not wired yet):
 * Google Analytics · PostHog · Mixpanel · Custom DB · Internal API
 */

export { AnalyticsEvents } from "@/lib/analytics/event-names";
export type { AnalyticsEventName } from "@/lib/analytics/event-names";

export type { AnalyticsProvider } from "@/lib/analytics/provider";

export {
  configureAnalytics,
  createDefaultAnalyticsProvider,
  getAnalyticsProvider,
  trackEvent,
} from "@/lib/analytics/runtime";

export { createCompositeAnalyticsProvider } from "@/lib/analytics/providers/composite-provider";
export { ConsoleAnalyticsProvider } from "@/lib/analytics/providers/console-provider";
export { HttpAnalyticsProvider } from "@/lib/analytics/providers/http-provider";
export { NoopAnalyticsProvider } from "@/lib/analytics/providers/noop-provider";

export type {
  AnalyticsEvent,
  AnalyticsMetadata,
  DeviceType,
  TrackEventInput,
} from "@/lib/analytics/types";
