import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NotificationsService } from 'src/modules/notifications/notifications/services/notifications.service';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { NotificationDto } from 'src/modules/notifications/notifications/dtos/notification.dto';

@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  // delete all notifications
  // update all notifications
  // get all notifications

  @Mutation(() => NotificationDto)
  @UseGuards(UserAuthGuard)
  async deleteAllNotifications(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @AuthUserWorkspaceId() workspaceMemberId: string,
  ): Promise<void> {
    await this.notificationsService.removeNotifications(
      workspaceId,
      workspaceMemberId,
    );
  }

  @Mutation()
  @UseGuards(UserAuthGuard)
  async updateSingleNotification(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    notificationId: string,
    status: string,
  ): Promise<void> {
    await this.notificationsService.updateSingleNotification(
      workspaceId,
      notificationId,
      status,
    );
  }

  @Mutation()
  @UseGuards(UserAuthGuard)
  async updateBatchNotifications(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    notificationIds: string[],
    status: string,
  ): Promise<void> {
    await this.notificationsService.updateNotifications(
      workspaceId,
      notificationIds,
      status,
    );
  }

  @Query()
  @UseGuards(UserAuthGuard)
  async getNotifications(
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @AuthUserWorkspaceId() workspaceMemberId: string,
  ) {
    await this.notificationsService.getNotifications(
      workspaceId,
      workspaceMemberId,
    );
  }
}
