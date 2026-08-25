import { Module } from '@nestjs/common';

import { MessagingImportManagerModule } from 'src/modules/messaging/message-import-manager/messaging-import-manager.module';
import { MessagingIngestResolver } from 'src/modules/messaging/message-import-manager/resolvers/messaging-ingest.resolver';

@Module({
  imports: [MessagingImportManagerModule],
  providers: [MessagingIngestResolver],
})
export class MessagingIngestModule {}
