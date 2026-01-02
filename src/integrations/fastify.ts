import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { WorkspaceSDK } from "../core/Client";
import { GLOBAL_HUB } from "../core/Hub";
import { redactHeaders } from "../utils/redact";

/**
 * Fastify plugin that captures errors and enriches them with request data.
 * 
 * @example
 * ```typescript
 * import Fastify from "fastify";
 * import { workspaceFastify } from "@workspace-observer/node";
 * 
 * const fastify = Fastify();
 * await fastify.register(workspaceFastify);
 * ```
 */
export const workspaceFastify: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onError", (request: FastifyRequest, _reply, error, done) => {
    GLOBAL_HUB.run(() => {
      const scope = GLOBAL_HUB.getScope();

      // Enrich with request data
      scope.setExtra("request", {
        method: request.method,
        url: request.url,
        ip: request.ip,
        headers: redactHeaders(request.headers as Record<string, string>),
        query: request.query,
        body: request.body ? "[BODY PRESENT]" : undefined,
      });

      // Add useful tags
      scope.setTag("http.method", request.method);
      scope.setTag("http.url", request.url);

      WorkspaceSDK.captureException(error);
    });

    done();
  });
};
