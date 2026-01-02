import { describe, it } from "node:test";
import assert from "node:assert";
import { hashError } from "./hash";

describe("hashError", () => {
    it("should return a SHA1 hash", () => {
        const result = hashError("test message");

        assert.ok(result);
        assert.strictEqual(result.length, 40); // SHA1 hex is 40 chars
        assert.match(result, /^[a-f0-9]+$/);
    });

    it("should return consistent hashes for same input", () => {
        const hash1 = hashError("same message");
        const hash2 = hashError("same message");

        assert.strictEqual(hash1, hash2);
    });

    it("should return different hashes for different inputs", () => {
        const hash1 = hashError("message one");
        const hash2 = hashError("message two");

        assert.notStrictEqual(hash1, hash2);
    });

    it("should handle empty string", () => {
        const result = hashError("");

        assert.ok(result);
        assert.strictEqual(result.length, 40);
    });

    it("should handle special characters", () => {
        const result = hashError("Error: 🚨 Special chars & symbols!");

        assert.ok(result);
        assert.strictEqual(result.length, 40);
    });
});
