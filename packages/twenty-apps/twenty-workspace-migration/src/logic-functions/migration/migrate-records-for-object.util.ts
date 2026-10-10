import { AxiosInstance } from "axios";
import { fieldsToOmitFromRecordMigration } from "src/constants/to-omit";
import { buildRecordFieldPlan } from "src/logic-functions/utils/build-record-field-plan.util";
import { findManyRecords } from "src/logic-functions/requests/find-many-records.util";
import { createManyRecords } from "src/logic-functions/requests/create-many-records.util";
import { ObjectType } from "src/logic-functions/types/find-objects-fields.type";
import { buildRecordDataToCreate, type DroppedRelationCounts } from "src/logic-functions/utils/build-record-data-to-create.util";
import { RecordIdResolution } from "src/logic-functions/utils/record-id-resolution.util";
import { logger } from "src/logic-functions/utils/logger.util";
import { executeWithRetryAndCheckpoint } from "src/logic-functions/utils/execute-with-retry-and-checkpoint.util";
import { executeWithRetry } from "src/logic-functions/utils/execute-with-retry.util";
import { migrationState } from "src/logic-functions/utils/migration-state.util";
import { setObjectCursor } from "src/logic-functions/utils/set-object-cursor.util";
import { stopIfTimeBudgetExceeded } from "src/logic-functions/utils/time-budget.util";
import { decrementEstimate } from "src/logic-functions/utils/estimate-migration-duration.util";
import { copyFileToTargetWorkspace, type SourceFile } from "src/logic-functions/utils/copy-file-to-target-workspace.util";
import {
  type MessageCampaignPreparationCounts,
  prepareMessageCampaignForTarget
} from "src/logic-functions/utils/prepare-message-campaign-for-target.util";

