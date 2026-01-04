import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { GChatNotifier } from "../core/Client";
import { GLOBAL_HUB } from "../core/Hub";
import { redactHeaders } from "../utils/redact";

/**
 * Fastify plugin that captures errors and enriches them with request data.
 * 
 * @example
 * ```typescript
 * import Fastify from "fastify";
 * import { gchatFastify } from "@gchat-notifier/node";
 * 
 * const fastify = Fastify();
 * await fastify.register(gchatFastify);
 * ```
 * @returns A Fastify plugin that registers the error hook
 */
export const gchatFastify: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onError", (request: FastifyRequest, _reply, error, done) => {
    GLOBAL_HUB.run(() => {
      const scope = GLOBAL_HUB.getScope();
      scope.setTag("http.method", request.method);
      scope.setTag("http.url", request.url);

      GChatNotifier.captureException(error, {
        method: request.method,
        url: request.url,
        ip: request.ip,
        headers: redactHeaders(request.headers as Record<string, string>) ?? undefined,
        query: (request.query as Record<string, any>) ?? undefined,
        body: request.body ? "[BODY PRESENT]" : undefined,
      });
    });

    done();
  });
};
