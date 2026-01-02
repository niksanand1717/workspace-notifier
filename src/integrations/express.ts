import type { Request, Response, NextFunction } from "express";
import { WorkspaceSDK } from "../core/Client";
import { GLOBAL_HUB } from "../core/Hub";
import { redactHeaders } from "../utils/redact";

/**
 * Express error handling middleware that captures exceptions and enriches them with request data.
 * 
 * @example
 * ```typescript
 * import express from "express";
 * import { workspaceExpress } from "@workspace-observer/node";
 * 
 * const app = express();
 * // ... routes
 * app.use(workspaceExpress()); // Must be after all routes
 * ```
 */
export function workspaceExpress() {
  return function workspaceErrorHandler(
    err: Error,
    req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    GLOBAL_HUB.run(() => {
      const scope = GLOBAL_HUB.getScope();

      // Enrich with request data
      scope.setExtra("request", {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.socket?.remoteAddress,
        headers: redactHeaders(req.headers as Record<string, string>),
        query: req.query,
        body: req.body ? "[BODY PRESENT]" : undefined,
      });

      // Add useful tags
      scope.setTag("http.method", req.method);
      scope.setTag("http.url", req.originalUrl || req.url);

      WorkspaceSDK.captureException(err);
    });

    next(err);
  };
}
