import { type FieldMetadataType } from 'twenty-shared/types';
import { findOrThrow, isDefined } from 'twenty-shared/utils';

import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { findManyFlatEntityByIdInFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import {
  ObjectMetadataException,
  ObjectMetadataExceptionCode,
} from 'src/engine/metadata-modules/object-metadata/object-metadata.exception';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';
import { buildSearchVectorSettingsFromFieldMetadataIds } from 'src/engine/metadata-modules/search-field-metadata/utils/build-search-vector-settings.util';
import { getSearchFieldMetadataIdsFromSearchVectorField } from 'src/engine/metadata-modules/search-field-metadata/utils/get-search-field-metadata-ids.util';

type RecomputeSearchVectorFieldAfterLabelIdentifierUpdateArgs = {
  existingFlatObjectMetadata: FlatObjectMetadata;
  labelIdentifierFieldMetadataUniversalIdentifier: string;
} & Pick<AllFlatEntityMaps, 'flatFieldMetadataMaps'>;

export const recomputeSearchVectorFieldAfterLabelIdentifierUpdate = ({
  existingFlatObjectMetadata,
  flatFieldMetadataMaps,
  labelIdentifierFieldMetadataUniversalIdentifier,
}: RecomputeSearchVectorFieldAfterLabelIdentifierUpdateArgs):
  | FlatFieldMetadata<FieldMetadataType.TS_VECTOR>
  | undefined => {
  const objectFlatFieldMetadatas =
    findManyFlatEntityByIdInFlatEntityMapsOrThrow({
      flatEntityMaps: flatFieldMetadataMaps,
      flatEntityIds: existingFlatObjectMetadata.fieldIds,
    });

  const searchVectorFlatFieldMetadata = findOrThrow(
    objectFlatFieldMetadatas,
    (field) => field.name === SEARCH_VECTOR_FIELD.name,
  ) as FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;

  const newLabelIdentifierField = findFlatEntityByUniversalIdentifier({
    flatEntityMaps: flatFieldMetadataMaps,
    universalIdentifier: labelIdentifierFieldMetadataUniversalIdentifier,
  });

  if (!isDefined(newLabelIdentifierField)) {
    throw new ObjectMetadataException(
      `New label identifier field not found for object metadata`,
      ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT,
    );
  }

  const previousLabelIdentifierFieldMetadataId =
    existingFlatObjectMetadata.labelIdentifierFieldMetadataId;

  const currentSearchFieldMetadataIds =
    getSearchFieldMetadataIdsFromSearchVectorField({
      searchVectorFlatFieldMetadata,
      objectFlatFieldMetadatas,
    });

  // Only follow the label identifier change when the previous label identifier
  // actually fed the search vector (the default for objects that never
  // customized their searchable fields). Otherwise respect the user selection.
  if (
    !isDefined(previousLabelIdentifierFieldMetadataId) ||
    !currentSearchFieldMetadataIds.includes(
      previousLabelIdentifierFieldMetadataId,
    )
  ) {
    return undefined;
  }

  const rebuiltSearchFieldMetadataIds = [
    ...new Set(
      currentSearchFieldMetadataIds.map((fieldMetadataId) =>
        fieldMetadataId === previousLabelIdentifierFieldMetadataId
          ? newLabelIdentifierField.id
          : fieldMetadataId,
      ),
    ),
  ];

  const newSearchVectorSettings = buildSearchVectorSettingsFromFieldMetadataIds(
    {
      searchFieldMetadataIds: rebuiltSearchFieldMetadataIds,
      flatFieldMetadataMaps,
    },
  );

  return {
    ...searchVectorFlatFieldMetadata,
    settings: newSearchVectorSettings,
    universalSettings: newSearchVectorSettings,
  };
};
