import { CardBuilder } from "./CardBuilder";
import type { WorkspaceEvent } from "../types/event";

export function buildErrorCard(event: WorkspaceEvent) {
  return new CardBuilder()
    .section("🚨 Error", event.message)
    .section("Service", event.service ?? "unknown")
    .section("Environment", event.environment ?? "unknown")
    .section("Level", event.level)
    .build();
}
