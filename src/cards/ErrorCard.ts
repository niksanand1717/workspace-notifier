import { CardBuilder } from "./CardBuilder";
import type { GChatEvent } from "../types/event";

/**
 * Builds a card optimized for Error reporting
 */
export function buildErrorCard(event: GChatEvent) {
  const service = event.service ?? "unknown";
  const env = event.environment ?? "unknown";

  const builder = new CardBuilder()
    .setHeader({
      title: "🚨 Error Captured",
      subtitle: `${service} • ${env}`,
      imageType: "CIRCLE",
    })
    .addSection()
    .addDecoratedText({
      topLabel: "Message",
      text: event.message,
      startIcon: { knownIcon: "NOT_STARTED" },
    })
    .addSection("Context")
    .addDecoratedText({
      topLabel: "Level",
      text: event.level,
      bottomLabel: new Date(event.timestamp).toLocaleString(),
    });

  if (event.request) {
    builder.addSection("Request")
      .addDecoratedText({
        topLabel: "Endpoint",
        text: `${event.request.method} ${event.request.url}`,
        startIcon: { knownIcon: "BUS" },
      });

    // Compactly group extra request details
    const details = [];
    if (event.request.ip) details.push(`IP: ${event.request.ip}`);
    if (event.request.query && Object.keys(event.request.query).length > 0) {
      details.push(`Query: ${JSON.stringify(event.request.query)}`);
    }
    if (event.request.params && Object.keys(event.request.params).length > 0) {
      details.push(`Params: ${JSON.stringify(event.request.params)}`);
    }

    if (details.length > 0) {
      builder.addTextParagraph(details.join("<br>"));
    }
  }

  return builder
    .addSection("Trace")
    .addTextParagraph(`<code>${event.error?.stack || "No stack trace available"}</code>`)
    .build();
}
