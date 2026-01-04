import { normalizeError } from "./Normalizer";
import { GLOBAL_HUB } from "./Hub";
import type { SDKOptions } from "../types/options";
import { sendWebhook } from "./Transport";
import { buildErrorCard } from "../cards/ErrorCard";
import { buildLatencyCard } from "../cards/LatencyCard";
import { createRateLimiter } from "../utils/rateLimit";
import { hashError } from "../utils/hash";
import type { Scope } from "./Scope";
import type { GChatEvent } from "../types/event";

const DEFAULT_MAX_EVENTS_PER_MINUTE = 30;

export class GChatNotifier {
  private static options: SDKOptions;
  private static rateLimiter: ReturnType<typeof createRateLimiter>;

  /**
   * Initialize the SDK with configuration options
   */
  static init(options: SDKOptions): void {
    this.options = options;
    this.rateLimiter = createRateLimiter(
      options.maxEventsPerMinute ?? DEFAULT_MAX_EVENTS_PER_MINUTE,
      60_000
    );

    if (options.debug) {
      console.log("[@gchat-notifier] Initialized", {
        service: options.service,
        environment: options.environment,
      });
    }
  }

  /**
   * Capture and report an exception
   */
  static captureException(
    error: unknown,
    request?: GChatEvent["request"]
  ): void {
    if (!this.isInitialized()) return;

    // Rate limiting check
    if (!this.rateLimiter()) {
      if (this.options.debug) {
        console.warn("[@gchat-notifier] Rate limit exceeded, dropping event");
      }
      return;
    }

    const baseEvent = normalizeError(error, request);
    if (!baseEvent) {
      if (this.options.debug) {
        console.warn(
          "[@gchat-notifier] Could not normalize error:",
          typeof error
        );
      }
      return;
    }

    this.processAndSend(baseEvent);
  }

  /**
   * Capture and report latency metrics
   * @param data Metrics data including endpoint and duration
   */
  static captureLatency(data: { endpoint: string; durationMs: number; thresholdMs?: number }): void {
    if (!this.isInitialized()) return;

    if (!this.rateLimiter()) return;

    const event: GChatEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level: "latency",
      message: `Latency alert for ${data.endpoint}: ${data.durationMs}ms`,
      extra: {
        ...data,
      },
    };

    this.processAndSend(event);
  }

  private static processAndSend(baseEvent: GChatEvent) {
    const scope = GLOBAL_HUB.getScope();

    // Add fingerprint for deduplication
    const fingerprint = hashError(baseEvent.message + (baseEvent.error?.name ?? ""));

    const event: GChatEvent = {
      ...baseEvent,
      ...scope.serialize(),
      fingerprint,
      ...(this.options.environment && { environment: this.options.environment }),
      ...(this.options.service && { service: this.options.service }),
      ...(this.options.release && { release: this.options.release }),
    };

    const processed = (this.options.beforeSend?.(event) ?? event) as GChatEvent | null;
    if (!processed) {
      if (this.options.debug) {
        console.log("[@gchat-notifier] Event dropped by beforeSend");
      }
      return;
    }

    // Choose card builder based on severity
    const card = processed.level === "latency"
      ? buildLatencyCard(processed)
      : buildErrorCard(processed);

    // Fire and forget, handle errors gracefully
    sendWebhook(this.options.webhookUrl, card, this.options.debug).then(
      (result) => {
        if (!result.success && this.options.debug) {
          console.error(
            "[@gchat-notifier] Failed to send webhook after retries:",
            result.error?.message
          );
        }
      }
    );
  }

  /**
   * Run a function with an isolated scope for adding context
   */
  static withScope(fn: (scope: Scope) => void): void {
    GLOBAL_HUB.run(() => fn(GLOBAL_HUB.getScope()));
  }

  /**
   * Check if the SDK has been initialized
   */
  static isInitialized(): boolean {
    if (!this.options) {
      console.warn(
        "[@gchat-notifier] SDK not initialized. Call GChatNotifier.init() first."
      );
      return false;
    }
    return true;
  }
}
