import { Injectable, UseGuards } from '@nestjs/common';
import { Mutation, Query } from '@nestjs/graphql';

import { NotificationSettingsDto } from 'src/modules/notifications/notifications-settings/dtos/notification-settings.dto';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

@Injectable()
@UseGuards(WorkspaceAuthGuard)
export class NotificationsSettingsResolver {
  constructor() {}

  @Query(() => NotificationSettingsDto)
  async getNotificationsSettings() {}

  @Mutation(() => NotificationSettingsDto)
  async createMutationSettings() {}

  @Mutation(() => NotificationSettingsDto)
  async updateNotificationSettings() {}

  @Mutation(() => Boolean)
  async deleteNotificationSettings() {}
}
