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
      scope.setTag("http.method", req.method);
      scope.setTag("http.url", req.originalUrl || req.url);

      WorkspaceSDK.captureException(err, {
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
