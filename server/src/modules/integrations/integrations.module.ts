import { Module } from "@nestjs/common";

import { GoogleModule } from "./google/google.module";

/**
 * Central Integrations facade for the COREVIA NestJS API.
 *
 * ============================================================================
 * ARCHITECTURE
 * ============================================================================
 *
 * Website / Command Center / Mobile ──► NestJS domain modules
 *                                         │
 *                                         ▼
 *                               IntegrationsModule
 *                          ┌──────┼──────┬─────────┐
 *                       Google  Stripe  Slack   …future
 *
 * Rules:
 * 1. External providers are ONLY reached from this tree (or services it exports).
 * 2. Domain modules (Leads, Consultations, …) import IntegrationsModule and
 *    inject the specific provider service they need — never raw SDKs.
 * 3. The Next.js website must never call Google / Stripe / etc. directly.
 *
 * ============================================================================
 * HOW TO ADD A NEW INTEGRATION
 * ============================================================================
 *
 * 1. Create `src/modules/integrations/<provider>/`
 *    e.g. stripe/, slack/, twilio/, meta/, whatsapp/, openai/
 * 2. Add `<provider>.module.ts` + one service per concern
 *    (auth centralized if the vendor has shared credentials).
 * 3. Import that module here and re-export it.
 * 4. Domain features depend on IntegrationsModule — not on nested paths —
 *    unless a deliberate deep import is required.
 *
 * Planned providers (folders added when implementation starts):
 * google (done shell) · stripe · slack · twilio · meta · whatsapp · openai · gmail · calendar
 */
@Module({
  imports: [GoogleModule],
  exports: [GoogleModule],
})
export class IntegrationsModule {}
