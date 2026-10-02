import { Command } from 'nest-commander';
import { isDefined } from 'twenty-shared/utils';
import { type DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { type LegacyRichTextColumns } from 'src/database/commands/upgrade-version-command/2-45/types/legacy-rich-text-columns.type';
import { findRichTextColumnNames } from 'src/database/commands/upgrade-version-command/2-45/utils/find-rich-text-column-names.util';
import { findLegacyRichTextColumns } from 'src/database/commands/upgrade-version-command/2-45/utils/find-legacy-rich-text-columns.util';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

@RegisteredWorkspaceCommand('2.45.0', 1790963777000)
@Command({
  name: 'upgrade:2-45:drop-rich-text-blocknote-columns',
  description:
    'Drop the blocknote column of every RICH_TEXT field and the blocknote key of dashboard rich text widgets. Skips a workspace while any value still lacks tiptap.',
})
export class DropRichTextBlocknoteColumnsCommand extends ProvisionedWorkspaceCommandRunner {
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
    if (!isDefined(dataSource)) {
      return;
    }

    const columns = await this.getLegacyRichTextColumns(
      workspaceId,
      dataSource,
    );

    // Dropping is irreversible, so a workspace whose backfill did not cover
    // every value keeps its BlockNote data until the backfill is rerun.
    const unconvertedValueCount = await this.countUnconvertedValues(
      dataSource,
      columns,
    );

    if (unconvertedValueCount > 0) {
      this.logger.warn(
        `Skipping workspace ${workspaceId}: ${unconvertedValueCount} rich text value(s) have blocknote content but no tiptap. Rerun upgrade:2-45:backfill-rich-text-tiptap first.`,
      );

      return;
    }

    if (options.dryRun === true) {
      this.logger.log(
        `[DRY RUN] Would drop ${columns.length} blocknote column(s) for workspace ${workspaceId}`,
      );

      return;
    }

    for (const { table, blocknote } of columns) {
      await dataSource.query(
        `ALTER TABLE ${table} DROP COLUMN IF EXISTS ${blocknote}`,
      );
    }

    await dataSource.query(
      `UPDATE core."pageLayoutWidget"
       SET configuration = configuration #- '{body,blocknote}'
       WHERE "workspaceId" = $1 AND configuration->>'configurationType' = $2
         AND configuration->'body' ? 'blocknote'`,
      [workspaceId, WidgetConfigurationType.STANDALONE_RICH_TEXT],
    );

    await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
      'flatPageLayoutWidgetMaps',
    ]);

    this.logger.log(
      `Dropped ${columns.length} blocknote column(s) for workspace ${workspaceId}`,
    );
  }

  // The BlockNote values are gone; down only restores an empty column so
  // code from before this release can still query it.
  async down({ workspaceId, options, dataSource }: RunOnWorkspaceArgs) {
    if (options.dryRun === true || !isDefined(dataSource)) {
      return;
    }

    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    const tables = findRichTextColumnNames({
      workspaceId,
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
    }).map(({ schemaName, tableName, blocknote }) => ({
      table: `${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)}`,
      blocknote: escapeIdentifier(blocknote),
    }));

    for (const { table, blocknote } of tables) {
      await dataSource.query(
        `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${blocknote} text`,
      );
    }
  }

  private async countUnconvertedValues(
    dataSource: DataSource,
    columns: LegacyRichTextColumns[],
  ): Promise<number> {
    let count = 0;

    for (const { table, blocknote, tiptap } of columns) {
      const [{ count: tableCount }]: { count: string }[] =
        await dataSource.query(
          `SELECT count(*) FROM ${table}
           WHERE ${tiptap} IS NULL AND ${blocknote} IS NOT NULL AND ${blocknote} NOT IN ('', '[]')`,
        );

      count += Number(tableCount);
    }

    return count;
  }

  private async getLegacyRichTextColumns(
    workspaceId: string,
    dataSource: DataSource,
  ): Promise<LegacyRichTextColumns[]> {
    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    return findLegacyRichTextColumns({
      workspaceId,
      dataSource,
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
    });
  }
}
