import {
  type FieldMetadataSettings,
  FieldMetadataType,
} from 'twenty-shared/types';
import {
  isDefined,
  isSearchableFieldType,
  type SearchableFieldType,
} from 'twenty-shared/utils';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { getTsVectorColumnExpressionFromFields } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';

// Builds the searchVector field settings (asExpression + searchFieldMetadataIds)
// from already-resolved flat field metadatas. searchFieldMetadataIds is the
// source of truth; asExpression is always derived from it so the generated
// column and the persisted selection cannot drift apart. Non-searchable fields
// are dropped from the persisted selection.
export const buildSearchVectorSettingsFromFlatFieldMetadatas = (
  searchFlatFieldMetadatas: FlatFieldMetadata[],
): FieldMetadataSettings<FieldMetadataType.TS_VECTOR> => {
  const searchableFields = searchFlatFieldMetadatas.filter(
    (flatFieldMetadata) => isSearchableFieldType(flatFieldMetadata.type),
  );

  return {
    asExpression: getTsVectorColumnExpressionFromFields(
      searchableFields.map((flatFieldMetadata) => ({
        name: flatFieldMetadata.name,
        type: flatFieldMetadata.type as SearchableFieldType,
      })),
    ),
    generatedType: 'STORED',
    searchFieldMetadataIds: searchableFields.map(
      (flatFieldMetadata) => flatFieldMetadata.id,
    ),
  };
};

// Resolves a set of field metadata ids against the flat maps then builds the
// searchVector settings. Ids that no longer resolve are dropped.
export const buildSearchVectorSettingsFromFieldMetadataIds = ({
  searchFieldMetadataIds,
  flatFieldMetadataMaps,
}: {
  searchFieldMetadataIds: string[];
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
}): FieldMetadataSettings<FieldMetadataType.TS_VECTOR> => {
  const resolvedFlatFieldMetadatas = searchFieldMetadataIds
    .map((fieldMetadataId) =>
      findFlatEntityByIdInFlatEntityMaps({
        flatEntityId: fieldMetadataId,
        flatEntityMaps: flatFieldMetadataMaps,
      }),
    )
    .filter(isDefined);

  return buildSearchVectorSettingsFromFlatFieldMetadatas(
    resolvedFlatFieldMetadatas,
  );
};
