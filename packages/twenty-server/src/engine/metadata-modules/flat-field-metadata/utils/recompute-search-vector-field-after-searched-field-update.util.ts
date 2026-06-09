import { type FieldMetadataType, type FromTo } from 'twenty-shared/types';
import { findOrThrow, isDefined } from 'twenty-shared/utils';

import {
  FieldMetadataException,
  FieldMetadataExceptionCode,
} from 'src/engine/metadata-modules/field-metadata/field-metadata.exception';
import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { findManyFlatEntityByIdInFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';
import { buildSearchVectorSettingsFromFlatFieldMetadatas } from 'src/engine/metadata-modules/search-field-metadata/utils/build-search-vector-settings.util';
import { getSearchFieldMetadataIdsFromSearchVectorField } from 'src/engine/metadata-modules/search-field-metadata/utils/get-search-field-metadata-ids.util';

// When a field that feeds the search vector is renamed, its generated column
// expression references the stale column name. Rebuild the searchVector
// asExpression from the full searched set, substituting the renamed field's new
// definition. Returns undefined when the renamed field is not part of the set.
export const recomputeSearchVectorFieldAfterSearchedFieldUpdate = ({
  fromFlatFieldMetadata,
  toFlatFieldMetadata,
  flatObjectMetadata,
  flatFieldMetadataMaps,
}: {
  flatObjectMetadata: FlatObjectMetadata;
} & FromTo<FlatFieldMetadata, 'flatFieldMetadata'> &
  Pick<AllFlatEntityMaps, 'flatFieldMetadataMaps'>):
  | FlatFieldMetadata<FieldMetadataType.TS_VECTOR>
  | undefined => {
  if (fromFlatFieldMetadata.name === toFlatFieldMetadata.name) {
    return undefined;
  }

  const objectFlatFieldMetadatas =
    findManyFlatEntityByIdInFlatEntityMapsOrThrow({
      flatEntityMaps: flatFieldMetadataMaps,
      flatEntityIds: flatObjectMetadata.fieldIds,
    });

  const searchVectorFlatFieldMetadata = findOrThrow(
    objectFlatFieldMetadatas,
    (field) => field.name === SEARCH_VECTOR_FIELD.name,
    new FieldMetadataException(
      `Search vector field not found for object metadata ${flatObjectMetadata.id}`,
      FieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND,
    ),
  ) as FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;

  const searchFieldMetadataIds = getSearchFieldMetadataIdsFromSearchVectorField(
    {
      searchVectorFlatFieldMetadata,
      objectFlatFieldMetadatas,
    },
  );

  if (!searchFieldMetadataIds.includes(toFlatFieldMetadata.id)) {
    return undefined;
  }

  const searchFlatFieldMetadatas = searchFieldMetadataIds
    .map((fieldMetadataId) =>
      fieldMetadataId === toFlatFieldMetadata.id
        ? toFlatFieldMetadata
        : findFlatEntityByIdInFlatEntityMaps({
            flatEntityId: fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps,
          }),
    )
    .filter(isDefined);

  const newSearchVectorSettings =
    buildSearchVectorSettingsFromFlatFieldMetadatas(searchFlatFieldMetadatas);

  return {
    ...searchVectorFlatFieldMetadata,
    settings: newSearchVectorSettings,
    universalSettings: newSearchVectorSettings,
  };
};
