import { GChatEvent } from "./event";

/**
 * Configuration options for the GChat Notifier SDK.
 */
export interface SDKOptions {
  /** Google Chat webhook URL (required) */
  webhookUrl: string;

  /** 
   * Service or application name.
   * Used as a prefix or field in the notification card.
   */
  service?: string;

  /** 
   * Environment name (e.g., 'production', 'staging').
   * Allows filtering and grouping in the dashboard.
   */
  environment?: string;

  /** 
   * Application version or release identifier.
   */
  release?: string;

  /** 
   * Enable debug logging to the console.
   * Useful for troubleshooting integration issues.
   */
  debug?: boolean;

  /** 
   * Maximum events per minute (default: 30).
   * Prevents webhook flooding during high error traffic.
   */
  maxEventsPerMinute?: number;

  /** 
   * Hook to transform or filter events before they are sent to Google Chat.
   * Return `null` to drop the event entirely.
   * 
   * @param event - The event being processed
   * @returns The modified event or null to discard
   */
  beforeSend?: (event: GChatEvent) => GChatEvent | null;
}
