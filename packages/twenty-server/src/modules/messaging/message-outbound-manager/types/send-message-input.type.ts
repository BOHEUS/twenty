type EmailAddress = string | string[];

export type SendMessageInput = {
  body: string;
  subject: string;
  to: EmailAddress;
  cc?: EmailAddress;
  bcc?: EmailAddress;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
  inReplyTo?: string;
  threadExternalId?: string;
  references?: string[];
  // Only app channels read this: one connected account fronts several of them,
  // so the sender is a channel rather than the account.
  messageChannelId?: string;
};
