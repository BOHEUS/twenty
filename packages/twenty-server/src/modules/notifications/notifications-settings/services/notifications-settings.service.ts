import { Injectable } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { NotificationsSettingsWorkspaceEntity } from 'src/modules/notifications/notifications-settings/standard-objects/notifications-settings.workspace-entity';
import { UpdateNotificationSettingsInput } from 'src/modules/notifications/notifications-settings/dtos/update-notification-settings-input';
import { CreateNotificationSettingsInput } from 'src/modules/notifications/notifications-settings/dtos/create-notification-settings-input';
import { DeleteNotificationSettingsInput } from 'src/modules/notifications/notifications-settings/dtos/delete-notification-settings-input';

@Injectable()
export class NotificationsSettingsService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async getNotificationSettings(
    workspaceId: string,
    workspaceMemberId: string,
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    return await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const notificationSettingsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsSettingsWorkspaceEntity>(
            workspaceId,
            'notificationSettings',
          );

        return notificationSettingsRepository.findOneBy({
          createdById: workspaceMemberId,
        });
      },
      authContext,
    );
  }

  async deleteNotificationSettings(
    workspaceId: string,
    input: DeleteNotificationSettingsInput, // doesn't really matter if it's workspace member id or notification settings id, to be decided
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    return await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const notificationSettingsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsSettingsWorkspaceEntity>(
            workspaceId,
            'notificationSettings',
          );

        return notificationSettingsRepository.delete({
          id: input.id,
        });
      },
      authContext,
    );
  }

  async updateNotificationSettings(
    workspaceId: string,
    input: UpdateNotificationSettingsInput,
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    return await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const notificationSettingsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsSettingsWorkspaceEntity>(
            workspaceId,
            'notificationSettings',
          );

        return notificationSettingsRepository.update(
          {
            id: input.id,
          },
          {
            settings: input.update.operations,
          },
        );
      },
      authContext,
    );
  }

  async createNotificationSettings(
    workspaceId: string,
    workspaceMemberId: string,
    input: CreateNotificationSettingsInput,
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    return await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const notificationSettingsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsSettingsWorkspaceEntity>(
            workspaceId,
            'notificationSettings',
          );

        return await notificationSettingsRepository.insert({
          createdById: workspaceMemberId,
          settings: input.settings,
        });
      },
      authContext,
    );
  }
}
