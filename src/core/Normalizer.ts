import type { GChatEvent } from "../types/event";
import { trimStack } from "../utils/stacktrace";

/**
 * Normalizes an unknown error into a structured GChatEvent.
 * 
 * @param error - The error to normalize (must be an instance of Error)
 * @param request - Optional request context to include in the normalized event
 * @returns A GChatEvent if normalization was successful, otherwise null
 * 
 * @example
 * ```ts
 * const event = normalizeError(new Error("Something went wrong"));
 * ```
 */
export function normalizeError(
  error: unknown,
  request?: GChatEvent["request"]
): GChatEvent | null {
  if (!(error instanceof Error)) return null;

  const stack = trimStack(error.stack);
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    level: "error",
    message: error.message,
    ...(request && { request }),
    error: {
      name: error.name,
      message: error.message,
      ...(stack && { stack }),
    },
  };
}
