export type UnsubscribeTopic = {
  id: string;
  name: string | null;
  description: string | null;
  visibility: string;
};

export type MessageSuppressionReason = 'BOUNCE' | 'COMPLAINT' | 'UNSUBSCRIBE' | 'TRACKING';

export type MessageSuppression = {
  id: string;
  emailAddress: string;
  reason: MessageSuppressionReason;
  unsubscribeTopicId: string | null;
};

export type MessageSuppressionPage = {
  records: MessageSuppression[];
  totalCount: number;
};
