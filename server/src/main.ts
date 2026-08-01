import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { createValidationPipe } from "./common/pipes/validation.pipe";
import {
  isSwaggerEnabled,
  setupSwagger,
} from "./common/swagger/setup-swagger";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Clients: website (3002), Command Center (3000), Tailscale LAN.
  // Auth is a follow-up — CORS is intentionally allowlisted for local clients.
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3002",
      "http://100.114.151.46:3000",
      "http://100.114.151.46:3002",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

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
