import type { Request, Response, NextFunction } from "express";
import { GChatNotifier } from "../core/Client";
import { GLOBAL_HUB } from "../core/Hub";
import { redactHeaders } from "../utils/redact";

/**
 * Express error handling middleware that captures exceptions and enriches them with request data.
 * 
 * @example
 * ```typescript
 * import express from "express";
 * import { gchatExpress } from "@gchat-notifier/node";
 * 
 * const app = express();
 * // ... routes
 * app.use(gchatExpress()); // Must be after all routes
 * ```
 * @returns An Express error handling middleware function
 */
export function gchatExpress() {
  return function gchatErrorHandler(
    err: Error,
    req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    GLOBAL_HUB.run(() => {
      const scope = GLOBAL_HUB.getScope();
      scope.setTag("http.method", req.method);
      scope.setTag("http.url", req.originalUrl || req.url);

      GChatNotifier.captureException(err, {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: (req.ip || req.socket?.remoteAddress) ?? undefined,
        headers: redactHeaders(req.headers as Record<string, string>) ?? undefined,
        query: (req.query as Record<string, string>) ?? undefined,
        body: req.body ? "[BODY PRESENT]" : undefined,
      });
    });

    next(err);
  };
}
