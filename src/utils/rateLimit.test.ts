import { describe, it } from "node:test";
import assert from "node:assert";
import { createRateLimiter } from "./rateLimit";

describe("createRateLimiter", () => {
    it("should allow requests within limit", () => {
        const limiter = createRateLimiter(3, 1000);

        assert.strictEqual(limiter(), true);
        assert.strictEqual(limiter(), true);
        assert.strictEqual(limiter(), true);
    });

    it("should block requests exceeding limit", () => {
        const limiter = createRateLimiter(2, 1000);

        assert.strictEqual(limiter(), true);
        assert.strictEqual(limiter(), true);
        assert.strictEqual(limiter(), false);
        assert.strictEqual(limiter(), false);
    });

    it("should reset after interval", async () => {
        const limiter = createRateLimiter(1, 50);

        assert.strictEqual(limiter(), true);
        assert.strictEqual(limiter(), false);

        // Wait for interval to pass
        await new Promise((resolve) => setTimeout(resolve, 60));

        assert.strictEqual(limiter(), true);
    });

    it("should handle zero limit", () => {
        const limiter = createRateLimiter(0, 1000);

        assert.strictEqual(limiter(), false);
    });

    it("should work with high limits", () => {
        const limiter = createRateLimiter(1000, 1000);

        for (let i = 0; i < 1000; i++) {
            assert.strictEqual(limiter(), true);
        }
        assert.strictEqual(limiter(), false);
    });
});
