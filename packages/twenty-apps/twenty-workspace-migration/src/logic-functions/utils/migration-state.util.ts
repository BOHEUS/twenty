import { kv } from 'twenty-sdk/logic-function';
import { MigrationState } from "src/logic-functions/types/migration-state.type";
import { getRecentLogs, logger, setRecentLogs } from "src/logic-functions/utils/logger.util";
import { triggerWorkspaceMigration } from "src/logic-functions/utils/trigger-workspace-migration.util";
import { isRunLockActive } from "src/logic-functions/utils/run-lock.util";

const MIGRATION_STATE_KV_KEY = 'migrationState';
// Kept apart from the state so the status page, which polls every few seconds, never pulls the
// schema snapshot and the migrated record ids along with it.
const MIGRATION_STATUS_KV_KEY = 'migrationStatus';
// The migrated record id set grows with the workspace (~40MB at a million records), so it's
// persisted in fixed-size chunks in insertion order: a checkpoint only rewrites the chunks that
// gained ids since the last one instead of the whole set.
const MIGRATED_RECORD_IDS_KV_KEY_PREFIX = 'migratedRecordIds:';
const MIGRATED_RECORD_IDS_CHUNK_SIZE = 50_000;

const migratedRecordIdsKvKey = (chunkIndex: number): string => `${MIGRATED_RECORD_IDS_KV_KEY_PREFIX}${chunkIndex}`;

let persistedMigratedRecordIdCount = 0;

const createInitialMigrationState = (): MigrationState => ({
  stage: 1,
  maxRequests: 50, // assuming lower bound
  sourceWorkspaceObjects: [],
  targetWorkspaceObjects: [],
  objectsToUpdate: [],
  fieldsToCreate: [],
  fieldsToUpdate: [],
  workspaceMemberIdMap: new Map(),
  migratedRecordIds: new Set(),
  targetObjectIdBySourceObjectId: new Map(),
  targetFieldIdBySourceFieldId: new Map(),
  objectRecordsToMigrate: new Map(),
  reconciliationObjectIndex: 0,
  recordMigrationIndex: 0,
  targetViewIdBySourceViewId: new Map(),
  targetPageLayoutIdBySourcePageLayoutId: new Map(),
  attachmentTargetFieldNameByObjectName: new Map(),
  targetAttachmentFileFieldId: null,
  migratedNavigationMenuItems: false,
  migratedSkills: false,
  migratedWebhooks: false,
  migratedRoles: false,
  targetUnsubscribeTopicIdBySourceId: new Map(),
  migratedMessageSuppressions: false,
  estimate: null,
});

export const migrationState: MigrationState = createInitialMigrationState();

export const setStateRef = <K extends keyof MigrationState>(key: K, value: MigrationState[K]): void => {
  migrationState[key] = value;
};

const serializeMigrationState = (migratedRecordIdChunkCount: number): SerializedMigrationState => ({
  ...migrationState,
  workspaceMemberIdMap: Object.fromEntries(migrationState.workspaceMemberIdMap),
  migratedRecordIds: undefined,
  migratedRecordIdChunkCount,
  targetObjectIdBySourceObjectId: Object.fromEntries(migrationState.targetObjectIdBySourceObjectId),
  targetFieldIdBySourceFieldId: Object.fromEntries(migrationState.targetFieldIdBySourceFieldId),
  objectRecordsToMigrate: Object.fromEntries(migrationState.objectRecordsToMigrate),
  targetViewIdBySourceViewId: Object.fromEntries(migrationState.targetViewIdBySourceViewId),
  targetPageLayoutIdBySourcePageLayoutId: Object.fromEntries(migrationState.targetPageLayoutIdBySourcePageLayoutId),
  attachmentTargetFieldNameByObjectName: Object.fromEntries(migrationState.attachmentTargetFieldNameByObjectName),
  targetUnsubscribeTopicIdBySourceId: Object.fromEntries(migrationState.targetUnsubscribeTopicIdBySourceId),
});

