export function createRateLimiter(limit: number, intervalMs: number) {
  let count = 0;
  let lastReset = Date.now();

  return function allow(): boolean {
    const now = Date.now();

    if (now - lastReset > intervalMs) {
      count = 0;
      lastReset = now;
    }

    if (count >= limit) return false;

    count++;
    return true;
  };
}
