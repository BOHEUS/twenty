import { Command } from 'nest-commander';
import { FieldMetadataType, richTextCompositeType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { type DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { buildRichTextTiptapBackfill } from 'src/database/commands/upgrade-version-command/2-45/utils/build-rich-text-tiptap-backfill.util';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { findManyFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';
import { getWorkspaceSchemaContextForMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util';

const BATCH_SIZE = 200;

type RichTextColumns = {
  table: string;
  blocknote: string;
  markdown: string;
  tiptap: string;
};

type BackfillCounts = {
  converted: number;
  textFallback: number;
  empty: number;
  failed: number;
};

type RichTextRow = {
  id: string;
  blocknote: string | null;
  markdown: string | null;
};

const getRichTextColumnName = (fieldName: string, propertyName: string) => {
  const property = richTextCompositeType.properties.find(
    ({ name }) => name === propertyName,
  );

  return isDefined(property)
    ? escapeIdentifier(computeCompositeColumnName(fieldName, property))
    : undefined;
};

@RegisteredWorkspaceCommand('2.45.0', 1790943726000)
@Command({
  name: 'upgrade:2-45:backfill-rich-text-tiptap',
  description:
    'Fill the tiptap subfield of every RICH_TEXT value from its blocknote or markdown. Resumable and idempotent: rows that already hold tiptap are skipped.',
})
export class BackfillRichTextTiptapCommand extends ProvisionedWorkspaceCommandRunner {
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

    const isDryRun = options.dryRun ?? false;
    const counts: BackfillCounts = {
      converted: 0,
      textFallback: 0,
      empty: 0,
      failed: 0,
    };

    for (const columns of await this.getRichTextColumns(workspaceId)) {
      await this.backfillColumns({ dataSource, columns, counts, isDryRun });
    }

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Backfilled rich text tiptap for workspace ${workspaceId}: ${counts.converted} converted, ${counts.textFallback} with text fallback, ${counts.empty} empty, ${counts.failed} failed`,
    );
  }

  // blocknote is never modified, and markdown is only filled when it was
  // missing, so clearing tiptap restores the previous read behavior.
  async down({ workspaceId, options, dataSource }: RunOnWorkspaceArgs) {
    if (options.dryRun === true || !isDefined(dataSource)) {
      return;
    }

    for (const { table, tiptap } of await this.getRichTextColumns(
      workspaceId,
    )) {
      await dataSource.query(`UPDATE ${table} SET ${tiptap} = NULL`);
    }
  }

  private async backfillColumns({
    dataSource,
    columns,
    counts,
    isDryRun,
  }: {
    dataSource: DataSource;
    columns: RichTextColumns;
    counts: BackfillCounts;
    isDryRun: boolean;
  }) {
    const { table, blocknote, markdown, tiptap } = columns;
    let cursor: string | null = null;

    while (true) {
      const rows: RichTextRow[] = await dataSource.query(
        `SELECT id, ${blocknote} AS blocknote, ${markdown} AS markdown FROM ${table}
         WHERE ${tiptap} IS NULL
           AND (${blocknote} IS NOT NULL OR ${markdown} IS NOT NULL)
           AND ($1::uuid IS NULL OR id > $1::uuid)
         ORDER BY id
         LIMIT ${BATCH_SIZE}`,
        [cursor],
      );

      if (rows.length === 0) {
        return;
      }

      cursor = rows[rows.length - 1].id;

      const updates: { id: string; tiptap: string; markdown: string | null }[] =
        [];

      for (const row of rows) {
        try {
          const backfill = buildRichTextTiptapBackfill(row);

          counts[backfill.status]++;

          if (backfill.status !== 'empty') {
            updates.push({ id: row.id, ...backfill });
          }
        } catch (error) {
          counts.failed++;
          this.logger.error(
            `Failed to convert rich text of row ${row.id} in ${table}: ${error}`,
          );
        }
      }

      if (isDryRun || updates.length === 0) {
        continue;
      }

      // Only fills rows still missing tiptap, so concurrent writes win.
      await dataSource.query(
        `UPDATE ${table} AS target
         SET ${tiptap} = source.tiptap,
             ${markdown} = COALESCE(source.markdown, target.${markdown})
         FROM unnest($1::uuid[], $2::text[], $3::text[]) AS source(id, tiptap, markdown)
         WHERE target.id = source.id AND target.${tiptap} IS NULL`,
        [
          updates.map(({ id }) => id),
          updates.map((update) => update.tiptap),
          updates.map((update) => update.markdown),
        ],
      );
    }
  }

  private async getRichTextColumns(
    workspaceId: string,
  ): Promise<RichTextColumns[]> {
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
          .flatMap((field): RichTextColumns[] => {
            const blocknote = getRichTextColumnName(field.name, 'blocknote');
            const markdown = getRichTextColumnName(field.name, 'markdown');
            const tiptap = getRichTextColumnName(field.name, 'tiptap');

            return isDefined(blocknote) &&
              isDefined(markdown) &&
              isDefined(tiptap)
              ? [
                  {
                    table: `${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)}`,
                    blocknote,
                    markdown,
                    tiptap,
                  },
                ]
              : [];
          });
      });
  }
}