type SerializedMigrationState = Omit<
  MigrationState,
  'workspaceMemberIdMap' | 'migratedRecordIds' | 'targetObjectIdBySourceObjectId' | 'targetFieldIdBySourceFieldId' | 'objectRecordsToMigrate' | 'targetViewIdBySourceViewId' | 'targetPageLayoutIdBySourcePageLayoutId' | 'attachmentTargetFieldNameByObjectName' | 'targetUnsubscribeTopicIdBySourceId'
> & {
  workspaceMemberIdMap: Record<string, string>;
  // Spreading migrationState would otherwise carry the live Set into the payload.
  migratedRecordIds: undefined;
  migratedRecordIdChunkCount: number;
  targetObjectIdBySourceObjectId: Record<string, string>;
  targetFieldIdBySourceFieldId: Record<string, string>;
  objectRecordsToMigrate: Record<string, string>;
  targetViewIdBySourceViewId: Record<string, string>;
  targetPageLayoutIdBySourcePageLayoutId: Record<string, string>;
  attachmentTargetFieldNameByObjectName: Record<string, string>;
  targetUnsubscribeTopicIdBySourceId: Record<string, string>;
};

type MigrationStatus = {
  stage: number;
  estimate: MigrationState['estimate'];
  // Not part of MigrationState itself - logger.util.ts owns the live buffer so it stays a
  // self-contained module with no dependency on migration-state.util.ts.
  logs: string[];
};

export const saveMigrationStateCheckpointAndStop = async (): Promise<void> => {
  await saveMigrationStateCheckpoint();

  // Kept separate from the save so a failed self re-trigger isn't reported as a failed save,
  // and re-saved afterwards because the warning lands in the log buffer only after the save
  // above already snapshotted it - without this the operator sees a stalled migration with no
  // recorded reason.
  try {
    await triggerWorkspaceMigration();
  } catch (error) {
    logger.error(`Migration stopped: failed to trigger the next invocation - ${error instanceof Error ? error.message : String(error)}`);
    await saveMigrationStateCheckpoint();
  }
};

// Chunks are written before the state that counts them, so a save interrupted halfway leaves
// the previous state pointing at chunks that only ever gained ids of records that do exist.
const persistMigratedRecordIds = async (): Promise<number> => {
  const migratedRecordIds = Array.from(migrationState.migratedRecordIds);
  const chunkCount = Math.ceil(migratedRecordIds.length / MIGRATED_RECORD_IDS_CHUNK_SIZE);
  const firstChangedChunkIndex = Math.floor(persistedMigratedRecordIdCount / MIGRATED_RECORD_IDS_CHUNK_SIZE);

  for (let chunkIndex = firstChangedChunkIndex; chunkIndex < chunkCount; chunkIndex += 1) {
    await kv.set(
      migratedRecordIdsKvKey(chunkIndex),
      migratedRecordIds.slice(chunkIndex * MIGRATED_RECORD_IDS_CHUNK_SIZE, (chunkIndex + 1) * MIGRATED_RECORD_IDS_CHUNK_SIZE),
    );
  }
  persistedMigratedRecordIdCount = migratedRecordIds.length;

  return chunkCount;
};

