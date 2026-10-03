// most message types are supported except for unsupported as they don't have any customer data
// reference: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/text#text-message

export type WhatsAppWebhookMessage = {
  object: 'whatsapp_business_account';
  entry: Array<{
    id: string;
    changes: Array<{
      field: 'messages';
      value: {
        messaging_product: 'whatsapp';
        metadata: WhatsappWebhookMessageBusinessData;
      } & (WhatsappWebhookMessageErrors | WhatsappWebhookMessageStatuses | WhatsappWebhookMessageMessages);
    }>
  }>;
};

export type WhatsappWebhookMessageBusinessData = {
  display_phone_number: string; // business phone number
  phone_number_id: string; // business phone number ID
}

type WhatsappWebhookMessageErrors = {
  // only 1 element https://stackoverflow.com/a/79564754
  errors: Array<{
    // reference: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/errors
    code: number;
    title: string;
    message: string;
    error_data: {
      details: string;
    };
    href: string;
  }>;
}

type WhatsappWebhookMessageStatuses = {
  // only 1 element
  statuses: Array<{
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
  }>;
}

export type WhatsAppWebhookMessageContacts = {
  profile: {
    name: string;
  };
  wa_id: string;
  identity_key_hash?: string; // audio/button/document message
};

type WhatsappWebhookMessageMessages = {
  // only 1 element
  contacts: WhatsAppWebhookMessageContacts[];
  // only 1 element
  messages: WhatsAppWebhookMessageContent[];
};

type WhatsAppWebhookMessageBase = {
  from: string; // Phone number
  group_id?: string; // only for group messages
  id: string; // WhatsApp message ID
  timestamp: string;
}

type MediaPayload = {
  mime_type: string;
  sha256: string;
  id: string;
  url: string; // TODO: verify if it's already rolled out or not
}

type ImagePayload = MediaPayload & { caption: string };

type WhatsAppWebhookMessageReferral = {
  referral?: {
    // included if message was sent via ad https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/audio#syntax
    source_url: string;
    source_id: string;
    source_type: 'ad';
    body: string;
    headline: string;
    media_type: string;
    image_url: string;
    video_url: string;
    thumbnail_url: string;
    ctwa_clid: string;
    welcome_message: {
      text: string;
    };
  }
};

type AudioMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral &{
  type: 'audio';
  audio: MediaPayload & { voice: boolean };
}

type ButtonMessage = WhatsAppWebhookMessageBase & {
  type: 'button';
  button: {
    payload: string;
    text: string;
  }
}

type ContactsMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'contacts';
  contacts?: Array<{
    // many properties are optional => https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/contacts#syntax
    addresses?: Array<{
      city?: string;
      country?: string;
      country_code?: string;
      state?: string;
      street?: string;
      type?: string;
      zip?: string;
    }>;
    birthday?: string;
    emails?: Array<{
      email?: string;
      type?: string;
    }>;
    name?: {
      formatted_name?: string;
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      suffix?: string;
      prefix?: string;
    };
    org: {
      company?: string;
      department?: string;
      title?: string;
    };
    phones?: Array<{
      phone?: string;
      wa_id?: string;
      type?: string;
    }>;
    urls?: Array<{
      url?: string;
      type?: string;
    }>;
  }>;
}

type DocumentMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'document';
  document: ImagePayload & { filename: string };
}

type EditMessage = WhatsAppWebhookMessageBase & {
  type: 'edit';
  edit: { // added 11 July https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/edit
    original_message_id: string;
    message: {
      context: {
        id: string;
      },
      type: 'image';
      image: ImagePayload;
    }
  }
}

type ImageMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'image';
  image: ImagePayload;
}

type InteractiveMessage = WhatsAppWebhookMessageBase & {
  type: 'interactive';
  interactive:
    | {
    type: 'list_reply';
    list_reply: {
      id: string;
      title: string;
      description: string;
    };
  }
    | {
    type: 'button_reply';
    button_reply: {
      id: string;
      title: string;
    };
  }
}

type LocationMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'location';
  location: {
    address: string;
    latitude: number;
    longitude: number;
    name: string;
    url: string;
  };
}

type OrderMessage = WhatsAppWebhookMessageBase & {
  type: 'order';
  order: {
    catalog_id: string;
    text: string;
    product_items: Array<{
      product_retailer_id: string;
      quantity: number;
      item_price: number;
      currency: string;
    }>;
  };
}

type ReactionMessage = WhatsAppWebhookMessageBase & {
  type: 'reaction';
  reaction: {
    message_id: string;
    emoji?: string; // unicode
  };
}

type RevokeMessage = WhatsAppWebhookMessageBase & {
  type: 'revoke';
  revoke: {
    original_message_id: string;
  }
}

type StickerMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'sticker';
  sticker: MediaPayload & { animated: boolean };
}

type SystemMessage = WhatsAppWebhookMessageBase & {
  type: 'system';
  system: {
    body: string;
    wa_id: string; // new WhatsApp ID
    type: 'user_changed_number';
  };
}

type TextMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'text';
  text: {
    body: string;
  }
}

type UnsupportedMessage = WhatsAppWebhookMessageBase & {
  type: 'unsupported';
}

type VideoMessage = WhatsAppWebhookMessageBase & WhatsAppWebhookMessageReferral & {
  type: 'video';
  video: ImagePayload;
}

export type WhatsAppWebhookMessageContent =
  | AudioMessage
  | ButtonMessage
  | ContactsMessage
  | DocumentMessage
  | EditMessage
  | ImageMessage
  | InteractiveMessage
  | LocationMessage
  | OrderMessage
  | ReactionMessage
  | RevokeMessage
  | StickerMessage
  | SystemMessage
  | TextMessage
  | UnsupportedMessage
  | VideoMessage;