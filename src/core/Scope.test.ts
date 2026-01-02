import { describe, it } from "node:test";
import assert from "node:assert";
import { Scope } from "../core/Scope";

describe("Scope", () => {
    it("should set and serialize tags", () => {
        const scope = new Scope();
        scope.setTag("userId", "123");
        scope.setTag("feature", "checkout");

        const result = scope.serialize();

        assert.deepStrictEqual(result.tags, {
            userId: "123",
            feature: "checkout",
        });
    });

    it("should set and serialize extra data", () => {
        const scope = new Scope();
        scope.setExtra("cart", { items: 3, total: 99.99 });
        scope.setExtra("debug", true);

        const result = scope.serialize();

        assert.deepStrictEqual(result.extra, {
            cart: { items: 3, total: 99.99 },
            debug: true,
        });
    });

    it("should override existing keys", () => {
        const scope = new Scope();
        scope.setTag("env", "dev");
        scope.setTag("env", "prod");

        const result = scope.serialize();

        assert.strictEqual(result.tags["env"], "prod");
    });

    it("should start with empty maps", () => {
        const scope = new Scope();
        const result = scope.serialize();

        assert.deepStrictEqual(result.tags, {});
        assert.deepStrictEqual(result.extra, {});
    });

    it("should handle complex extra values", () => {
        const scope = new Scope();
        const complexValue = {
            nested: { deeply: { value: [1, 2, 3] } },
            array: ["a", "b"],
        };
        scope.setExtra("complex", complexValue);

        const result = scope.serialize();

        assert.deepStrictEqual(result.extra["complex"], complexValue);
    });
});
