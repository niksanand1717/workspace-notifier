/**
 * Types based on Google Chat API v2 (CardsV2)
 * Reference: https://developers.google.com/workspace/chat/api/reference/rest/v1/cards
 */

export interface GoogleChatCardV2 {
    cardsV2: Array<{
        cardId?: string;
        card: GoogleChatCard;
    }>;
}

export interface GoogleChatCard {
    header?: GoogleChatCardHeader | undefined;
    sections?: GoogleChatCardSection[] | undefined;
    fixedFooter?: GoogleChatCardFixedFooter | undefined;
}

export interface GoogleChatCardHeader {
    title: string;
    subtitle?: string | undefined;
    imageUrl?: string | undefined;
    imageType?: "CIRCLE" | "SQUARE" | undefined;
}

export interface GoogleChatCardSection {
    header?: string | undefined;
    widgets: GoogleChatWidget[];
    collapsible?: boolean | undefined;
    uncollapsibleWidgetsCount?: number | undefined;
}

export interface GoogleChatWidget {
    textParagraph?: { text: string } | undefined;
    decoratedText?: GoogleChatDecoratedText | undefined;
    buttonList?: { buttons: GoogleChatButton[] } | undefined;
    divider?: Record<string, never> | undefined;
    image?: { imageUrl: string } | undefined;
}

export interface GoogleChatDecoratedText {
    icon?: GoogleChatIcon | undefined;
    startIcon?: GoogleChatIcon | undefined;
    topLabel?: string | undefined;
    text: string;
    bottomLabel?: string | undefined;
    onClick?: GoogleChatOnClick | undefined;
    button?: GoogleChatButton | undefined;
    switchControl?: any | undefined;
    endIcon?: GoogleChatIcon | undefined;
}

export interface GoogleChatIcon {
    knownIcon?: string | undefined;
    iconUrl?: string | undefined;
    altText?: string | undefined;
    imageType?: "CIRCLE" | "SQUARE" | undefined;
}

export interface GoogleChatButton {
    text?: string | undefined;
    icon?: GoogleChatIcon | undefined;
    onClick?: GoogleChatOnClick | undefined;
    color?: GoogleChatColor | undefined;
    disabled?: boolean | undefined;
}

export interface GoogleChatOnClick {
    openLink?: { url: string } | undefined;
    action?: any | undefined;
}

export interface GoogleChatColor {
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
}

export interface GoogleChatCardFixedFooter {
    buttons: GoogleChatButton[];
}
