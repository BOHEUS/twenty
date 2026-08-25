import { type MessageHandleKind } from 'twenty-shared/types';

import { type FileInput } from 'src/engine/api/common/common-args-processors/data-arg-processor/types/file-item.type';
import { type ParticipantMatchHints } from 'src/modules/match-participant/types/participant-match-hints.type';

import { type MessageDirection } from 'src/modules/messaging/common/enums/message-direction.enum';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type MessageWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message.workspace-entity';

export type Message = Omit<
  MessageWorkspaceEntity,
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'messageChannelMessageAssociations'
  | 'messageParticipants'
  | 'messageThread'
  | 'messageThreadId'
  | 'messageFolders'
  | 'id'
  | 'messageCampaign'
  | 'messageCampaignId'
  | 'deliveryStatus'
  | 'attachments'
> & {
  // Provider-side attachment descriptors, used to recognise ICS invites; the
  // files actually persisted onto the message are attachmentFiles.
  attachments: {
    filename: string;
  }[];
  attachmentFiles?: FileInput[];
  externalId: string;
  messageThreadExternalId: string;
  direction: MessageDirection;
  messageFolderIds?: string[];
  messageFolderExternalIds?: string[];
  labelIds?: string[];
  messageHeaders?: MessageHeader[];
};

export type MessageHeader = {
  name: string;
  value: string;
};

export type MessageAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type MessageParticipant = Omit<
  MessageParticipantWorkspaceEntity,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'personId'
  | 'workspaceMemberId'
  | 'person'
  | 'workspaceMember'
  | 'message'
  | 'messageId'
  | 'messageCampaign'
  | 'messageCampaignId'
  | 'handleKind'
> & {
  // Email drivers leave this unset; persistence defaults it to EMAIL.
  handleKind?: MessageHandleKind;
  matchHints?: ParticipantMatchHints;
};

export type MessageWithParticipants = Message & {
  participants: MessageParticipant[];
};
