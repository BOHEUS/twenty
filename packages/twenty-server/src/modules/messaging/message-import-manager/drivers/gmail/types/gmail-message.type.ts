import {
  type MessageHandleKind,
  type MessageParticipantRole,
} from 'twenty-shared/types';

import { type ParticipantMatchHints } from 'src/modules/match-participant/types/participant-match-hints.type';

export type GmailMessage = {
  historyId: string;
  externalId: string;
  headerMessageId: string;
  subject: string;
  messageThreadExternalId: string;
  internalDate: string;
  fromHandle: string;
  fromDisplayName: string;
  participants: Participant[];
  text: string;
  attachments: Attachment[];
};

export type Participant = {
  role: MessageParticipantRole;
  handle: string;
  handleKind?: MessageHandleKind;
  displayName: string;
  matchHints?: ParticipantMatchHints;
};

export type ParticipantWithMessageId = Participant & { messageId: string };

export type ParticipantWithId = Participant & {
  id: string;
};

type Attachment = {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
};
