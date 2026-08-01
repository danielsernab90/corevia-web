import { ValidationPipe } from "@nestjs/common";

/**
 * Global request validation — DTOs are the boundary contract.
 * Whitelist strips unknown properties; forbidNonWhitelisted rejects them.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
}
