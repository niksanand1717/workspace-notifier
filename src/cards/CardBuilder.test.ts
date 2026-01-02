import { describe, it } from "node:test";
import assert from "node:assert";
import { CardBuilder } from "./CardBuilder";

describe("CardBuilder", () => {
    it("should build a card with sections", () => {
        const card = new CardBuilder()
            .section("Title 1", "Content 1")
            .section("Title 2", "Content 2")
            .build();

        assert.ok(card.cardsV2);
        assert.strictEqual(card.cardsV2.length, 1);
        assert.ok(card.cardsV2[0]?.card?.sections);
        assert.strictEqual(card.cardsV2[0].card.sections.length, 2);
    });

    it("should format sections correctly", () => {
        const card = new CardBuilder()
            .section("Error", "Something went wrong")
            .build();

        const section = card.cardsV2[0]?.card?.sections[0];

        assert.strictEqual(section?.header, "Error");
        assert.deepStrictEqual(section?.widgets, [
            { textParagraph: { text: "Something went wrong" } },
        ]);
    });

    it("should handle empty card", () => {
        const card = new CardBuilder().build();

        assert.ok(card.cardsV2);
        assert.strictEqual(card.cardsV2[0]?.card?.sections.length, 0);
    });

    it("should support method chaining", () => {
        const builder = new CardBuilder();

        const result = builder
            .section("A", "1")
            .section("B", "2")
            .section("C", "3");

        assert.strictEqual(result, builder);
    });

    it("should build valid Google Chat card format", () => {
        const card = new CardBuilder()
            .section("🚨 Error", "Test error")
            .build();

        // Verify the structure matches Google Chat API format
        assert.ok("cardsV2" in card);
        assert.ok(Array.isArray(card.cardsV2));
        assert.ok("card" in card.cardsV2[0]!);
        assert.ok("sections" in card.cardsV2[0]!.card!);
    });
});
