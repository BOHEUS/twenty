import { buildCoreDispatchIds } from 'src/engine/core-modules/workflow/utils/build-core-dispatch-ids.util';
import { Injectable, Logger } from '@nestjs/common';

import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'twenty-shared/application';
import {
  ObjectRecordEvent,
  type ObjectRecordCreateEvent,
  type ObjectRecordDeleteEvent,
  type ObjectRecordDestroyEvent,
  type ObjectRecordUpdateEvent,
  type ObjectRecordUpsertEvent,
} from 'twenty-shared/database-events';
import { type ObjectRecord } from 'twenty-shared/types';
import { isDefined, isNonEmptyArray } from 'twenty-shared/utils';
import { TRIGGER_STEP_ID } from 'twenty-shared/workflow';
import { In } from 'typeorm';

import { OnDatabaseBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { findActiveFlatApplicationByUniversalIdentifier } from 'src/engine/core-modules/application/utils/find-active-flat-application-by-universal-identifier.util';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { findFlatEntityByIdInFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { buildFieldMapsFromFlatObjectMetadata } from 'src/engine/metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util';
import { RecordAccessPolicyService } from 'src/engine/core-modules/record-share/services/record-access-policy.service';
import { omitInheritedReadabilityChildRecords } from 'src/engine/core-modules/record-share/utils/omit-inherited-readability-child-records.util';
import { buildRoleRowAccessPolicySubject } from 'src/engine/core-modules/record-share/utils/build-role-row-access-policy-subject.util';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-role.constant';
import { isCachedDatabaseEventTrigger } from 'src/engine/core-modules/workflow/utils/cached-workflow-automated-trigger.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { type WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';
import { WorkflowCommonWorkspaceService } from 'src/modules/workflow/common/workspace-services/workflow-common.workspace-service';
import { evaluateStepFilters } from 'src/modules/workflow/workflow-executor/workflow-actions/filter/utils/evaluate-step-filters.util';
import {
  type AutomatedTriggerSettings,
  type BaseDatabaseEventTriggerSettings,
  type UpdateEventTriggerSettings,
} from 'src/modules/workflow/workflow-trigger/automated-trigger/constants/automated-trigger-settings';
import { type CoreDispatchIds } from 'src/engine/core-modules/workflow/types/workflow-automated-trigger-maps.type';
import {
  WorkflowTriggerJob,
  type WorkflowTriggerJobData,
} from 'src/modules/workflow/workflow-trigger/jobs/workflow-trigger.job';

type DatabaseEventTriggerListener = {
  workflowId: string;
  legacyWorkflowId?: string;
  settings: AutomatedTriggerSettings;
} & CoreDispatchIds;

type TriggerEvaluationArgs = {
  eventPayload: ObjectRecordEvent;
  eventListener: DatabaseEventTriggerListener;
  action: DatabaseEventAction;
};

@Injectable()
export class WorkflowDatabaseEventTriggerListener {
  private readonly logger = new Logger(
    WorkflowDatabaseEventTriggerListener.name,
  );

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    @InjectMessageQueue(MessageQueue.workflowQueue)
    private readonly messageQueueService: MessageQueueService,
    private readonly workflowCommonWorkspaceService: WorkflowCommonWorkspaceService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly recordAccessPolicyService: RecordAccessPolicyService,
  ) {}

  @OnDatabaseBatchEvent('*', DatabaseEventAction.CREATED)
  async handleObjectRecordCreateEvent(
    payload: WorkspaceEventBatch<ObjectRecordCreateEvent>,
  ) {
    await this.handleEvent({
      payload,
      action: DatabaseEventAction.CREATED,
      getRecordsToEnrich: (event) => [event.properties.after],
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.UPDATED)
  async handleObjectRecordUpdateEvent(
    payload: WorkspaceEventBatch<ObjectRecordUpdateEvent>,
  ) {
    await this.handleEvent({
      payload,
      action: DatabaseEventAction.UPDATED,
      getRecordsToEnrich: (event) => [
        event.properties.before,
        event.properties.after,
      ],
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.DELETED)
  async handleObjectRecordDeleteEvent(
    payload: WorkspaceEventBatch<ObjectRecordDeleteEvent>,
  ) {
    await this.handleEvent({
      payload,
      action: DatabaseEventAction.DELETED,
      getRecordsToEnrich: (event) => [event.properties.before],
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.DESTROYED)
  async handleObjectRecordDestroyEvent(
    payload: WorkspaceEventBatch<ObjectRecordDestroyEvent>,
  ) {
    await this.handleEvent({
      payload,
      action: DatabaseEventAction.DESTROYED,
      getRecordsToEnrich: (event) => [event.properties.before],
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.UPSERTED)
  async handleObjectRecordUpsertEvent(
    payload: WorkspaceEventBatch<ObjectRecordUpsertEvent>,
  ) {
    await this.handleEvent({
      payload,
      action: DatabaseEventAction.UPSERTED,
      getRecordsToEnrich: (event) => [
        event.properties.before,
        event.properties.after,
      ],
    });
  }

  private async enrichRecordsWithRelations({
    records,
    workspaceId,
    objectMetadataNameSingular,
  }: {
    records: Partial<ObjectRecord>[];
    workspaceId: string;
    objectMetadataNameSingular: string;
  }) {
    const {
      flatObjectMetadata,
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
    } = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(
      objectMetadataNameSingular,
      workspaceId,
    );

    const authContext = buildSystemAuthContext(workspaceId);

    await this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const { fieldIdByJoinColumnName } = buildFieldMapsFromFlatObjectMetadata(
        flatFieldMetadataMaps,
        flatObjectMetadata,
      );

      for (const [joinColumnName, joinFieldId] of Object.entries(
        fieldIdByJoinColumnName,
      )) {
        const joinField = findFlatEntityByIdInFlatEntityMapsOrThrow({
          flatEntityMaps: flatFieldMetadataMaps,
          flatEntityId: joinFieldId,
        });

        const joinRecordIds = records
          .map((record) => record[joinColumnName])
          .filter(isDefined);

        if (joinRecordIds.length === 0) {
          continue;
        }

        const relatedObjectMetadataId =
          joinField.relationTargetObjectMetadataId;

        if (!isDefined(relatedObjectMetadataId)) {
          continue;
        }

        const relatedObjectMetadataNameSingular =
          findFlatEntityByIdInFlatEntityMaps({
            flatEntityId: relatedObjectMetadataId,
            flatEntityMaps: flatObjectMetadataMaps,
          })?.nameSingular;

        if (!isDefined(relatedObjectMetadataNameSingular)) {
          continue;
        }

        const relatedObjectRepository = this.workspaceOrmManager.getRepository(
          relatedObjectMetadataNameSingular,
          { shouldBypassPermissionChecks: true },
        );

        const relatedRecords = await relatedObjectRepository.find({
          where: { id: In(joinRecordIds) },
        });

        for (const record of records) {
          record[joinField.name] = relatedRecords.find(
            (relatedRecord) => relatedRecord.id === record[joinColumnName],
          );
        }
      }
    }, authContext);
  }

  private async shouldIgnoreEvent(
    payload: WorkspaceEventBatch<ObjectRecordEvent>,
  ) {
    const workspaceId = payload.workspaceId;
    const databaseEventName = payload.name;

    if (!workspaceId || !databaseEventName) {
      this.logger.error(
        `Missing workspaceId or eventName in payload ${JSON.stringify(
          payload,
        )}`,
      );

      return true;
    }

    return false;
  }

  private async handleEvent<TEvent extends ObjectRecordEvent>({
    payload,
    action,
    getRecordsToEnrich,
  }: {
    payload: WorkspaceEventBatch<TEvent>;
    action: DatabaseEventAction;
    getRecordsToEnrich: (
      event: TEvent,
    ) => (Partial<ObjectRecord> | undefined)[];
  }) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const workspaceId = payload.workspaceId;
    const databaseEventName = payload.name;

    const eventListeners = await this.getDatabaseEventListeners(
      workspaceId,
      databaseEventName,
    );

    if (eventListeners.length === 0) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.enrichRecordsWithRelations({
      workspaceId,
      objectMetadataNameSingular: clonedPayload.objectMetadata.nameSingular,
      records: clonedPayload.events
        .flatMap(getRecordsToEnrich)
        .filter(isDefined),
    });

    const admittedRecordIds =
      await this.resolveAdmittedRecordIds(clonedPayload);

    for (const eventListener of eventListeners) {
      for (const eventPayload of clonedPayload.events) {
        const shouldTriggerJob = this.shouldTriggerJob({
          eventPayload,
          eventListener,
          action,
          admittedRecordIds,
        });

        if (shouldTriggerJob) {
          await this.messageQueueService.add<WorkflowTriggerJobData>(
            WorkflowTriggerJob.name,
            {
              workspaceId,
              workflowId:
                eventListener.legacyWorkflowId ?? eventListener.workflowId,
              ...buildCoreDispatchIds(eventListener),
              payload: omitInheritedReadabilityChildRecords(eventPayload),
            },
            { retryLimit: 3 },
          );
        }
      }
    }
  }

  private async getDatabaseEventListeners(
    workspaceId: string,
    databaseEventName: string,
  ): Promise<DatabaseEventTriggerListener[]> {
    const { workflowAutomatedTriggerMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'workflowAutomatedTriggerMaps',
      ]);

    return Object.values(workflowAutomatedTriggerMaps.byWorkflowId).filter(
      (trigger) =>
        isCachedDatabaseEventTrigger(trigger) &&
        trigger.settings.eventName === databaseEventName,
    );
  }

  private async resolveAdmittedRecordIds(
    payload: WorkspaceEventBatch<ObjectRecordEvent>,
  ): Promise<Set<string>> {
    const {
      flatApplicationMaps,
      flatRoleMaps,
      rolesPermissions,
      roleIdsWithAllRecordsAccess,
      flatRowLevelPermissionPredicateMaps,
      flatRowLevelPermissionPredicateGroupMaps,
      flatFieldMetadataMaps,
    } = await this.workspaceCacheService.getOrRecompute(payload.workspaceId, [
      'flatApplicationMaps',
      'flatRoleMaps',
      'rolesPermissions',
      'roleIdsWithAllRecordsAccess',
      'flatRowLevelPermissionPredicateMaps',
      'flatRowLevelPermissionPredicateGroupMaps',
      'flatFieldMetadataMaps',
    ]);

    const standardApplication = findActiveFlatApplicationByUniversalIdentifier(
      flatApplicationMaps,
      TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    );

    return this.recordAccessPolicyService
      .buildEventRecordAccessGate(payload)
      .resolveAdmittedRecordIds(
        buildRoleRowAccessPolicySubject({
          roleId:
            standardApplication?.defaultRoleId ??
            findFlatEntityByUniversalIdentifier({
              flatEntityMaps: flatRoleMaps,
              universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
            })?.id,
          owningApplicationId: standardApplication?.id,
          rolesPermissions,
          roleIdsWithAllRecordsAccess,
          flatRowLevelPermissionPredicateMaps,
          flatRowLevelPermissionPredicateGroupMaps,
          flatFieldMetadataMaps,
        }),
      );
  }

  private shouldTriggerJob({
    eventPayload,
    eventListener,
    action,
    admittedRecordIds,
  }: TriggerEvaluationArgs & { admittedRecordIds: Set<string> }) {
    return (
      this.eventMatchesWatchedFields({ eventPayload, eventListener, action }) &&
      this.eventMatchesRecordFilter({ eventPayload, eventListener }) &&
      admittedRecordIds.has(eventPayload.recordId)
    );
  }

  private eventMatchesWatchedFields({
    eventPayload,
    eventListener,
    action,
  }: TriggerEvaluationArgs) {
    if (
      action === DatabaseEventAction.UPDATED ||
      action === DatabaseEventAction.UPSERTED
    ) {
      const settings = eventListener.settings as UpdateEventTriggerSettings;
      const updatedFields =
        (eventPayload as ObjectRecordUpdateEvent)?.properties?.updatedFields ??
        [];

      return (
        !settings.fields ||
        settings.fields.length === 0 ||
        settings.fields.some((field) => updatedFields.includes(field))
      );
    }

    return true;
  }

  private eventMatchesRecordFilter({
    eventPayload,
    eventListener,
  }: Pick<TriggerEvaluationArgs, 'eventPayload' | 'eventListener'>) {
    const { filter } =
      eventListener.settings as BaseDatabaseEventTriggerSettings;

    if (!isDefined(filter) || !isNonEmptyArray(filter.stepFilters)) {
      return true;
    }

    try {
      return evaluateStepFilters({
        stepFilters: filter.stepFilters,
        stepFilterGroups: filter.stepFilterGroups,
        context: { [TRIGGER_STEP_ID]: eventPayload },
      });
    } catch (error) {
      this.logger.error(
        `Failed to evaluate database-event trigger filter for workflow ${eventListener.workflowId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      return false;
    }
  }
}
