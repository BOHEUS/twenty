import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NotificationsService } from 'src/modules/notifications/notifications/services/notifications.service';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { NotificationDto } from 'src/modules/notifications/notifications/dtos/notification.dto';
import { CustomPermissionGuard } from 'src/engine/guards/custom-permission.guard';
import { UpdateNotificationInput } from 'src/modules/notifications/notifications/dtos/update-notification-input';
import { UpdateBatchNotificationsInput } from 'src/modules/notifications/notifications/dtos/update-batch-notifications-input';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard, CustomPermissionGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@Resolver(() => NotificationDto)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => NotificationDto)
  async deleteAllNotifications(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @AuthUserWorkspaceId() workspaceMemberId: string,
  ) {
    return await this.notificationsService.removeNotifications(
      workspaceId,
      workspaceMemberId,
    );
  }

  @Mutation()
  async updateSingleNotification(
    @Args('input') input: UpdateNotificationInput,
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
  ) {
    return await this.notificationsService.updateSingleNotification(
      workspaceId,
      input,
    );
  }

  @Mutation()
  async updateBatchNotifications(
    @Args('input') input: UpdateBatchNotificationsInput,
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
  ) {
    return await this.notificationsService.updateNotifications(
      workspaceId,
      input,
    );
  }

  @Query()
  async getWorkspaceMemberNotifications(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @AuthUserWorkspaceId() workspaceMemberId: string,
  ) {
    return await this.notificationsService.getNotifications(
      workspaceId,
      workspaceMemberId,
    );
  }
}
