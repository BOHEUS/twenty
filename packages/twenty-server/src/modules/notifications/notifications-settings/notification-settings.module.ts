import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsSettingsService } from 'src/modules/notifications/notifications-settings/services/notifications-settings.service';
import { NotificationsSettingsResolver } from 'src/modules/notifications/notifications-settings/resolvers/notifications-settings.resolver';
import { NotificationsSettingsWorkspaceEntity } from 'src/modules/notifications/notifications-settings/standard-objects/notifications-settings.workspace-entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsSettingsWorkspaceEntity])],
  controllers: [],
  providers: [NotificationsSettingsService, NotificationsSettingsResolver],
  exports: [],
})
export class NotificationSettingsModule {}
