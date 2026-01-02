import { describe, it } from "node:test";
import assert from "node:assert";
import { trimStack } from "./stacktrace";

describe("trimStack", () => {
    it("should return undefined for undefined input", () => {
        const result = trimStack(undefined);
        assert.strictEqual(result, undefined);
    });

    it("should return short stacks unchanged", () => {
        const stack = "Error: test\n    at foo (file.ts:1:1)";
        const result = trimStack(stack);

        assert.strictEqual(result, stack);
    });

    it("should truncate very long stacks", () => {
        const longStack = "x".repeat(4000);
        const result = trimStack(longStack);

        assert.ok(result);
        assert.strictEqual(result.length, 3001); // 3000 chars + ellipsis
        assert.ok(result.endsWith("…"));
    });

    it("should handle exactly 3000 character stack", () => {
        const exactStack = "y".repeat(3000);
        const result = trimStack(exactStack);

        assert.strictEqual(result, exactStack);
        assert.strictEqual(result?.length, 3000);
    });

    it("should handle empty string", () => {
        const result = trimStack("");
        // Empty string is falsy, so trimStack returns undefined
        assert.strictEqual(result, undefined);
    });
});
