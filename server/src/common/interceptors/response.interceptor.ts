import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

export type ApiSuccessResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

/**
 * Thin success envelope so clients share one response shape.
 * Controllers may return `{ data, meta }` directly or a bare payload.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((payload) => {
        if (
          payload &&
          typeof payload === "object" &&
          "data" in (payload as object)
        ) {
          return payload as unknown as ApiSuccessResponse<T>;
        }
        return { data: payload };
      })
    );
  }
}
