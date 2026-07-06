import { Module } from '@nestjs/common';

import { NotificationModule } from 'src/modules/notifications/notifications/notifications.module';
import { NotificationSettingsModule } from 'src/modules/notifications/notifications-settings/notification-settings.module';

@Module({
  imports: [NotificationModule, NotificationSettingsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class NotificationsModule {}
