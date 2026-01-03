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

export class CardBuilder {
  private header?: GoogleChatCardHeader;
  private sections: GoogleChatCardSection[] = [];

  setHeader(header: CardHeader) {
    this.header = header;
    return this;
  }

  addSection(header?: string) {
    const section: GoogleChatCardSection = {
      header,
      widgets: [],
    };
    this.sections.push(section);
    return this;
  }

  addTextParagraph(text: string) {
    if (this.sections.length === 0) this.addSection();
    const lastSection = this.sections[this.sections.length - 1]!;
    lastSection.widgets.push({
      textParagraph: { text },
    });
    return this;
  }

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
