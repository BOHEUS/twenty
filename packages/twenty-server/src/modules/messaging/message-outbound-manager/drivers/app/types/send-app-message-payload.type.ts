export type SendAppMessagePayload = {
  connectedAccountId: string;
  connectionProviderId: string;
  connectionProviderName: string;
  messageChannelId: string;
  channelHandle: string;
  threadExternalId?: string;
  inReplyTo?: string;
  subject: string;
  body: string;
  html: string;
  to: string[];
  cc: string[];
  bcc: string[];
};

export type SendAppMessageResponse = {
  externalId: string;
  threadExternalId?: string;
};