// A FILES value that can't be copied is left out of the payload rather than written verbatim,
// since the source file ids would point at nothing in the target workspace.
const copyRecordFiles = async (
  targetWorkspace: AxiosInstance,
  data: Record<string, unknown>,
  targetFieldIdByFilesDataKey: Map<string, string | undefined>,
  warningContext: string,
): Promise<void> => {
  for (const [dataKey, targetFieldId] of targetFieldIdByFilesDataKey) {
    const sourceFiles = data[dataKey];
    delete data[dataKey];
    if (targetFieldId === undefined || !Array.isArray(sourceFiles) || sourceFiles.length === 0) {
      continue;
    }

    try {
      const targetFiles: { fileId: string; label: string }[] = [];
      for (const sourceFile of sourceFiles as SourceFile[]) {
        targetFiles.push(await copyFileToTargetWorkspace(targetWorkspace, sourceFile, targetFieldId));
      }
      data[dataKey] = targetFiles;
    } catch (error) {
      logger.warn(`Dropping "${dataKey}" files on ${warningContext}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const logMessageCampaignPreparation = ({ rescheduleNeeded, midSend, unmatchedTopic }: MessageCampaignPreparationCounts): void => {
  if (rescheduleNeeded > 0) {
    logger.warn(`Message campaigns: ${rescheduleNeeded} scheduled campaign(s) copied as drafts - reschedule them in the target workspace`);
  }
  if (midSend > 0) {
    logger.warn(`Message campaigns: ${midSend} campaign(s) were mid-send in the source and stay in SENDING - they won't be sent again from the target`);
  }
  if (unmatchedTopic > 0) {
    logger.warn(`Message campaigns: ${unmatchedTopic} campaign(s) lost their unsubscribe topic - it couldn't be matched in the target workspace`);
  }
};

export const migrateRecordsForObject = async (
  sourceWorkspace: AxiosInstance,
  targetWorkspace: AxiosInstance,
  sourceObject: ObjectType,
  recordIds: RecordIdResolution,
): Promise<true | void> => {
  const plan = buildRecordFieldPlan(sourceObject.fieldsList, fieldsToOmitFromRecordMigration);
  const enumDataKeys = new Set(plan.enumDataKeys);
  const relationForeignKeyNames = new Set(plan.relationForeignKeyNames);
  const targetFieldIdByFilesDataKey = new Map(
    Array.from(plan.filesSourceFieldIdByDataKey, ([dataKey, sourceFieldId]) => [dataKey, migrationState.targetFieldIdBySourceFieldId.get(sourceFieldId)] as const),
  );
  for (const [dataKey, targetFieldId] of targetFieldIdByFilesDataKey) {
    if (targetFieldId === undefined) {
      logger.warn(`Dropping "${dataKey}" files on every ${sourceObject.nameSingular} record: no matching field in the target workspace`);
    }
  }
  // Every file costs a download plus three upload requests, so pages holding them are kept as
  // small as attachment pages.
  const pageSize = targetFieldIdByFilesDataKey.size > 0 ? Math.floor(migrationState.maxRequests / 2) - 1 : undefined;

  // An object can hold far more records than one invocation's time budget allows, so the cursor
  // is persisted after every page and the walk resumes from it on the next invocation.
  let after: string | null = migrationState.objectRecordsToMigrate.get(sourceObject.namePlural) ?? null;
  let migratedRecords = 0;

  while (true) {
    const page = await executeWithRetry(() => findManyRecords(sourceWorkspace, sourceObject.namePlural, plan.selectionSet, after, pageSize));
    const nodes = page.edges.map((edge) => edge.node);

    if (nodes.length > 0) {
      const droppedRelationCounts: DroppedRelationCounts = new Map();
      const dataToCreate = nodes.map((node) =>
        buildRecordDataToCreate(node, plan.dataKeys, relationForeignKeyNames, recordIds, droppedRelationCounts),
      );
      for (const [index, data] of dataToCreate.entries()) {
        await copyRecordFiles(targetWorkspace, data, targetFieldIdByFilesDataKey, `${sourceObject.nameSingular} ${nodes[index].id}`);
      }
      if (sourceObject.nameSingular === 'messageCampaign') {
        const counts: MessageCampaignPreparationCounts = { rescheduleNeeded: 0, midSend: 0, unmatchedTopic: 0 };
        for (const data of dataToCreate) {
          prepareMessageCampaignForTarget(data, migrationState.targetUnsubscribeTopicIdBySourceId, counts);
        }
        logMessageCampaignPreparation(counts);
      }
      const created = await executeWithRetryAndCheckpoint(() =>
        createManyRecords(targetWorkspace, sourceObject.namePlural, dataToCreate, enumDataKeys),
      );

      // Every later relation remap assumes the target kept the source id, so a server that
      // stopped honouring the id we send would silently produce references to nothing.
      const createdIds = new Set(created.map((record) => record.id));
      for (const node of nodes) {
        const sourceRecordId = node.id;
        if (createdIds.has(sourceRecordId) === false) {
          throw new Error(`Record ${sourceRecordId} was created under a different id in the target workspace`);
        }
        recordIds.migratedRecordIds.add(sourceRecordId);
      }
      migratedRecords += nodes.length;
      decrementEstimate({ batchableRecordCount: nodes.length });

      for (const [foreignKeyName, count] of droppedRelationCounts) {
        logger.warn(`Dropped "${foreignKeyName}" on ${count} ${sourceObject.nameSingular} record(s) in this page: referenced record not migrated yet`);
      }
    }

    if (page.pageInfo.hasNextPage === false || page.pageInfo.endCursor === null) {
      setObjectCursor(sourceObject.namePlural, null);
      break;
    }
    after = page.pageInfo.endCursor;
    setObjectCursor(sourceObject.namePlural, after);
    if (await stopIfTimeBudgetExceeded()) {
      return true;
    }
  }

  logger.log(`Migrated ${migratedRecords} record(s) for ${sourceObject.nameSingular}`);
};