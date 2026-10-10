import { type AxiosInstance } from "axios";
import { findManyRecords } from "src/logic-functions/requests/find-many-records.util";
import { createManyRecords } from "src/logic-functions/requests/create-many-records.util";
import { copyFileToTargetWorkspace, SOURCE_FILE_SELECTION_SET, type SourceFile } from "src/logic-functions/utils/copy-file-to-target-workspace.util";
import { executeWithRetryAndCheckpoint } from "src/logic-functions/utils/execute-with-retry-and-checkpoint.util";
import { logger } from "src/logic-functions/utils/logger.util";
import { migrationState } from "src/logic-functions/utils/migration-state.util";
import { setObjectCursor } from "src/logic-functions/utils/set-object-cursor.util";
import { stopIfTimeBudgetExceeded } from "src/logic-functions/utils/time-budget.util";
import { RecordIdResolution, resolveTargetRecordId } from "src/logic-functions/utils/record-id-resolution.util";
import { REQUESTS_PER_ATTACHMENT, decrementEstimate } from "src/logic-functions/utils/estimate-migration-duration.util";

// The target foreign-key names are discovered at runtime from the source schema, so they can
// only be reached through the index signature; name and file are always selected.
type SourceAttachment = Record<string, unknown> & {
  name: string;
  file: SourceFile[] | null;
};

// Copies a source attachment's underlying file into the target workspace's own storage and
// only then creates the Attachment record pointing at the freshly uploaded copy.
export const migrateAttachments = async (
  sourceWorkspace: AxiosInstance,
  targetWorkspace: AxiosInstance,
  recordIds: RecordIdResolution,
): Promise<boolean> => {
  const targetFieldNameByObjectName = migrationState.attachmentTargetFieldNameByObjectName;
  const targetFileFieldId = migrationState.targetAttachmentFileFieldId;
  if (targetFileFieldId === null) {
    logger.warn('Skipping attachments: target workspace has no attachment.file field metadata id');
    decrementEstimate({ otherRecordCount: migrationState.estimate?.otherRecordCount ?? 0 });
    return true;
  }
  if (targetFieldNameByObjectName.size === 0) {
    logger.warn('Skipping attachments: source workspace has no attachment target fields');
    decrementEstimate({ otherRecordCount: migrationState.estimate?.otherRecordCount ?? 0 });
    return true;
  }

  const targetForeignKeyNames = Array.from(targetFieldNameByObjectName.values(), (fieldName) => `${fieldName}Id`);
  const selectionSet = `id
${targetForeignKeyNames.join('\n')}
name
file ${SOURCE_FILE_SELECTION_SET}`;

  // Attachments are the slowest thing to migrate (a download plus an upload each), so a large
  // workspace spans many invocations - the cursor is persisted per page to resume from.
  let createdCount = 0;
  let after: string | null = migrationState.objectRecordsToMigrate.get('attachments') ?? null;

  while (true) {
    const page = await executeWithRetryAndCheckpoint(() => findManyRecords<SourceAttachment>(sourceWorkspace, 'attachments', selectionSet, after, Math.floor(migrationState.maxRequests / 2) - 1));
    const nodes = page.edges.map((edge) => edge.node);
    if (nodes.length > 0) {
      const attachmentsToCreate: Record<string, unknown>[] = [];
      for (const attachment of nodes) {
        const attachmentId = attachment.id;
        const name = attachment.name;
        decrementEstimate({ otherRecordCount: REQUESTS_PER_ATTACHMENT });
        const sourceFile = attachment.file?.[0];
        if (sourceFile === undefined) {
          logger.warn(`Skipping attachment "${name}": no underlying file`);
          continue;
        }

        const targetFields: Record<string, unknown> = {};
        for (const fieldName of targetFieldNameByObjectName.values()) {
          const foreignKeyName = `${fieldName}Id`;
          const sourceRecordId = attachment[foreignKeyName];
          if (typeof sourceRecordId !== 'string') {
            continue;
          }
          const targetRecordId = resolveTargetRecordId(recordIds, sourceRecordId);
          if (targetRecordId === undefined) {
            logger.warn(`Attachment "${name}": dropping ${foreignKeyName} - referenced record was not migrated`);
            continue;
          }
          targetFields[foreignKeyName] = targetRecordId;
        }

        if (Object.keys(targetFields).length === 0) {
          logger.warn(`Skipping attachment "${name}": no valid target record in the target workspace`);
          continue;
        }

        try {
          const targetFile = await copyFileToTargetWorkspace(targetWorkspace, sourceFile, targetFileFieldId);

          attachmentsToCreate.push({
            id: attachmentId,
            name,
            file: [targetFile],
            ...targetFields,
          });
        } catch (error) {
          // An attachment whose file can't be downloaded/re-uploaded can't be meaningfully
          // partially migrated - skip it and move on to the rest.
          logger.warn(`Skipping attachment "${name}": ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      if (attachmentsToCreate.length > 0) {
        // Batching trades per-attachment error isolation for one request per page, so a single
        // rejected row now costs the whole page - contain it here rather than letting it abort
        // the stage, since the files themselves are already uploaded either way.
        try {
          await executeWithRetryAndCheckpoint(() => createManyRecords(targetWorkspace, 'attachments', attachmentsToCreate, new Set()));
          createdCount += attachmentsToCreate.length;
        } catch (error) {
          logger.warn(`Skipping ${attachmentsToCreate.length} attachment(s) in this page: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    if (page.pageInfo.hasNextPage === false || page.pageInfo.endCursor === null) {
      setObjectCursor('attachments', null);
      break;
    }
    after = page.pageInfo.endCursor;
    setObjectCursor('attachments', after);
    if (await stopIfTimeBudgetExceeded()) {
      return false;
    }
  }

  logger.log(`Attachments: created ${createdCount}`);
  return true;
};
