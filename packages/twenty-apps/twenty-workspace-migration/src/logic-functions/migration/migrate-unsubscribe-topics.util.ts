import type { AxiosInstance } from "axios";
import { findUnsubscribeTopics } from "src/logic-functions/requests/find-unsubscribe-topics.util";
import { createMetadataEntity } from "src/logic-functions/requests/create-metadata-entity.util";
import { executeWithRetry } from "src/logic-functions/utils/execute-with-retry.util";
import { logger } from "src/logic-functions/utils/logger.util";
import { setStateRef } from "src/logic-functions/utils/migration-state.util";
import { UnsubscribeTopic } from "src/logic-functions/types/emailing.type";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// Campaigns and suppressions both reference topics, whose ids the target generates itself, so
// topics are matched by name and the resulting id pairs drive every later remap. Email
// campaigns sit behind a feature flag and an Enterprise check on either side - when a side
// can't serve topics there is nothing to remap, which is reported rather than failing the run.
export const migrateUnsubscribeTopics = async (
  sourceWorkspace: AxiosInstance,
  targetWorkspace: AxiosInstance,
): Promise<void> => {
  let sourceTopics: UnsubscribeTopic[];
  let targetTopics: UnsubscribeTopic[];
  try {
    [sourceTopics, targetTopics] = await Promise.all([
      executeWithRetry(() => findUnsubscribeTopics(sourceWorkspace)),
      executeWithRetry(() => findUnsubscribeTopics(targetWorkspace)),
    ]);
  } catch (error) {
    logger.warn(`Skipping unsubscribe topics: ${getErrorMessage(error)}`);
    return;
  }

  const targetTopicIdByName = new Map(targetTopics.map((topic) => [topic.name ?? '', topic.id]));
  const targetUnsubscribeTopicIdBySourceId = new Map<string, string>();
  let createdCount = 0;

  for (const sourceTopic of sourceTopics) {
    const name = sourceTopic.name ?? '';
    let targetTopicId = targetTopicIdByName.get(name);
    if (targetTopicId === undefined) {
      try {
        targetTopicId = (await executeWithRetry(() => createMetadataEntity(targetWorkspace, 'createUnsubscribeTopic', 'input', 'CreateUnsubscribeTopicInput', {
          name,
          description: sourceTopic.description,
          visibility: sourceTopic.visibility,
        }))).id;
        targetTopicIdByName.set(name, targetTopicId);
        createdCount += 1;
      } catch (error) {
        logger.warn(`Skipping unsubscribe topic "${name}": ${getErrorMessage(error)}`);
        continue;
      }
    }
    targetUnsubscribeTopicIdBySourceId.set(sourceTopic.id, targetTopicId);
  }

  setStateRef('targetUnsubscribeTopicIdBySourceId', targetUnsubscribeTopicIdBySourceId);
  logger.log(`Unsubscribe topics: created ${createdCount}`);
};
