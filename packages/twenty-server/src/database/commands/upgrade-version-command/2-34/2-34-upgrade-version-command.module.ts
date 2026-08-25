import { Module } from '@nestjs/common';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { AddMessageParticipantHandleMemoryIndexCommand } from 'src/database/commands/upgrade-version-command/2-34/2-34-workspace-command-1787706312000-add-message-participant-handle-memory-index.command';
import { AddMessageAttachmentsFieldCommand } from 'src/database/commands/upgrade-version-command/2-34/2-34-workspace-command-1787620119000-add-message-attachments-field.command';
import { AddMessageParticipantHandleKindFieldCommand } from 'src/database/commands/upgrade-version-command/2-34/2-34-workspace-command-1787534832185-add-message-participant-handle-kind-field.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationRunnerModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

@Module({
  imports: [
    ApplicationModule,
    WorkspaceCacheModule,
    WorkspaceIteratorModule,
    WorkspaceMigrationRunnerModule,
    WorkspaceMigrationModule,
  ],
  providers: [
    AddMessageParticipantHandleKindFieldCommand,
    AddMessageAttachmentsFieldCommand,
    AddMessageParticipantHandleMemoryIndexCommand,
  ],
})
export class V2_34_UpgradeVersionCommandModule {}
