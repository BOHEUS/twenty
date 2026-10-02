import { type DataSource } from 'typeorm';

import { type LegacyRichTextColumns } from 'src/database/commands/upgrade-version-command/2-45/types/legacy-rich-text-columns.type';
import { findRichTextColumnNames } from 'src/database/commands/upgrade-version-command/2-45/utils/find-rich-text-column-names.util';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

// Only fields whose table still has the blocknote column are returned, so
// workspaces created after its removal and reruns are no-ops.
export const findLegacyRichTextColumns = async ({
  workspaceId,
  dataSource,
  flatObjectMetadataMaps,
  flatFieldMetadataMaps,
}: {
  workspaceId: string;
  dataSource: DataSource;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
}): Promise<LegacyRichTextColumns[]> => {
  const candidates = findRichTextColumnNames({
    workspaceId,
    flatObjectMetadataMaps,
    flatFieldMetadataMaps,
  });

  if (candidates.length === 0) {
    return [];
  }

  const existingColumns: { table_name: string; column_name: string }[] =
    await dataSource.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema = $1 AND column_name = ANY($2::text[])`,
      [candidates[0].schemaName, candidates.map(({ blocknote }) => blocknote)],
    );

  return candidates
    .filter(({ tableName, blocknote }) =>
      existingColumns.some(
        (column) =>
          column.table_name === tableName && column.column_name === blocknote,
      ),
    )
    .map(({ schemaName, tableName, blocknote, markdown, tiptap }) => ({
      table: `${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)}`,
      blocknote: escapeIdentifier(blocknote),
      markdown: escapeIdentifier(markdown),
      tiptap: escapeIdentifier(tiptap),
    }));
};
