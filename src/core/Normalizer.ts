import type { WorkspaceEvent } from "../types/event";
import { trimStack } from "../utils/stacktrace";

export function normalizeError(error: unknown): WorkspaceEvent | null {
  if (!(error instanceof Error)) return null;

  const stack = trimStack(error.stack);
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    level: "error",
    message: error.message,
    error: {
      name: error.name,
      message: error.message,
      ...(stack && { stack }),
    },
  };
}
