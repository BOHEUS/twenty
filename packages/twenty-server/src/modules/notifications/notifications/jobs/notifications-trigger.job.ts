import { Scope } from '@nestjs/common';

import {
  ObjectRecordCreateEvent,
  ObjectRecordDeleteEvent,
  ObjectRecordDestroyEvent,
  ObjectRecordEvent,
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
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export type NotificationTriggerJobData = {
  workspaceId: string;
  recipientId: string;
  objectSingularName: string;
  payload: ObjectRecordEvent;
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

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const notificationRepository =
        await this.globalWorkspaceOrmManager.getRepository<NotificationsWorkspaceEntity>(
          data.workspaceId,
          'workflow',
          { shouldBypassPermissionChecks: true },
        );
      const notification = this.getData(
        data.recipientId,
        data.action,
        data.payload,
        data.objectSingularName,
      );

      await notificationRepository.insert(notification);
    }, authContext);
  }

  private getData(
    recipientId: string,
    action: DatabaseEventAction,
    payload: ObjectRecordEvent,
    objectSingularName: string,
  ) {
    let body = '';

    switch (action) {
      case DatabaseEventAction.CREATED: {
        payload = payload as ObjectRecordCreateEvent<BaseWorkspaceEntity>;
        const creator = 'CREATED';

        body = `${creator} created new ${objectSingularName}`;

        break;
      }
      case DatabaseEventAction.DELETED: {
        payload = payload as ObjectRecordDeleteEvent;
        const creator = 'DELETED';

        body = `${creator} deleted ${objectSingularName}`;

        break;
      }
      case DatabaseEventAction.DESTROYED: {
        payload = payload as ObjectRecordDestroyEvent;
        const creator = 'DESTROYED';

        body = `${creator} deleted ${objectSingularName}`;

        break;
      }
      case DatabaseEventAction.RESTORED: {
        payload = payload as ObjectRecordRestoreEvent;
        const creator = 'RESTORED';

        body = `${creator} restored ${objectSingularName}`;

        break;
      }
      case DatabaseEventAction.UPDATED: {
        payload = payload as ObjectRecordUpdateEvent;
        const creator = 'UPDATED';

        body = `${creator} updated ${objectSingularName}`;

        break;
      }
      case DatabaseEventAction.UPSERTED: {
        payload = payload as ObjectRecordUpsertEvent;
        const creator = 'UPSERTED';

        body = `${creator} upserted ${objectSingularName}`;

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

    return {
      body,
      status: NotificationType.UNREAD,
      recipientId: recipientId,
    };
  }
}
