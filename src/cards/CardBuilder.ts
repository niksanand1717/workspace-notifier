export class CardBuilder {
  private sections: any[] = [];

  section(title: string, text: string) {
    this.sections.push({
      header: title,
      widgets: [{ textParagraph: { text } }],
    });
    return this;
  }

  build() {
    return {
      cardsV2: [
        {
          card: {
            sections: this.sections,
          },
        },
      ],
    };
  }
}
