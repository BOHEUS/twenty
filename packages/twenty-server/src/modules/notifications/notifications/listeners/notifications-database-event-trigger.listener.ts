import { Injectable, Logger } from '@nestjs/common';

import {
  type ObjectRecordCreateEvent,
  type ObjectRecordDeleteEvent,
  type ObjectRecordDestroyEvent,
  type ObjectRecordNonDestructiveEvent,
  ObjectRecordRestoreEvent,
  type ObjectRecordUpdateEvent,
  type ObjectRecordUpsertEvent,
} from 'twenty-shared/database-events';
import { Raw } from 'typeorm';

import { OnDatabaseBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';
import {
  WorkflowTriggerJob,
  type WorkflowTriggerJobData,
} from 'src/modules/workflow/workflow-trigger/jobs/workflow-trigger.job';
import { NotificationsSettingsWorkspaceEntity } from 'src/modules/notifications/notifications-settings/standard-objects/notifications-settings.workspace-entity';
import {
  UpdateEventTriggerSettings
} from 'src/modules/workflow/workflow-trigger/automated-trigger/constants/automated-trigger-settings';
import {
  NotificationTriggerJob,
  NotificationTriggerJobData,
} from 'src/modules/notifications/notifications/jobs/notifications-trigger.job';

const objectsNotForUpdate: string[] = [
  'attachments',
  'blocklists',
  'calendarEvents',
  'calendarChannels',
  'calendarChannelEventAssociations',
  'calendarEventParticipants',
  'connectedAccounts',
  'favoriteFolders',
  'favorites',
  'messages',
  'messageParticipants',
  'messageThreads',
  'messageChannelMessageAssociations',
  'messageChannels',
  'messageFolders',
  'notifications',
  'notificationSettings',
  'noteTargets',
  'taskTargets',
  'timelineActivities',
  'views',
  'viewFields',
  'viewFilters',
  'viewFilterGroups',
  'viewSorts',
  'viewGroups',
  'workflows',
  'workflowAutomatedTriggers',
  'workflowRuns',
  'workflowVersions',
  'workspaceMembers',
];

@Injectable()
export class NotificationsDatabaseEventTriggerListener {
  private readonly logger = new Logger(
    NotificationsDatabaseEventTriggerListener.name,
  );

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectMessageQueue(MessageQueue.workflowQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnDatabaseBatchEvent('*', DatabaseEventAction.CREATED)
  async handleObjectRecordCreateEvent(
    payload: WorkspaceEventBatch<ObjectRecordCreateEvent>,
  ) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.handleEvent({
      payload: clonedPayload,
      action: DatabaseEventAction.CREATED,
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.UPDATED)
  async handleObjectRecordUpdateEvent(
    payload: WorkspaceEventBatch<ObjectRecordUpdateEvent>,
  ) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.handleEvent({
      payload: clonedPayload,
      action: DatabaseEventAction.UPDATED,
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.DELETED)
  async handleObjectRecordDeleteEvent(
    payload: WorkspaceEventBatch<ObjectRecordDeleteEvent>,
  ) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.handleEvent({
      payload: clonedPayload,
      action: DatabaseEventAction.DELETED,
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.DESTROYED)
  async handleObjectRecordDestroyEvent(
    payload: WorkspaceEventBatch<ObjectRecordDestroyEvent>,
  ) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.handleEvent({
      payload: clonedPayload,
      action: DatabaseEventAction.DESTROYED,
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.UPSERTED)
  async handleObjectRecordUpsertEvent(
    payload: WorkspaceEventBatch<ObjectRecordUpsertEvent>,
  ) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.handleEvent({
      payload: clonedPayload,
      action: DatabaseEventAction.UPSERTED,
    });
  }

  @OnDatabaseBatchEvent('*', DatabaseEventAction.RESTORED)
  async handleObjectRecordRestoreEvent(
    payload: WorkspaceEventBatch<ObjectRecordRestoreEvent>,
  ) {
    if (await this.shouldIgnoreEvent(payload)) {
      return;
    }

    const clonedPayload = structuredClone(payload);

    await this.handleEvent({
      payload: clonedPayload,
      action: DatabaseEventAction.RESTORED,
    });
  }

  private async shouldIgnoreEvent(
    payload:
      | WorkspaceEventBatch<ObjectRecordNonDestructiveEvent>
      | WorkspaceEventBatch<ObjectRecordDestroyEvent>,
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

    return objectsNotForUpdate.includes(payload.objectMetadata.namePlural);
  }

  private async handleEvent({
    payload,
    action,
  }: {
    payload: WorkspaceEventBatch<ObjectRecordNonDestructiveEvent> | WorkspaceEventBatch<ObjectRecordDestroyEvent>;
    action: DatabaseEventAction;
  }) {
    const workspaceId = payload.workspaceId;
    const databaseEventName = payload.name;
    const notificationSettingsTableName = 'notificationSettings';

    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationsSettingsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsSettingsWorkspaceEntity>(
            workspaceId,
            notificationSettingsTableName,
            { shouldBypassPermissionChecks: true },
          );

        const eventListeners =
          await notificationsSettingsRepository.find({
            where: {
              settings: Raw(
                () =>
                  `"${notificationSettingsTableName}"."settings"->>'eventName' = :eventName`,
                { eventName: databaseEventName },
              ),
            },
          });

        for (const eventListener of eventListeners) {
          for (const eventPayload of payload.events) {
            const shouldTriggerJob = this.shouldTriggerJob({
              eventListener,
              action,
            });

            if (shouldTriggerJob) {
              await this.messageQueueService.add<NotificationTriggerJobData>(
                NotificationTriggerJob.name,
                {
                  workspaceId,
                  recipientId: eventListener.createdById,
                  objectSingularName: payload.objectMetadata.nameSingular,
                  payload: eventPayload,
                  action
                },
                { retryLimit: 3 },
              );
            }
          }
        }
      },
    );
  }

  private shouldTriggerJob({
    eventListener,
    action,
  }: {
    eventListener: NotificationsSettingsWorkspaceEntity;
    action: DatabaseEventAction;
  }) {
    if (action === DatabaseEventAction.UPDATED) {
      const settings = eventListener.settings;

      return (
        !settings ||
        settings.length === 0
      );
    }

    if (action === DatabaseEventAction.UPSERTED) {
      const settings = eventListener.settings;

      return (
        !settings ||
        settings.length === 0
      );
    }

    return true;
  }
}
