import { beforeEach, describe, expect, it } from 'vitest';
import { createMockGraphqlClient } from 'src/__tests__/utils/mock-graphql-client';
import { migrateUnsubscribeTopics } from 'src/logic-functions/migration/migrate-unsubscribe-topics.util';
import { migrateMessageSuppressions } from 'src/logic-functions/migration/migrate-message-suppressions.util';
import { prepareMessageCampaignForTarget } from 'src/logic-functions/utils/prepare-message-campaign-for-target.util';
import { migrationState } from 'src/logic-functions/utils/migration-state.util';

const newsletterTopic = { id: 'source-topic-newsletter', name: 'Newsletter', description: null, visibility: 'PUBLIC' };
const productTopic = { id: 'source-topic-product', name: 'Product', description: 'Updates', visibility: 'PRIVATE' };

beforeEach(() => {
  migrationState.targetUnsubscribeTopicIdBySourceId = new Map();
  migrationState.migratedMessageSuppressions = false;
  migrationState.objectRecordsToMigrate = new Map();
});

describe('migrateUnsubscribeTopics', () => {
  it('reuses a target topic with the same name and creates the missing ones', async () => {
    const { client: sourceClient } = createMockGraphqlClient({
      findUnsubscribeTopics: { unsubscribeTopics: [newsletterTopic, productTopic] },
    });
    const { client: targetClient, calls: targetCalls } = createMockGraphqlClient({
      findUnsubscribeTopics: { unsubscribeTopics: [{ ...newsletterTopic, id: 'target-topic-newsletter' }] },
      createUnsubscribeTopic: { createUnsubscribeTopic: { id: 'target-topic-product' } },
    });

    await migrateUnsubscribeTopics(sourceClient, targetClient);

    const creates = targetCalls.filter((call) => call.operationName === 'createUnsubscribeTopic');
    expect(creates).toHaveLength(1);
    expect(creates[0].variables.input).toEqual({ name: 'Product', description: 'Updates', visibility: 'PRIVATE' });
    expect(Object.fromEntries(migrationState.targetUnsubscribeTopicIdBySourceId)).toEqual({
      'source-topic-newsletter': 'target-topic-newsletter',
      'source-topic-product': 'target-topic-product',
    });
  });

  it('skips without failing when a workspace has email campaigns disabled', async () => {
    const { client: sourceClient } = createMockGraphqlClient({});
    const { client: targetClient, calls: targetCalls } = createMockGraphqlClient({
      findUnsubscribeTopics: { unsubscribeTopics: [] },
    });

    await expect(migrateUnsubscribeTopics(sourceClient, targetClient)).resolves.toBeUndefined();
    expect(targetCalls.filter((call) => call.operationName === 'createUnsubscribeTopic')).toHaveLength(0);
  });
});

describe('migrateMessageSuppressions', () => {
  it('recreates opt-outs with remapped topics and leaves tracking opt-outs behind', async () => {
    migrationState.targetUnsubscribeTopicIdBySourceId = new Map([['source-topic-newsletter', 'target-topic-newsletter']]);
    const { client: sourceClient } = createMockGraphqlClient({
      findMessageSuppressions: {
        messageSuppressions: {
          records: [
            { id: 's1', emailAddress: 'topic@example.com', reason: 'UNSUBSCRIBE', unsubscribeTopicId: 'source-topic-newsletter' },
            { id: 's2', emailAddress: 'all@example.com', reason: 'UNSUBSCRIBE', unsubscribeTopicId: null },
            { id: 's3', emailAddress: 'bounce@example.com', reason: 'BOUNCE', unsubscribeTopicId: 'source-topic-newsletter' },
            { id: 's4', emailAddress: 'unknown-topic@example.com', reason: 'UNSUBSCRIBE', unsubscribeTopicId: 'source-topic-gone' },
            { id: 's5', emailAddress: 'tracking@example.com', reason: 'TRACKING', unsubscribeTopicId: null },
          ],
          totalCount: 5,
        },
      },
    });
    const { client: targetClient, calls: targetCalls } = createMockGraphqlClient({
      createMessageSuppression: { createMessageSuppression: { id: 'target-suppression' } },
    });

    await expect(migrateMessageSuppressions(sourceClient, targetClient)).resolves.toBe(true);

    expect(targetCalls.map((call) => call.variables.input)).toEqual([
      { emailAddress: 'topic@example.com', unsubscribeTopicId: 'target-topic-newsletter' },
      { emailAddress: 'all@example.com', unsubscribeTopicId: null },
      { emailAddress: 'bounce@example.com', unsubscribeTopicId: null },
      { emailAddress: 'unknown-topic@example.com', unsubscribeTopicId: null },
    ]);
    expect(migrationState.migratedMessageSuppressions).toBe(true);
  });

  it('finishes without failing when the source has email campaigns disabled', async () => {
    const { client: sourceClient } = createMockGraphqlClient({});
    const { client: targetClient, calls: targetCalls } = createMockGraphqlClient({});

    await expect(migrateMessageSuppressions(sourceClient, targetClient)).resolves.toBe(true);
    expect(targetCalls).toHaveLength(0);
    expect(migrationState.migratedMessageSuppressions).toBe(true);
  });
});

describe('prepareMessageCampaignForTarget', () => {
  const topicMap = new Map([['source-topic', 'target-topic']]);

  it('turns a scheduled campaign into a draft and remaps its topic', () => {
    const counts = { rescheduleNeeded: 0, midSend: 0, unmatchedTopic: 0 };
    const data: Record<string, unknown> = { status: 'SCHEDULED', unsubscribeTopicId: 'source-topic' };

    prepareMessageCampaignForTarget(data, topicMap, counts);

    expect(data).toEqual({ status: 'DRAFT', unsubscribeTopicId: 'target-topic' });
    expect(counts.rescheduleNeeded).toBe(1);
  });

  it('keeps a mid-send campaign out of a sendable status and drops an unmatched topic', () => {
    const counts = { rescheduleNeeded: 0, midSend: 0, unmatchedTopic: 0 };
    const data: Record<string, unknown> = { status: 'SENDING', unsubscribeTopicId: 'source-topic-gone' };

    prepareMessageCampaignForTarget(data, topicMap, counts);

    expect(data).toEqual({ status: 'SENDING', unsubscribeTopicId: null });
    expect(counts).toEqual({ rescheduleNeeded: 0, midSend: 1, unmatchedTopic: 1 });
  });
});
