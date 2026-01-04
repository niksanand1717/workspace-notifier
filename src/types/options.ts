import { GChatEvent } from "./event";

export interface SDKOptions {
  /** Google Chat webhook URL (required) */
  webhookUrl: string;

  /** Service/application name */
  service?: string;

  /** Environment (e.g., 'production', 'staging') */
  environment?: string;

  /** Application version/release */
  release?: string;

  /** Enable debug logging to console */
  debug?: boolean;

  /** Maximum events per minute (default: 30) */
  maxEventsPerMinute?: number;

  /** Transform or filter events before sending */
  beforeSend?: (event: GChatEvent) => GChatEvent | null;
}
