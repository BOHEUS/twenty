import {
  migrationState,
  saveMigrationStateCheckpointAndStop,
  setStateRef
} from "src/logic-functions/utils/migration-state.util";
import { chunk } from "src/logic-functions/utils/chunk.util";
import { updateOneObject } from "src/logic-functions/requests/update-one-object.util";
import { updateOneField } from "src/logic-functions/requests/update-one-field.util";
import { createOneField } from "src/logic-functions/requests/create-one-field.util";
import { AxiosInstance } from "axios";
import { extractNodes } from "src/logic-functions/utils/extract-nodes.util";
import { FindAllObjectsAndFields } from "src/logic-functions/requests/find-all-objects-and-fields.util";
import { stopIfTimeBudgetExceeded } from "src/logic-functions/utils/time-budget.util";
import { executeWithRetryAndCheckpoint } from "src/logic-functions/utils/execute-with-retry-and-checkpoint.util";
import { getManyToOneRelationTargets } from "src/logic-functions/utils/get-many-to-one-relation-targets.util";
import { migrateUnsubscribeTopics } from "src/logic-functions/migration/migrate-unsubscribe-topics.util";

const ATTACHMENT_TARGET_FIELD_NAME_PREFIX = 'target';

export const stage2 = async (sourceWorkspace: AxiosInstance, targetWorkspace: AxiosInstance) => {
  const objectsToUpdate = migrationState.objectsToUpdate;
  const fieldsToUpdate = migrationState.fieldsToUpdate;
  const fieldsToCreate = migrationState.fieldsToCreate;

  if (objectsToUpdate.length > 0) {
    const objectChunks = chunk(objectsToUpdate, migrationState.maxRequests);
    for (let index = 0; index < objectChunks.length; index += 1) {
      for (const object of objectChunks[index]) {
        await executeWithRetryAndCheckpoint(() => updateOneObject(targetWorkspace, object));
      }
      setStateRef('objectsToUpdate', objectsToUpdate.slice((index + 1) * migrationState.maxRequests));
      if (await stopIfTimeBudgetExceeded()) {
        return;
      }
    }
  }

  if (fieldsToUpdate.length > 0) {
    const fieldsToUpdateChunks = chunk(fieldsToUpdate, migrationState.maxRequests);
    for (let index = 0; index < fieldsToUpdateChunks.length; index += 1) {
      for (const field of fieldsToUpdateChunks[index]) {
        await executeWithRetryAndCheckpoint(() => updateOneField(targetWorkspace, field));
      }
      setStateRef('fieldsToUpdate', fieldsToUpdate.slice((index + 1) * migrationState.maxRequests));
      if (await stopIfTimeBudgetExceeded()) {
        return;
      }
    }
  }

  if (fieldsToCreate.length > 0) {
    // The persisted list only shrinks once per chunk, so a resumed run can replay fields an
    // earlier invocation already created - and the server rejects a duplicate field name.
    const { data: currentTargetSchema } = await executeWithRetryAndCheckpoint(() => FindAllObjectsAndFields(targetWorkspace));
    const existingTargetFieldKeys = new Set(
      extractNodes(currentTargetSchema.objects).flatMap((object) => object.fieldsList.map((field) => `${object.id}::${field.name}`)),
    );
    const pendingFieldsToCreate = fieldsToCreate.filter((field) => existingTargetFieldKeys.has(`${field.objectMetadataId}::${field.name}`) === false);
    const fieldsToCreateChunks = chunk(pendingFieldsToCreate, migrationState.maxRequests);
    for (let index = 0; index < fieldsToCreateChunks.length; index += 1) {
      for (const field of fieldsToCreateChunks[index]) {
        await executeWithRetryAndCheckpoint(() => createOneField(targetWorkspace, field));
      }
      setStateRef('fieldsToCreate', pendingFieldsToCreate.slice((index + 1) * migrationState.maxRequests));
      if (await stopIfTimeBudgetExceeded()) {
        return;
      }
    }
  }

  const extractedSourceWorkspaceObjects = migrationState.sourceWorkspaceObjects;
  const { data: refetchedTargetWorkspaceObjectsFields } = await executeWithRetryAndCheckpoint(() => FindAllObjectsAndFields(targetWorkspace));
  const refetchedTargetObjectsByNameSingular = new Map(
    extractNodes(refetchedTargetWorkspaceObjectsFields.objects).map((object) => [object.nameSingular, object]),
  );
  const targetObjectIdBySourceObjectId = new Map<string, string>();
  const targetFieldIdBySourceFieldId = new Map<string, string>();
  for (const sourceObject of extractedSourceWorkspaceObjects) {
    const targetObject = refetchedTargetObjectsByNameSingular.get(sourceObject.nameSingular);
    if (targetObject === undefined) {
      continue;
    }
    targetObjectIdBySourceObjectId.set(sourceObject.id, targetObject.id);

    const targetFieldIdByName = new Map(targetObject.fieldsList.map((field) => [field.name, field.id]));
    for (const sourceField of sourceObject.fieldsList) {
      const targetFieldId = targetFieldIdByName.get(sourceField.name);
      if (targetFieldId !== undefined) {
        targetFieldIdBySourceFieldId.set(sourceField.id, targetFieldId);
      }
    }
  }
  // Groundwork for stage 8 - attachments
  const isSourceObjectSystemByNameSingular = new Map(extractedSourceWorkspaceObjects.map((object) => [object.nameSingular, object.isSystem]));
  const sourceAttachmentObject = extractedSourceWorkspaceObjects.find((object) => object.nameSingular === 'attachment');
  const attachmentTargetFieldNameByObjectName = new Map<string, string>();
  const attachmentTargets = (sourceAttachmentObject?.fieldsList ?? []).flatMap(getManyToOneRelationTargets);
  for (const { fieldName, targetNameSingular } of attachmentTargets) {
    if (!fieldName.startsWith(ATTACHMENT_TARGET_FIELD_NAME_PREFIX)) {
      continue;
    }
    // undefined for a target object that wasn't part of the source snapshot - treated the same
    // as isSystem: true, i.e. excluded either way.
    if (isSourceObjectSystemByNameSingular.get(targetNameSingular) !== false) {
      continue;
    }
    attachmentTargetFieldNameByObjectName.set(targetNameSingular, fieldName);
  }
  const targetAttachmentObject = refetchedTargetObjectsByNameSingular.get('attachment');
  const targetAttachmentFileFieldId = targetAttachmentObject?.fieldsList.find((field) => field.name === 'file')?.id ?? null;
  setStateRef('attachmentTargetFieldNameByObjectName', attachmentTargetFieldNameByObjectName);
  setStateRef('targetAttachmentFileFieldId', targetAttachmentFileFieldId);
  setStateRef('targetObjectIdBySourceObjectId', targetObjectIdBySourceObjectId);
  setStateRef('targetFieldIdBySourceFieldId', targetFieldIdBySourceFieldId);
  setStateRef('targetWorkspaceObjects', extractNodes(refetchedTargetWorkspaceObjectsFields.objects))
  // Campaigns migrated with the records in stage 3 already need their topic resolved.
  await migrateUnsubscribeTopics(sourceWorkspace, targetWorkspace);
  setStateRef('stage', 3)
  await saveMigrationStateCheckpointAndStop();
}