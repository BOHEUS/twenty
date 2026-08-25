import { type MessageHandleKind } from 'twenty-shared/types';

import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { type SendMessageResult } from 'src/modules/messaging/message-outbound-manager/types/send-message-result.type';

export type PersistSentMessageInput = {
  sendResult: SendMessageResult;
  subject: string;
  body: string;
  recipients: { to: string[]; cc: string[]; bcc: string[] };
  connectedAccount: Pick<ConnectedAccountEntity, 'id' | 'handle'>;
  messageChannelId: string;
  // Chat channels send as the channel rather than the account, and their
  // handles are not addresses. Both are resolved from the channel at persist
  // time, so callers never pass them.
  senderHandle?: string;
  handleKind?: MessageHandleKind;
  inReplyTo?: string;
  parentThreadExternalId?: string;
  workspaceId: string;
};
