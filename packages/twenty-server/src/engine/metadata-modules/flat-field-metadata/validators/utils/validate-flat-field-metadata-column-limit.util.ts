import { msg } from '@lingui/core/macro';

import { FieldMetadataExceptionCode } from 'src/engine/metadata-modules/field-metadata/field-metadata.exception';
import { findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps.util';
import { MAX_COLUMNS_PER_OBJECT } from 'src/engine/metadata-modules/flat-field-metadata/constants/max-columns-per-object.constant';
import { type FlatFieldMetadataValidationError } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata-validation-error.type';
import { countUniversalFlatFieldMetadataColumns } from 'src/engine/metadata-modules/flat-field-metadata/utils/count-universal-flat-field-metadata-columns.util';
import { type UniversalFlatEntityMaps } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-entity-maps.type';
import { type UniversalFlatFieldMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-field-metadata.type';
import { type UniversalFlatObjectMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-object-metadata.type';

export const validateFlatFieldMetadataColumnLimit = ({
  flatFieldMetadataToValidate,
  universalFlatObjectMetadata,
  universalFlatFieldMetadataMaps,
}: {
  flatFieldMetadataToValidate: UniversalFlatFieldMetadata;
  universalFlatObjectMetadata: Pick<
    UniversalFlatObjectMetadata,
    'fieldUniversalIdentifiers'
  >;
  universalFlatFieldMetadataMaps: UniversalFlatEntityMaps<UniversalFlatFieldMetadata>;
}): FlatFieldMetadataValidationError[] => {
  const existingColumnCount =
    findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMaps({
      flatEntityMaps: universalFlatFieldMetadataMaps,
      universalIdentifiers:
        universalFlatObjectMetadata.fieldUniversalIdentifiers,
    }).reduce(
      (columnCount, universalFlatFieldMetadata) =>
        columnCount +
        countUniversalFlatFieldMetadataColumns(universalFlatFieldMetadata),
      0,
    );
  const totalColumnCount =
    existingColumnCount +
    countUniversalFlatFieldMetadataColumns(flatFieldMetadataToValidate);

  if (totalColumnCount <= MAX_COLUMNS_PER_OBJECT) {
    return [];
  }

  return [
    {
      code: FieldMetadataExceptionCode.COLUMN_LIMIT_REACHED,
      message: `Object would have ${totalColumnCount} columns, the maximum is ${MAX_COLUMNS_PER_OBJECT}`,
      value: MAX_COLUMNS_PER_OBJECT,
      userFriendlyMessage: msg`This object has reached the maximum number of columns. Remove unused fields before adding new ones.`,
    },
  ];
};
