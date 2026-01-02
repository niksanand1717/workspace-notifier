import { describe, it } from "node:test";
import assert from "node:assert";
import { normalizeError } from "../core/Normalizer";

describe("normalizeError", () => {
    it("should normalize an Error instance", () => {
        const error = new Error("Test error message");
        const result = normalizeError(error);

        assert.ok(result);
        assert.strictEqual(result.message, "Test error message");
        assert.strictEqual(result.level, "error");
        assert.strictEqual(result.error?.name, "Error");
        assert.strictEqual(result.error?.message, "Test error message");
        assert.ok(result.id);
        assert.ok(result.timestamp);
    });

    it("should return null for non-Error values", () => {
        assert.strictEqual(normalizeError("string error"), null);
        assert.strictEqual(normalizeError(123), null);
        assert.strictEqual(normalizeError(null), null);
        assert.strictEqual(normalizeError(undefined), null);
        assert.strictEqual(normalizeError({ message: "object" }), null);
    });

    it("should include stack trace when available", () => {
        const error = new Error("With stack");
        const result = normalizeError(error);

        assert.ok(result?.error?.stack);
        assert.ok(result.error.stack.includes("With stack"));
    });

    it("should handle custom error types", () => {
        class CustomError extends Error {
            constructor(message: string) {
                super(message);
                this.name = "CustomError";
            }
        }

        const error = new CustomError("Custom message");
        const result = normalizeError(error);

        assert.ok(result);
        assert.strictEqual(result.error?.name, "CustomError");
    });

    it("should generate unique IDs for each call", () => {
        const error = new Error("Test");
        const result1 = normalizeError(error);
        const result2 = normalizeError(error);

        assert.ok(result1?.id);
        assert.ok(result2?.id);
        assert.notStrictEqual(result1.id, result2.id);
    });
});
