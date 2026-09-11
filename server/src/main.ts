import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import os from "node:os";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { createValidationPipe } from "./common/pipes/validation.pipe";
import {
  isSwaggerEnabled,
  setupSwagger,
} from "./common/swagger/setup-swagger";

const LOCAL_CLIENT_PORTS = [3000, 3002] as const;

/**
 * CORS allowlist for website (3002), Command Center (3000), and LAN peers.
 * - Always includes localhost / 127.0.0.1
 * - Auto-detects this machine's non-loopback IPv4 addresses
 * - Extra origins via ALLOWED_ORIGINS (comma-separated full origins)
 */
function resolveCorsOrigins(): string[] {
  const origins = new Set<string>([
    "http://localhost:3000",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3002",
  ]);

  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.internal || entry.family !== "IPv4") continue;
      for (const port of LOCAL_CLIENT_PORTS) {
        origins.add(`http://${entry.address}:${port}`);
      }
    }
  }

  for (const origin of process.env.ALLOWED_ORIGINS?.split(",") ?? []) {
    const trimmed = origin.trim().replace(/\/$/, "");
    if (trimmed) origins.add(trimmed);
  }

  return [...origins];
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Auth is a follow-up — CORS is intentionally allowlisted for local clients.
  const corsOrigins = resolveCorsOrigins();
  app.enableCors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  logger.log(`CORS origins: ${corsOrigins.join(", ")}`);

  // OpenAPI UI — development by default; disable with SWAGGER_ENABLED=false.
  setupSwagger(app);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  logger.log(`COREVIA API listening on http://localhost:${port}`);
  logger.log(`Leads: http://localhost:${port}/api/v1/leads`);
  if (isSwaggerEnabled()) {
    logger.log(`Swagger: http://localhost:${port}/api/docs`);
  }
}

void bootstrap();
