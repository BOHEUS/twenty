import { Injectable } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import {
  NotificationsWorkspaceEntity,
  NotificationType,
} from 'src/modules/notifications/notifications/standard-objects/notifications.workspace-entity';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async getNotifications(workspaceId: string, workspaceMemberId: string) {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsWorkspaceEntity>(
            workspaceId,
            'notifications',
          );

        return notificationsRepository.findBy({
          recipientId: workspaceMemberId,
        });
      },
    );
  }

  async updateSingleNotification(
    workspaceId: string,
    notificationId: string,
    status: string,
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsWorkspaceEntity>(
            workspaceId,
            'notifications',
          );

        const updatedStatus =
          status === 'READ' ? NotificationType.UNREAD : NotificationType.READ;

        await notificationsRepository.update(
          { id: notificationId },
          { status: updatedStatus },
        );
      },
    );
  }

  async updateNotifications(
    workspaceId: string,
    notificationIds: string[],
    status: string,
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsWorkspaceEntity>(
            workspaceId,
            'notifications',
          );

        const updatedStatus =
          status === 'UNREAD' ? NotificationType.UNREAD : NotificationType.READ;

        for (const id of notificationIds) {
          await notificationsRepository.update(
            { id },
            { status: updatedStatus },
          );
        }
      },
    );
  }

  async removeNotifications(workspaceId: string, workspaceMemberId: string) {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsWorkspaceEntity>(
            workspaceId,
            'notifications',
          );

        await notificationsRepository.delete({
          recipientId: workspaceMemberId,
        });
      },
    );
  }
}
