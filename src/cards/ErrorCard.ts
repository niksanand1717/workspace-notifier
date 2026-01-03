import { CardBuilder } from "./CardBuilder";
import type { WorkspaceEvent } from "../types/event";

/**
 * Builds a card optimized for Error reporting
 */
export function buildErrorCard(event: WorkspaceEvent) {
  const service = event.service ?? "unknown";
  const env = event.environment ?? "unknown";

  return new CardBuilder()
    .setHeader({
      title: "🚨 Error Captured",
      subtitle: `${service} • ${env}`,
      imageType: "CIRCLE",
    })
    .addSection()
    .addDecoratedText({
      topLabel: "Message",
      text: event.message,
      startIcon: { knownIcon: "TRAIN" }, // "TRAIN" is often used for errors in some UI kits, but let's use a URL or better icon if possible
    })
    .addSection("Context")
    .addDecoratedText({
      topLabel: "Level",
      text: event.level,
      bottomLabel: new Date(event.timestamp).toLocaleString(),
    })
    .addSection("Trace")
    .addTextParagraph(event.error?.stack || "No stack trace available")
    .build();
}
