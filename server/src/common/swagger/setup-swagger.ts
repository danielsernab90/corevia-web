import { type INestApplication, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * OpenAPI / Swagger UI setup for the COREVIA API.
 *
 * Mounted at `/api/docs` via `swagger-ui-express` (used under the hood by
 * `@nestjs/swagger`'s `SwaggerModule.setup`).
 *
 * ---------------------------------------------------------------------------
 * WHY SWAGGER IS DEVELOPMENT-ONLY BY DEFAULT
 * ---------------------------------------------------------------------------
 * The interactive UI exposes every route, request schema, and example payload.
 * That is ideal for local / staging exploration, but in production it:
 * - enlarges the public attack surface
 * - advertises internal module structure to anonymous clients
 * - is unnecessary for real consumers (Website, Command Center) that use
 *   typed HTTP clients, not the docs UI
 *
 * Default: enabled when `NODE_ENV !== "production"`.
 * Override anytime with:
 *   SWAGGER_ENABLED=true  → force on
 *   SWAGGER_ENABLED=false → force off (recommended in production)
 *
 * ---------------------------------------------------------------------------
 * HOW FUTURE MODULES AUTOMATICALLY APPEAR
 * ---------------------------------------------------------------------------
 * Controllers and DTO classes are auto-discovered — no manual OpenAPI registry.
 *
 * 1. Add a Nest controller under `src/modules/<feature>/` and import the module
 *    in `AppModule` (same as any other feature).
 * 2. Use concrete DTO classes on `@Body()` / `@Query()` (not anonymous objects).
 * 3. Restart / rebuild — `SwaggerModule.createDocument` deep-scans routes.
 * 4. Optional: `@ApiTags('FeatureName')` on the controller for nicer grouping
 *    (documentation-only; does not change HTTP behavior).
 *
 * ---------------------------------------------------------------------------
 * HOW FUTURE DTOs SHOULD BE ANNOTATED
 * ---------------------------------------------------------------------------
 * Minimum (already enough with the Nest CLI Swagger plugin):
 *   - `class-validator` decorators (`@IsString`, `@IsEmail`, `@IsOptional`, …)
 *   - File name ending in `.dto.ts` (see `nest-cli.json` plugin config)
 *
 * Recommended for richer docs:
 *   - `@ApiProperty()` / `@ApiPropertyOptional()` with `description`, `example`
 *   - `@ApiProperty({ enum: LeadStatus })` for enums
 *   - `@ApiOkResponse({ type: ResponseDto })` on controller methods when the
 *     return type alone is not enough (e.g. wrapped list responses)
 *
 * Empty placeholder modules (no controllers) simply do not appear until routes exist.
 */
export function isSwaggerEnabled(): boolean {
  const flag = process.env.SWAGGER_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  if (flag === "true" || flag === "1" || flag === "on") return true;
  return process.env.NODE_ENV !== "production";
}

export function setupSwagger(app: INestApplication): void {
  if (!isSwaggerEnabled()) {
    Logger.log(
      "Swagger UI disabled (production or SWAGGER_ENABLED=false).",
      "Swagger"
    );
    return;
  }

  const config = new DocumentBuilder()
    .setTitle("COREVIA API")
    .setDescription(
      "Shared backend powering the COREVIA Website, Command Center, CRM, and future applications."
    )
    .setVersion("1.0.0")
    .addTag("Leads", "CRM lead capture and pipeline status")
    .addTag("Consultations", "Consultation scheduling domain (coming soon)")
    .addTag("Analytics", "Product analytics ingest / query (coming soon)")
    .addTag("Projects", "Delivery projects (coming soon)")
    .addTag("Tasks", "Operational tasks (coming soon)")
    .addTag("Dashboard", "Command Center aggregations (coming soon)")
    .addTag("Notifications", "Outbound notifications (coming soon)")
    .addTag(
      "Integrations",
      "Third-party adapters — Google, Stripe, Slack, etc. (internal)"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: "COREVIA API Docs",
  });

  Logger.log("Swagger UI available at /api/docs", "Swagger");
}
