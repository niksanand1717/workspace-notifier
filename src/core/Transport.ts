import http from "node:http";
import https from "node:https";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

/**
 * Result of a transport operation.
 */
export interface TransportResult {
  /** Whether the payload was successfully delivered. */
  success: boolean;
  /** The error encountered if delivery failed. */
  error?: Error;
}

import type { GoogleChatCardV2 } from "../types/google-chat";

/**
 * Sends a Google Chat card payload to a webhook URL with exponential backoff retry logic.
 * 
 * @param webhookUrl - The Google Chat webhook URL
 * @param payload - The card payload to send
 * @param debug - Whether to log attempt failures to the console
 * @returns A promise resolving to the transport result
 * 
 * @remarks
 * This function will retry up to 3 times before giving up.
 */
export async function sendWebhook(
  webhookUrl: string,
  payload: GoogleChatCardV2,
  debug = false
): Promise<TransportResult> {
  const data = JSON.stringify(payload);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sendRequest(webhookUrl, data);
      return { success: true };
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES;
      const err = error instanceof Error ? error : new Error(String(error));

      if (debug) {
        console.error(
          `[@gchat-notifier] Webhook attempt ${attempt}/${MAX_RETRIES} failed:`,
          err.message
        );
      }

      if (isLastAttempt) {
        return { success: false, error: err };
      }

      // Exponential backoff
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  return { success: false };
}

function sendRequest(webhookUrl: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);
    const transport = url.protocol === "https:" ? https : http;

    const req = transport.request(
      webhookUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        // Consume response
        res.on("data", () => { });
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
