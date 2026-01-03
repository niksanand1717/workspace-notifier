import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from "@nestjs/common";
import type { Request } from "express";
import { WorkspaceSDK } from "../core/Client";
import { GLOBAL_HUB } from "../core/Hub";
import { redactHeaders } from "../utils/redact";

/**
 * NestJS exception filter that captures all exceptions and enriches them with request data.
 * 
 * @example
 * ```typescript
 * import { APP_FILTER } from "@nestjs/core";
 * import { WorkspaceExceptionFilter } from "@workspace-observer/node";
 * 
 * @Module({
 *   providers: [{
 *     provide: APP_FILTER,
 *     useClass: WorkspaceExceptionFilter,
 *   }],
 * })
 * export class AppModule {}
 * ```
 */
@Catch()
export class WorkspaceExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): never {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    GLOBAL_HUB.run(() => {
      const scope = GLOBAL_HUB.getScope();

      // Add HTTP status if available
      if (exception instanceof HttpException) {
        scope.setTag("http.status", String(exception.getStatus()));
      }

      if (request) {
        scope.setTag("http.method", request.method);
        scope.setTag("http.url", request.originalUrl || request.url);

        WorkspaceSDK.captureException(exception, {
          method: request.method,
          url: request.originalUrl || request.url,
          ip: (request.ip || request.socket?.remoteAddress) ?? undefined,
          headers: redactHeaders(request.headers as Record<string, string>) ?? undefined,
          query: (request.query as Record<string, any>) ?? undefined,
          body: request.body ? "[BODY PRESENT]" : undefined,
        });
      } else {
        WorkspaceSDK.captureException(exception);
      }
    });

    // Re-throw to let NestJS handle the response
    throw exception;
  }
}
