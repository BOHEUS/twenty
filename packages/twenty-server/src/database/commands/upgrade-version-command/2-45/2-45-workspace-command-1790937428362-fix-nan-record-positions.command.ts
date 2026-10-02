import { Command } from 'nest-commander';
import { FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { type DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { computeObjectTargetTable } from 'src/engine/utils/compute-object-target-table.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

@RegisteredWorkspaceCommand('2.45.0', 1790937428362)
@Command({
  name: 'upgrade:2-45:fix-nan-record-positions',
  description:
    'Move records with a NaN position after the last valid position, as a NaN position breaks every query returning them',
})
export class FixNanRecordPositionsCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up({
    workspaceId,
    options,
    dataSource,
  }: RunOnWorkspaceArgs): Promise<void> {
    if (!isDefined(dataSource)) {
      this.logger.warn(
        `No data source for workspace ${workspaceId}, skipping NaN position fix`,
      );

      return;
    }

    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    const schemaName = escapeIdentifier(getWorkspaceSchemaName(workspaceId));

    for (const flatFieldMetadata of Object.values(
      flatFieldMetadataMaps.byUniversalIdentifier,
    )) {
      if (
        !isDefined(flatFieldMetadata) ||
        flatFieldMetadata.type !== FieldMetadataType.POSITION
      ) {
        continue;
      }

      const flatObjectMetadata = findFlatEntityByIdInFlatEntityMaps({
        flatEntityId: flatFieldMetadata.objectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps,
      });

      if (!isDefined(flatObjectMetadata)) {
        continue;
      }

      const table = `${schemaName}.${escapeIdentifier(computeObjectTargetTable(flatObjectMetadata))}`;
      const column = escapeIdentifier(flatFieldMetadata.name);

      const fixedCount = await this.fixNanPositions({
        dataSource,
        table,
        column,
        isDryRun: options.dryRun ?? false,
      });

      if (fixedCount > 0) {
        this.logger.log(
          `${options.dryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: fixed ${fixedCount} NaN position(s) on ${flatObjectMetadata.nameSingular}`,
        );
      }
    }
  }

  // The NaN values carry no ordering information worth restoring
  async down(_args: RunOnWorkspaceArgs): Promise<void> {}

  private async fixNanPositions({
    dataSource,
    table,
    column,
    isDryRun,
  }: {
    dataSource: DataSource;
    table: string;
    column: string;
    isDryRun: boolean;
  }): Promise<number> {
    if (isDryRun) {
      const [{ count }] = await dataSource.query(
        `SELECT COUNT(*)::int AS count FROM ${table} WHERE ${column} = 'NaN'`,
      );

      return count;
    }

    const [, updatedCount] = await dataSource.query(
      `UPDATE ${table} AS record
      SET ${column} = nan_record.new_position
      FROM (
        SELECT
          "id",
          (SELECT COALESCE(MAX(${column}), 0) FROM ${table} WHERE ${column} <> 'NaN')
            + ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS new_position
        FROM ${table}
        WHERE ${column} = 'NaN'
      ) AS nan_record
      WHERE record."id" = nan_record."id"`,
    );

    return updatedCount;
  }
}
