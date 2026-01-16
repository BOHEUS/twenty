import { Injectable } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { NotificationsSettingsWorkspaceEntity } from 'src/modules/notifications/notifications-settings/standard-objects/notifications-settings.workspace-entity';

@Injectable()
export class NotificationsSettingsService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async getNotificationSettings(
    workspaceId: string,
    workspaceMemberId: string,
  ): Promise<void> {}

  async deleteNotificationSettings(
    workspaceId: string,
    workspaceMemberId: string,
  ): Promise<void> {}

  async updateNotificationSettings(
    workspaceId: string,
    workspaceMemberId: string,
  ): Promise<void> {}

  async createNotificationSettings(
    workspaceId: string,
    workspaceMemberId: string,
    settings: [],
  ) {
    const authContext = buildSystemAuthContext(workspaceId);

    return await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const notificationSettingsRepository =
          await this.globalWorkspaceOrmManager.getRepository<NotificationsSettingsWorkspaceEntity>(
            workspaceId,
            'notificationsettings',
          );

        return await notificationSettingsRepository.insert({
          createdById: workspaceMemberId,
          settings,
        });
      },
    );
  }
}
