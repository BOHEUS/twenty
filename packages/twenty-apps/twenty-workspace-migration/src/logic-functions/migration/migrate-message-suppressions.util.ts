import type { AxiosInstance } from "axios";
import { findMessageSuppressions, MESSAGE_SUPPRESSIONS_PAGE_SIZE } from "src/logic-functions/requests/find-message-suppressions.util";
import { createMetadataEntity } from "src/logic-functions/requests/create-metadata-entity.util";
import { executeWithRetry } from "src/logic-functions/utils/execute-with-retry.util";
import { executeWithRetryAndCheckpoint } from "src/logic-functions/utils/execute-with-retry-and-checkpoint.util";
import { logger } from "src/logic-functions/utils/logger.util";
import { migrationState, setStateRef } from "src/logic-functions/utils/migration-state.util";
import { setObjectCursor } from "src/logic-functions/utils/set-object-cursor.util";
import { stopIfTimeBudgetExceeded } from "src/logic-functions/utils/time-budget.util";
import { decrementEstimate } from "src/logic-functions/utils/estimate-migration-duration.util";
import { MessageSuppressionPage } from "src/logic-functions/types/emailing.type";

const CURSOR_KEY = 'messageSuppressions';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// Suppression records themselves are system-writable only, so they are recreated through the
// same mutation a user's manual unsubscribe goes through. That always records an UNSUBSCRIBE:
// BOUNCE and COMPLAINT therefore come across as a topic-less unsubscribe, which still blocks
// every campaign but no longer transactional sends. TRACKING never blocks a send, and turning it
// into an unsubscribe would start blocking someone who never opted out, so it is left behind.
export const migrateMessageSuppressions = async (
  sourceWorkspace: AxiosInstance,
  targetWorkspace: AxiosInstance,
): Promise<boolean> => {
  const targetUnsubscribeTopicIdBySourceId = migrationState.targetUnsubscribeTopicIdBySourceId;
  let offset = Number(migrationState.objectRecordsToMigrate.get(CURSOR_KEY) ?? 0);
  let createdCount = 0;
  let skippedTrackingCount = 0;
  let downgradedHardBounceCount = 0;

  while (true) {
    let page: MessageSuppressionPage;
    try {
      page = await executeWithRetry(() => findMessageSuppressions(sourceWorkspace, offset));
    } catch (error) {
      // Email campaigns are behind a feature flag and an Enterprise check, so a source without
      // them has nothing to migrate here.
      logger.warn(`Skipping message suppressions: ${getErrorMessage(error)}`);
      break;
    }

    let unmatchedTopicCount = 0;
    let failedCount = 0;
    let lastFailure = '';
    for (const suppression of page.records) {
      decrementEstimate({ otherRecordCount: 1 });
      if (suppression.reason === 'TRACKING') {
        skippedTrackingCount += 1;
        continue;
      }

      const isHardSuppression = suppression.reason === 'BOUNCE' || suppression.reason === 'COMPLAINT';
      const sourceTopicId = isHardSuppression ? null : suppression.unsubscribeTopicId;
      const targetTopicId = sourceTopicId !== null ? targetUnsubscribeTopicIdBySourceId.get(sourceTopicId) : undefined;
      // Falling back to no topic over-blocks rather than under-blocks: a topic-less unsubscribe
      // stops every campaign, not just the ones on the topic that couldn't be matched.
      if (sourceTopicId !== null && targetTopicId === undefined) {
        unmatchedTopicCount += 1;
      }

      try {
        await executeWithRetryAndCheckpoint(() => createMetadataEntity(targetWorkspace, 'createMessageSuppression', 'input', 'CreateMessageSuppressionInput', {
          emailAddress: suppression.emailAddress,
          unsubscribeTopicId: targetTopicId ?? null,
        }));
        createdCount += 1;
        if (isHardSuppression) {
          downgradedHardBounceCount += 1;
        }
      } catch (error) {
        failedCount += 1;
        lastFailure = getErrorMessage(error);
      }
    }
    if (unmatchedTopicCount > 0) {
      logger.warn(`Message suppressions: ${unmatchedTopicCount} in this page had an unsubscribe topic missing from the target - recreated as unsubscribes from every campaign`);
    }
    if (failedCount > 0) {
      logger.warn(`Message suppressions: failed to recreate ${failedCount} in this page: ${lastFailure}`);
    }

    offset += page.records.length;
    if (page.records.length < MESSAGE_SUPPRESSIONS_PAGE_SIZE || offset >= page.totalCount) {
      setObjectCursor(CURSOR_KEY, null);
      break;
    }
    setObjectCursor(CURSOR_KEY, String(offset));
    if (await stopIfTimeBudgetExceeded()) {
      return false;
    }
  }

  if (skippedTrackingCount > 0) {
    logger.warn(`Message suppressions: left out ${skippedTrackingCount} tracking opt-out(s) - they can't be recreated without blocking sends`);
  }
  if (downgradedHardBounceCount > 0) {
    logger.warn(`Message suppressions: ${downgradedHardBounceCount} bounce/complaint suppression(s) recreated as unsubscribes - they block campaigns but no longer transactional emails`);
  }
  setStateRef('migratedMessageSuppressions', true);
  logger.log(`Message suppressions: created ${createdCount}`);
  return true;
};
