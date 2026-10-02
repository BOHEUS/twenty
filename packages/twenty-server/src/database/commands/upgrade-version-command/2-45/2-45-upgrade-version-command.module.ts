import { Module } from '@nestjs/common';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { BackfillRichTextTiptapInConfigurationsCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790952826000-backfill-rich-text-tiptap-in-configurations.command';
import { BackfillRichTextTiptapCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790943726000-backfill-rich-text-tiptap.command';
import { AddRichTextTiptapColumnsCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790943220000-add-rich-text-tiptap-columns.command';
import { OpenShareRecordToEveryObjectCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790876759146-open-share-record-to-every-object.command';
import { AddRecordShareNoneAccessLevelCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790876639146-add-record-share-none-access-level.command';
import { RestrictExportRecordsToIndexPageCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790837443029-restrict-export-records-to-index-page.command';
import { GateWorkflowCommandsOnRecordUpdatePermissionCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790853316722-gate-workflow-commands-on-record-update-permission.command';
import { RemoveSeeVersionWorkflowRunCommandMenuItemCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1790860694324-remove-see-version-workflow-run-command-menu-item.command';
import { SecretEncryptionModule } from 'src/engine/core-modules/secret-encryption/secret-encryption.module';
import { WorkflowVersionCoreModule } from 'src/engine/core-modules/workflow/workflow-version-core.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

@Module({
  imports: [
    SecretEncryptionModule,
    WorkflowVersionCoreModule,
    WorkspaceCacheModule,
    WorkspaceIteratorModule,
    WorkspaceMigrationModule,
  ],
  providers: [
    RestrictExportRecordsToIndexPageCommand,
    AddRecordShareNoneAccessLevelCommand,
    GateWorkflowCommandsOnRecordUpdatePermissionCommand,
    RemoveSeeVersionWorkflowRunCommandMenuItemCommand,
    OpenShareRecordToEveryObjectCommand,
    AddRichTextTiptapColumnsCommand,
    BackfillRichTextTiptapCommand,
    BackfillRichTextTiptapInConfigurationsCommand,
  ],
})
export class V2_45_UpgradeVersionCommandModule {}
