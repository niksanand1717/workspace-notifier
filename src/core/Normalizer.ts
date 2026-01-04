import type { GChatEvent } from "../types/event";
import { trimStack } from "../utils/stacktrace";

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