export const saveMigrationStateCheckpoint = async (): Promise<void> => {
  try {
    const migratedRecordIdChunkCount = await persistMigratedRecordIds();
    await kv.set(MIGRATION_STATE_KV_KEY, serializeMigrationState(migratedRecordIdChunkCount));
    await kv.set<MigrationStatus>(MIGRATION_STATUS_KV_KEY, {
      stage: migrationState.stage,
      estimate: migrationState.estimate,
      logs: getRecentLogs(),
    });
  }
  catch (error) {
    logger.warn(`Failed to save migration state checkpoint: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export type MigrationStatusSnapshot = MigrationStatus & {
  isRunning: boolean;
};

export const readMigrationStatusSnapshot = async (): Promise<MigrationStatusSnapshot> => {
  try {
    const [status, isRunning] = await Promise.all([
      kv.get<MigrationStatus>(MIGRATION_STATUS_KV_KEY),
      isRunLockActive(),
    ]);
    return { ...(status ?? { stage: 1, estimate: null, logs: [] }), isRunning };
  } catch (error) {
    logger.warn(`Failed to read migration status: ${error instanceof Error ? error.message : String(error)}`);
    return { stage: migrationState.stage, estimate: migrationState.estimate, logs: [], isRunning: false };
  }
};

// Starts the next run from stage 1. Callers must make sure no run is in progress, or its next
// checkpoint would write the old state back.
export const clearMigrationState = async (): Promise<void> => {
  const saved = await kv.get<SerializedMigrationState>(MIGRATION_STATE_KV_KEY);
  for (let chunkIndex = 0; chunkIndex < (saved?.migratedRecordIdChunkCount ?? 0); chunkIndex += 1) {
    await kv.delete(migratedRecordIdsKvKey(chunkIndex));
  }
  await kv.delete(MIGRATION_STATE_KV_KEY);
  await kv.delete(MIGRATION_STATUS_KV_KEY);
};

export const loadMigrationStateCheckpoint = async (): Promise<void> => {
  try {
    const [saved, status] = await Promise.all([
      kv.get<SerializedMigrationState>(MIGRATION_STATE_KV_KEY),
      kv.get<MigrationStatus>(MIGRATION_STATUS_KV_KEY),
    ]);
    if (saved === null) {
      // A warm container keeps module state between invocations, so after a reset the previous
      // run's state would otherwise carry over.
      Object.assign(migrationState, createInitialMigrationState());
      persistedMigratedRecordIdCount = 0;
      setRecentLogs([]);
      return;
    }
    const migratedRecordIdChunks = await Promise.all(
      Array.from({ length: saved.migratedRecordIdChunkCount }, (_, chunkIndex) => kv.get<string[]>(migratedRecordIdsKvKey(chunkIndex))),
    );
    migrationState.stage = saved.stage;
    migrationState.maxRequests = saved.maxRequests;
    migrationState.sourceWorkspaceObjects = saved.sourceWorkspaceObjects;
    migrationState.targetWorkspaceObjects = saved.targetWorkspaceObjects;
    migrationState.objectsToUpdate = saved.objectsToUpdate;
    migrationState.fieldsToCreate = saved.fieldsToCreate;
    migrationState.fieldsToUpdate = saved.fieldsToUpdate;
    migrationState.recordMigrationIndex = saved.recordMigrationIndex;
    migrationState.workspaceMemberIdMap = new Map(Object.entries(saved.workspaceMemberIdMap));
    migrationState.migratedRecordIds = new Set(migratedRecordIdChunks.flatMap((chunk) => chunk ?? []));
    persistedMigratedRecordIdCount = migrationState.migratedRecordIds.size;
    migrationState.targetObjectIdBySourceObjectId = new Map(Object.entries(saved.targetObjectIdBySourceObjectId));
    migrationState.targetFieldIdBySourceFieldId = new Map(Object.entries(saved.targetFieldIdBySourceFieldId));
    migrationState.objectRecordsToMigrate = new Map(Object.entries(saved.objectRecordsToMigrate));
    migrationState.reconciliationObjectIndex = saved.reconciliationObjectIndex;
    migrationState.targetViewIdBySourceViewId = new Map(Object.entries(saved.targetViewIdBySourceViewId));
    migrationState.targetPageLayoutIdBySourcePageLayoutId = new Map(Object.entries(saved.targetPageLayoutIdBySourcePageLayoutId));
    migrationState.attachmentTargetFieldNameByObjectName = new Map(Object.entries(saved.attachmentTargetFieldNameByObjectName));
    migrationState.targetAttachmentFileFieldId = saved.targetAttachmentFileFieldId;
    migrationState.migratedNavigationMenuItems = saved.migratedNavigationMenuItems;
    migrationState.migratedSkills = saved.migratedSkills;
    migrationState.migratedWebhooks = saved.migratedWebhooks;
    migrationState.migratedRoles = saved.migratedRoles;
    migrationState.targetUnsubscribeTopicIdBySourceId = new Map(Object.entries(saved.targetUnsubscribeTopicIdBySourceId));
    migrationState.migratedMessageSuppressions = saved.migratedMessageSuppressions;
    migrationState.estimate = saved.estimate;
    setRecentLogs(status?.logs ?? []);
  } catch (error) {
    logger.warn(`Failed to load migration state checkpoint: ${error instanceof Error ? error.message : String(error)}`);
  }
};
