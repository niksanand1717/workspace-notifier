const SENSITIVE_HEADERS = ["authorization", "cookie", "set-cookie"];

export function redactHeaders(
  headers?: Record<string, string>
): Record<string, string> | undefined {
  if (!headers) return;

  const safe: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      safe[key] = "[REDACTED]";
    } else {
      safe[key] = value;
    }
  }

  return safe;
}
