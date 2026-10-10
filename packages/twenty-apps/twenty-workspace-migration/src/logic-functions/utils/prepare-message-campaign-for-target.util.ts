export type MessageCampaignPreparationCounts = {
  rescheduleNeeded: number;
  midSend: number;
  unmatchedTopic: number;
};

// A scheduled campaign's send job lives in the source workspace's queue, so a copy left as
// SCHEDULED would claim a send that never happens - it comes across as a draft to reschedule.
// A campaign caught mid-send keeps its status: as a draft it could be sent again to recipients
// the source already reached, since delivery records can't be migrated.
export const prepareMessageCampaignForTarget = (
  data: Record<string, unknown>,
  targetUnsubscribeTopicIdBySourceId: Map<string, string>,
  counts: MessageCampaignPreparationCounts,
): void => {
  if (data.status === 'SCHEDULED') {
    data.status = 'DRAFT';
    counts.rescheduleNeeded += 1;
  } else if (data.status === 'SENDING') {
    counts.midSend += 1;
  }

  const sourceTopicId = data.unsubscribeTopicId;
  if (typeof sourceTopicId !== 'string') {
    return;
  }
  const targetTopicId = targetUnsubscribeTopicIdBySourceId.get(sourceTopicId);
  if (targetTopicId === undefined) {
    counts.unmatchedTopic += 1;
  }
  data.unsubscribeTopicId = targetTopicId ?? null;
};
