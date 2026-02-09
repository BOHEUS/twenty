import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsWorkspaceEntity } from 'src/modules/notifications/notifications/standard-objects/notifications.workspace-entity';
import { NotificationsService } from 'src/modules/notifications/notifications/services/notifications.service';
import { NotificationsResolver } from 'src/modules/notifications/notifications/resolvers/notifications.resolver';
import { NotificationTriggerJob } from 'src/modules/notifications/notifications/jobs/notifications-trigger.job';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsWorkspaceEntity])],
  controllers: [],
  providers: [
    NotificationsService,
    NotificationsResolver,
    NotificationTriggerJob,
  ],
  exports: [],
})
export class NotificationModule {}
