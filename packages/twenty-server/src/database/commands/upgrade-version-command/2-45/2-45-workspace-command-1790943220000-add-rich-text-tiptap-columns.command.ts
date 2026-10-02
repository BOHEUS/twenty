import { Command } from 'nest-commander';
import {
  FieldMetadataType,
  richTextCompositeType,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { findManyFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';
import { getWorkspaceSchemaContextForMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util';

type RichTextTiptapColumn = {
  schemaName: string;
  tableName: string;
  columnName: string;
};

@RegisteredWorkspaceCommand('2.45.0', 1790943220000)
@Command({
  name: 'upgrade:2-45:add-rich-text-tiptap-columns',
  description:
    'Add the nullable tiptap subfield column to every RICH_TEXT field. Data is backfilled by a separate command.',
})
export class AddRichTextTiptapColumnsCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up({ workspaceId, options, dataSource }: RunOnWorkspaceArgs) {
    const columns = await this.getRichTextTiptapColumns(workspaceId);

    if (options.dryRun === true || !isDefined(dataSource)) {
      this.logger.log(
        `[DRY RUN] Would ensure ${columns.length} tiptap column(s) exist for workspace ${workspaceId}`,
      );

      return;
    }

    for (const { schemaName, tableName, columnName } of columns) {
      await dataSource.query(
        `ALTER TABLE ${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)} ADD COLUMN IF NOT EXISTS ${escapeIdentifier(columnName)} text`,
      );
    }

    this.logger.log(
      `Ensured ${columns.length} tiptap column(s) exist for workspace ${workspaceId}`,
    );
  }

  async down({ workspaceId, options, dataSource }: RunOnWorkspaceArgs) {
    if (options.dryRun === true || !isDefined(dataSource)) {
      return;
    }

    const columns = await this.getRichTextTiptapColumns(workspaceId);

    for (const { schemaName, tableName, columnName } of columns) {
      await dataSource.query(
        `ALTER TABLE ${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)} DROP COLUMN IF EXISTS ${escapeIdentifier(columnName)}`,
      );
    }
  }

  private async getRichTextTiptapColumns(
    workspaceId: string,
  ): Promise<RichTextTiptapColumn[]> {
    const tiptapProperty = richTextCompositeType.properties.find(
      (property) => property.name === 'tiptap',
    );

    if (!isDefined(tiptapProperty)) {
      return [];
    }

    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    return Object.values(flatObjectMetadataMaps.byUniversalIdentifier)
      .filter(isDefined)
      .flatMap((flatObjectMetadata) => {
        const { schemaName, tableName } =
          getWorkspaceSchemaContextForMigration({
            workspaceId,
            objectMetadata: flatObjectMetadata,
          });

        return findManyFlatEntityByIdInFlatEntityMaps({
          flatEntityIds: flatObjectMetadata.fieldIds,
          flatEntityMaps: flatFieldMetadataMaps,
        })
          .filter((field) => field.type === FieldMetadataType.RICH_TEXT)
          .map((field) => ({
            schemaName,
            tableName,
            columnName: computeCompositeColumnName(field.name, tiptapProperty),
          }));
      });
  }
}
