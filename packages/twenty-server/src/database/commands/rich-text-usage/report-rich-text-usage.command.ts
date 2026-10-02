import { Command } from 'nest-commander';
import { FieldMetadataType, richTextCompositeType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { type DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { type RichTextUsageReport } from 'src/database/commands/rich-text-usage/types/rich-text-usage-report.type';
import { addBlockNoteDocumentToUsageReport } from 'src/database/commands/rich-text-usage/utils/add-blocknote-document-to-usage-report.util';
import { createEmptyRichTextUsageReport } from 'src/database/commands/rich-text-usage/utils/create-empty-rich-text-usage-report.util';
import { mergeRichTextUsageReports } from 'src/database/commands/rich-text-usage/utils/merge-rich-text-usage-reports.util';
import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { findManyFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps.util';
import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';
import { getWorkspaceSchemaContextForMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util';

const BATCH_SIZE = 500;

// Read-only measurement deciding which BlockNote features the Tiptap editor
// must keep. Prints one JSON report per workspace and a total at the end.
@Command({
  name: 'workspace:report-rich-text-usage',
  description:
    'Count BlockNote block types, inline content, styles and nesting across rich text fields and dashboard rich text widgets. Read-only.',
})
export class ReportRichTextUsageCommand extends ProvisionedWorkspaceCommandRunner {
  private readonly totalReport = createEmptyRichTextUsageReport();

  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    dataSource,
    index,
    total,
  }: RunOnWorkspaceArgs): Promise<void> {
    if (!isDefined(dataSource)) {
      return;
    }

    const report = createEmptyRichTextUsageReport();

    for (const { table, blocknote } of await this.getBlockNoteColumns(
      workspaceId,
    )) {
      await this.addColumnToReport({ dataSource, table, blocknote, report });
    }

    const widgetRows: { blocknote: string | null }[] = await dataSource.query(
      `SELECT configuration->'body'->>'blocknote' AS blocknote FROM core."pageLayoutWidget"
       WHERE "workspaceId" = $1 AND "deletedAt" IS NULL
         AND configuration->>'configurationType' = $2`,
      [workspaceId, WidgetConfigurationType.STANDALONE_RICH_TEXT],
    );

    for (const { blocknote } of widgetRows) {
      addBlockNoteDocumentToUsageReport(blocknote, report);
    }

    mergeRichTextUsageReports(this.totalReport, report);

    this.logger.log(
      `Rich text usage for workspace ${workspaceId}: ${JSON.stringify(report)}`,
    );

    if (index === total - 1) {
      this.logger.log(
        `Rich text usage across workspaces: ${JSON.stringify(this.totalReport)}`,
      );
    }
  }

  private async addColumnToReport({
    dataSource,
    table,
    blocknote,
    report,
  }: {
    dataSource: DataSource;
    table: string;
    blocknote: string;
    report: RichTextUsageReport;
  }) {
    let cursor: string | null = null;

    while (true) {
      const rows: { id: string; blocknote: string | null }[] =
        await dataSource.query(
          `SELECT id, ${blocknote} AS blocknote FROM ${table}
           WHERE ${blocknote} IS NOT NULL AND ($1::uuid IS NULL OR id > $1::uuid)
           ORDER BY id LIMIT ${BATCH_SIZE}`,
          [cursor],
        );

      if (rows.length === 0) {
        return;
      }

      cursor = rows[rows.length - 1].id;

      for (const row of rows) {
        addBlockNoteDocumentToUsageReport(row.blocknote, report);
      }
    }
  }

  private async getBlockNoteColumns(
    workspaceId: string,
  ): Promise<{ table: string; blocknote: string }[]> {
    const blocknoteProperty = richTextCompositeType.properties.find(
      ({ name }) => name === 'blocknote',
    );

    if (!isDefined(blocknoteProperty)) {
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
        const { schemaName, tableName } = getWorkspaceSchemaContextForMigration(
          {
            workspaceId,
            objectMetadata: flatObjectMetadata,
          },
        );

        return findManyFlatEntityByIdInFlatEntityMaps({
          flatEntityIds: flatObjectMetadata.fieldIds,
          flatEntityMaps: flatFieldMetadataMaps,
        })
          .filter((field) => field.type === FieldMetadataType.RICH_TEXT)
          .map((field) => ({
            table: `${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)}`,
            blocknote: escapeIdentifier(
              computeCompositeColumnName(field.name, blocknoteProperty),
            ),
          }));
      });
  }
}
