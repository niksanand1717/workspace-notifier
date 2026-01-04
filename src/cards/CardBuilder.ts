import type {
  GoogleChatCard,
  GoogleChatCardHeader,
  GoogleChatCardSection,
  GoogleChatWidget,
  GoogleChatCardV2
} from "../types/google-chat";

export interface CardHeader extends GoogleChatCardHeader { }

export interface DecoratedText {
  text: string;
  topLabel?: string | undefined;
  bottomLabel?: string | undefined;
  startIcon?: {
    knownIcon?: string;
    iconUrl?: string;
  } | undefined;
}

/**
 * Fluent builder for creating Google Chat cards (V2).
 * Supports headers, sections, and multiple widgets like TextParagraph and DecoratedText.
 * 
 * @example
 * ```ts
 * const card = new CardBuilder()
 *   .setHeader({ title: "Alert" })
 *   .addSection("Details")
 *   .addTextParagraph("Something happened")
 *   .build();
 * ```
 */
export class CardBuilder {
  private header?: GoogleChatCardHeader;
  private sections: GoogleChatCardSection[] = [];

  /**
   * Set the card header.
   * 
   * @param header - Header options including title, subtitle, and image
   * @returns The builder instance
   */
  setHeader(header: CardHeader) {
    this.header = header;
    return this;
  }

  /**
   * Add a new section to the card. Subsequent widgets will be added to this section.
   * 
   * @param header - Optional section header text
   * @returns The builder instance
   */
  addSection(header?: string) {
    const section: GoogleChatCardSection = {
      header,
      widgets: [],
    };
    this.sections.push(section);
    return this;
  }

  /**
   * Add a text paragraph widget to the current section.
   * 
   * @param text - The paragraph text (supports basic HTML formatting)
   * @returns The builder instance
   */
  addTextParagraph(text: string) {
    if (this.sections.length === 0) this.addSection();
    const lastSection = this.sections[this.sections.length - 1]!;
    lastSection.widgets.push({
      textParagraph: { text },
    });
    return this;
  }

  /**
   * Add a decorated text widget to the current section.
   * Supports labels, icons, and buttons (via options).
   * 
   * @param options - Decorated text configuration
   * @returns The builder instance
   */
  addDecoratedText(options: DecoratedText) {
    if (this.sections.length === 0) this.addSection();
    const lastSection = this.sections[this.sections.length - 1]!;
    lastSection.widgets.push({
      decoratedText: {
        topLabel: options.topLabel,
        text: options.text,
        bottomLabel: options.bottomLabel,
        startIcon: options.startIcon,
      },
    });
    return this;
  }

  /**
   * legacy support for existing code
   * @deprecated use addSection and addTextParagraph instead
   */
  section(title: string, text: string) {
    return this.addSection(title).addTextParagraph(text);
  }

  /**
   * Build the final Google Chat card payload.
   * 
   * @returns A structured GoogleChatCardV2 object ready for webhook delivery
   */
  build(): GoogleChatCardV2 {
    return {
      cardsV2: [
        {
          cardId: crypto.randomUUID(),
          card: {
            header: this.header,
            sections: this.sections,
          },
        },
      ],
    };
  }
}
