import type { Severity } from "./severity";
export type { Severity };

/**
 * Represents a single event (error or latency alert) to be sent to Google Chat.
 */
export interface GChatEvent {
  /** Unique identifier for the event. */
  id: string;
  /** Unix timestamp in milliseconds. */
  timestamp: number;
  /** Severity level or event type. */
  level: Severity;
  message: string;
  /** Unique hash of the event for deduplication in the card UI. */
  fingerprint?: string;

  /** Original error details if capturing an exception. */
  error?: {
    name: string;
    message: string;
    stack?: string;
  };

  /** Optional HTTP request context captured at the time of the event. */
  request?: {
    method?: string | undefined;
    url?: string | undefined;
    ip?: string | undefined;
    headers?: Record<string, string> | undefined;
    query?: Record<string, any> | undefined;
    params?: Record<string, any> | undefined;
    body?: any | undefined;
  };

  /** Key-value pairs for filtering and categorization. */
  tags?: Record<string, string>;
  /** Supplemental structured data related to the event. */
  extra?: Record<string, unknown>;

  environment?: string;
  service?: string;
  release?: string;
}
