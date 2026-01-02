import { describe, it } from "node:test";
import assert from "node:assert";
import { redactHeaders } from "./redact";

describe("redactHeaders", () => {
    it("should redact authorization header", () => {
        const headers = {
            authorization: "Bearer secret-token",
            "content-type": "application/json",
        };

        const result = redactHeaders(headers);

        assert.strictEqual(result?.["authorization"], "[REDACTED]");
        assert.strictEqual(result?.["content-type"], "application/json");
    });

    it("should redact cookie headers", () => {
        const headers = {
            cookie: "session=abc123",
            "set-cookie": "session=xyz789",
        };

        const result = redactHeaders(headers);

        assert.strictEqual(result?.["cookie"], "[REDACTED]");
        assert.strictEqual(result?.["set-cookie"], "[REDACTED]");
    });

    it("should handle case-insensitive header names", () => {
        const headers = {
            Authorization: "Bearer token",
            COOKIE: "session=123",
        };

        const result = redactHeaders(headers);

        assert.strictEqual(result?.["Authorization"], "[REDACTED]");
        assert.strictEqual(result?.["COOKIE"], "[REDACTED]");
    });

    it("should return undefined for undefined input", () => {
        const result = redactHeaders(undefined);
        assert.strictEqual(result, undefined);
    });

    it("should handle empty headers", () => {
        const result = redactHeaders({});
        assert.deepStrictEqual(result, {});
    });

    it("should not modify non-sensitive headers", () => {
        const headers = {
            "x-request-id": "12345",
            "user-agent": "Mozilla/5.0",
            accept: "application/json",
        };

        const result = redactHeaders(headers);

        assert.deepStrictEqual(result, headers);
    });
});
