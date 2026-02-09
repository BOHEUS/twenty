import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { NotificationSettingsDto } from 'src/modules/notifications/notifications-settings/dtos/notification-settings.dto';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NotificationsSettingsService } from 'src/modules/notifications/notifications-settings/services/notifications-settings.service';
import { AuthWorkspaceMemberId } from 'src/engine/decorators/auth/auth-workspace-member-id.decorator';
import { CreateNotificationSettingsInput } from 'src/modules/notifications/notifications-settings/dtos/create-notification-settings-input';
import { UpdateNotificationSettingsInput } from 'src/modules/notifications/notifications-settings/dtos/update-notification-settings-input';
import { DeleteNotificationSettingsInput } from 'src/modules/notifications/notifications-settings/dtos/delete-notification-settings-input';
import { CustomPermissionGuard } from 'src/engine/guards/custom-permission.guard';

@Injectable()
@UseGuards(WorkspaceAuthGuard, CustomPermissionGuard)
@Resolver(() => NotificationSettingsDto)
export class NotificationsSettingsResolver {
  constructor(
    private readonly notificationSettingsService: NotificationsSettingsService,
  ) {}

  @Query(() => NotificationSettingsDto)
  async getNotificationsSettings(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
  ) {
    return await this.notificationSettingsService.getNotificationSettings(
      workspaceId,
      workspaceMemberId,
    );
  }

  @Mutation(() => NotificationSettingsDto)
  async createMutationSettings(
    @Args('input') input: CreateNotificationSettingsInput,
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
  ) {
    return await this.notificationSettingsService.createNotificationSettings(
      workspaceId,
      workspaceMemberId,
      input,
    );
  }

  @Mutation(() => NotificationSettingsDto)
  async updateNotificationSettings(
    @Args('input') input: UpdateNotificationSettingsInput,
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
  ) {
    return await this.notificationSettingsService.updateNotificationSettings(
      workspaceId,
      input,
    );
  }

  @Mutation(() => NotificationSettingsDto)
  async deleteNotificationSettings(
    @Args('input') input: DeleteNotificationSettingsInput,
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
  ) {
    return await this.notificationSettingsService.deleteNotificationSettings(
      workspaceId,
      input,
    );
  }
}
