import { type INestApplication, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * OpenAPI / Swagger UI setup for the COREVIA API.
 *
 * ---------------------------------------------------------------------------
 * HOW FUTURE MODULES APPEAR IN SWAGGER
 * ---------------------------------------------------------------------------
 * Controllers and DTO classes are auto-discovered — no manual registration.
 *
 * 1. Controllers
 *    - Decorate with `@Controller('api/v1/<resource>')`
 *    - Prefer `@ApiTags('<Module>')` so operations group cleanly
 *      (e.g. `@ApiTags('Leads')`, `@ApiTags('Consultations')`)
 *    - Use concrete DTO classes on `@Body()` / `@Query()` parameters
 *      (not inline object types)
 *
 * 2. DTOs
 *    - Keep `class-validator` decorators (`@IsString`, `@IsOptional`, …)
 *    - The Nest CLI Swagger plugin (`nest-cli.json`) maps those into schemas
 *    - Optionally add `@ApiProperty` / `@ApiPropertyOptional` for richer docs
 *
 * 3. Responses
 *    - Prefer typed return classes (or `@ApiOkResponse({ type: … })`)
 *    - Enums used in DTOs surface automatically when referenced
 *
 * 4. Module shells
 *    - Empty modules with no controllers simply do not appear until routes exist
 *
 * ---------------------------------------------------------------------------
 * SECURITY
 * ---------------------------------------------------------------------------
 * Enabled by default outside production. Override with:
 *   SWAGGER_ENABLED=true  → force on
 *   SWAGGER_ENABLED=false → force off (recommended in production)
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
