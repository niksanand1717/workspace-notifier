import crypto from "node:crypto";

export function hashError(message: string): string {
  return crypto.createHash("sha1").update(message).digest("hex");
}
