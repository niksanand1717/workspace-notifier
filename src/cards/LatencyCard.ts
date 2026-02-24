import { CardBuilder } from "./CardBuilder";
import type { GChatEvent } from "../types/event";
import { SDKOptions } from "../types/options";

/**
 * Builds a Google Chat card payload optimized for latency and performance metrics.
 * Highlights the endpoint, duration, and threshold breach details.
 * 
 * @param event - The GChatEvent containing latency metrics in its extra data
 * @returns A structured GoogleChatCardV2 object
 */
export function buildLatencyCard(event: GChatEvent, options: SDKOptions) {
    const service = event.service ?? "unknown";
    const env = event.environment ?? "unknown";
    const appLogoUrl = options.appLogoUrl ?? "https://raw.githubusercontent.com/niksanand1717/workspace-notifier/main/assets/logo.png";

    // Extract duration from extra if available
    const duration = event.extra?.["durationMs"] as number | undefined;
    const threshold = event.extra?.["thresholdMs"] as number | undefined;
    const endpoint = (event.extra?.["endpoint"] as string) || (event.request?.url) || "unknown";

    const builder = new CardBuilder()
        .setHeader({
            title: "⏱️ Latency Alert",
            subtitle: `${service} • ${env}`,
            imageUrl: appLogoUrl,
        })
        .addSection("Performance Metric")
        .addDecoratedText({
            topLabel: "Endpoint",
            text: endpoint,
            startIcon: { knownIcon: "CLOCK" },
        });

    if (duration !== undefined) {
        builder.addDecoratedText({
            topLabel: "Duration",
            text: `${duration}ms`,
            bottomLabel: threshold ? `Threshold: ${threshold}ms` : undefined,
            startIcon: { knownIcon: "STAR" }, // STAR often used as indicator
        });
    }

    return builder
        .addSection("Context")
        .addDecoratedText({
            topLabel: "Severity",
            text: event.level,
            bottomLabel: new Date(event.timestamp).toLocaleString(),
        })
        .build();
}
