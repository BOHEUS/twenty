import { Scope } from '@nestjs/common';

import {
  ObjectRecordCreateEvent,
  ObjectRecordDeleteEvent,
  ObjectRecordDestroyEvent,
  ObjectRecordNonDestructiveEvent,
  ObjectRecordRestoreEvent,
  ObjectRecordUpdateEvent,
  ObjectRecordUpsertEvent,
} from 'twenty-shared/database-events';

import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import {
  NotificationsWorkspaceEntity,
  NotificationType,
} from 'src/modules/notifications/notifications/standard-objects/notifications.workspace-entity';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';

export type NotificationTriggerJobData = {
  workspaceId: string;
  recipientId: string;
  objectSingularName: string;
  payload: ObjectRecordNonDestructiveEvent | ObjectRecordDestroyEvent;
  action: DatabaseEventAction;
};

@Processor({ queueName: MessageQueue.notificationQueue, scope: Scope.REQUEST })
export class NotificationTriggerJob {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  @Process(NotificationTriggerJob.name)
  async handle(data: NotificationTriggerJobData): Promise<void> {
    const authContext = buildSystemAuthContext(data.workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsWorkspaceEntity>(
            data.workspaceId,
            'workflow',
            { shouldBypassPermissionChecks: true },
          );
      },
    );
  }

  private getData(
    recipientId: string,
    action: DatabaseEventAction,
    payload: ObjectRecordNonDestructiveEvent | ObjectRecordDestroyEvent,
    objectSingularName: string,
  ) {
    let body = '';

    switch (action) {
      case DatabaseEventAction.CREATED: {
        payload = payload as ObjectRecordCreateEvent;
        const creator = payload.properties.after;

        body = `${creator} created new ${objectSingularName}`;

        break;
      }
      case DatabaseEventAction.DELETED: {
        payload = payload as ObjectRecordDeleteEvent;
        const creator = payload.properties.before;

        body = `${creator} deleted ${objectSingularName} ${recordName}`;

        break;
      }
      case DatabaseEventAction.DESTROYED: {
        payload = payload as ObjectRecordDestroyEvent;
        const creator = payload.properties.before;

        body = `${creator} deleted ${objectSingularName} ${recordName}`;

        break;
      }
      case DatabaseEventAction.RESTORED: {
        payload = payload as ObjectRecordRestoreEvent;
        break;
      }
      case DatabaseEventAction.UPDATED: {
        payload = payload as ObjectRecordUpdateEvent;
        break;
      }
      case DatabaseEventAction.UPSERTED: {
        payload = payload as ObjectRecordUpsertEvent;
        break;
      }
    }
    // get workspace member name
    // get action
    // create: "<creator> created new <objectSingularName>"
    // update: "<creator> updated <objectSingularName> <recordName>" add fields?
    // delete: "<creator> deleted <objectSingularName> <recordName>"
    // destroy: "<creator> destroyed <objectSingularName> <recordName>"
    // restore: "<creator> restored <objectSingularName> <recordName>"
    // upsert: ???
    const data = {
      body: '',
      status: NotificationType.UNREAD,
      recipientId: recipientId,
    };
  }
}
