import { normalizeError } from "./Normalizer";
import { GLOBAL_HUB } from "./Hub";
import type { SDKOptions } from "../types/options";
import { sendWebhook } from "./Transport";
import { buildErrorCard } from "../cards/ErrorCard";
import { createRateLimiter } from "../utils/rateLimit";
import { hashError } from "../utils/hash";
import type { Scope } from "./Scope";

const DEFAULT_MAX_EVENTS_PER_MINUTE = 30;

export class WorkspaceSDK {
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
      console.log("[@workspace-observer] Initialized", {
        service: options.service,
        environment: options.environment,
      });
    }
  }

  /**
   * Capture and report an exception
   */
  static captureException(error: unknown): void {
    if (!this.options) {
      console.warn(
        "[@workspace-observer] SDK not initialized. Call WorkspaceSDK.init() first."
      );
      return;
    }

    // Rate limiting check
    if (!this.rateLimiter()) {
      if (this.options.debug) {
        console.warn("[@workspace-observer] Rate limit exceeded, dropping event");
      }
      return;
    }

    const baseEvent = normalizeError(error);
    if (!baseEvent) {
      if (this.options.debug) {
        console.warn(
          "[@workspace-observer] Could not normalize error:",
          typeof error
        );
      }
      return;
    }

    const scope = GLOBAL_HUB.getScope();

    // Add fingerprint for deduplication
    const fingerprint = hashError(baseEvent.message + (baseEvent.error?.name ?? ""));

    const event = {
      ...baseEvent,
      ...scope.serialize(),
      fingerprint,
      ...(this.options.environment && { environment: this.options.environment }),
      ...(this.options.service && { service: this.options.service }),
      ...(this.options.release && { release: this.options.release }),
    };

    const processed = this.options.beforeSend?.(event) ?? event;
    if (!processed) {
      if (this.options.debug) {
        console.log("[@workspace-observer] Event dropped by beforeSend");
      }
      return;
    }

    const card = buildErrorCard(processed);

    // Fire and forget, handle errors gracefully
    sendWebhook(this.options.webhookUrl, card, this.options.debug).then(
      (result) => {
        if (!result.success && this.options.debug) {
          console.error(
            "[@workspace-observer] Failed to send webhook after retries:",
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
    return !!this.options;
  }
}
