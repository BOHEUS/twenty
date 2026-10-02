import { FieldMetadataType, richTextCompositeType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { LEGACY_RICH_TEXT_BLOCKNOTE_PROPERTY } from 'src/database/commands/upgrade-version-command/2-45/constants/legacy-rich-text-blocknote-property.constant';
import { type RichTextColumnNames } from 'src/database/commands/upgrade-version-command/2-45/types/rich-text-column-names.type';
import { computeCompositeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findManyFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { getWorkspaceSchemaContextForMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util';

const getColumnName = (fieldName: string, propertyName: string) => {
  const property = [
    ...richTextCompositeType.properties,
    LEGACY_RICH_TEXT_BLOCKNOTE_PROPERTY,
  ].find(({ name }) => name === propertyName);

  return isDefined(property)
    ? computeCompositeColumnName(fieldName, property)
    : undefined;
};

export const findRichTextColumnNames = ({
  workspaceId,
  flatObjectMetadataMaps,
  flatFieldMetadataMaps,
}: {
  workspaceId: string;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
}): RichTextColumnNames[] =>
  Object.values(flatObjectMetadataMaps.byUniversalIdentifier)
    .filter(isDefined)
    .flatMap((flatObjectMetadata) => {
      const { schemaName, tableName } = getWorkspaceSchemaContextForMigration({
        workspaceId,
        objectMetadata: flatObjectMetadata,
      });

      return findManyFlatEntityByIdInFlatEntityMaps({
        flatEntityIds: flatObjectMetadata.fieldIds,
        flatEntityMaps: flatFieldMetadataMaps,
      })
        .filter((field) => field.type === FieldMetadataType.RICH_TEXT)
        .flatMap((field) => {
          const blocknote = getColumnName(field.name, 'blocknote');
          const markdown = getColumnName(field.name, 'markdown');
          const tiptap = getColumnName(field.name, 'tiptap');

          return isDefined(blocknote) &&
            isDefined(markdown) &&
            isDefined(tiptap)
            ? [{ schemaName, tableName, blocknote, markdown, tiptap }]
            : [];
        });
    });
