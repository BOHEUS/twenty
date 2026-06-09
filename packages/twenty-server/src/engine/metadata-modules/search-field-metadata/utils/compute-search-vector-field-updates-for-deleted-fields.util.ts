import { type FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { findManyFlatEntityByIdInFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';
import { buildSearchVectorSettingsFromFlatFieldMetadatas } from 'src/engine/metadata-modules/search-field-metadata/utils/build-search-vector-settings.util';
import { getSearchFieldMetadataIdsFromSearchVectorField } from 'src/engine/metadata-modules/search-field-metadata/utils/get-search-field-metadata-ids.util';

// Postgres rejects dropping a column that a generated column still references.
// When a field that feeds the search vector is deleted, the searchVector must
// first be rebuilt to exclude it. Returns the searchVector field updates (one
// per affected object) to run as a preliminary migration before the field
// delete (field deletes run before field updates within a single migration, so
// the rebuild cannot ride along in the same migration).
export const computeSearchVectorFieldUpdatesForDeletedFields = ({
  deletedFieldMetadataIds,
  flatObjectMetadataMaps,
  flatFieldMetadataMaps,
}: {
  deletedFieldMetadataIds: string[];
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
}): FlatFieldMetadata<FieldMetadataType.TS_VECTOR>[] => {
  const deletedFieldMetadataIdsByObjectMetadataId = new Map<
    string,
    Set<string>
  >();

  for (const deletedFieldMetadataId of deletedFieldMetadataIds) {
    const deletedFlatFieldMetadata = findFlatEntityByIdInFlatEntityMaps({
      flatEntityId: deletedFieldMetadataId,
      flatEntityMaps: flatFieldMetadataMaps,
    });

    if (!isDefined(deletedFlatFieldMetadata)) {
      continue;
    }

    const objectMetadataId = deletedFlatFieldMetadata.objectMetadataId;
    const existingSet =
      deletedFieldMetadataIdsByObjectMetadataId.get(objectMetadataId) ??
      new Set<string>();

    existingSet.add(deletedFieldMetadataId);
    deletedFieldMetadataIdsByObjectMetadataId.set(
      objectMetadataId,
      existingSet,
    );
  }

  const searchVectorFieldUpdates: FlatFieldMetadata<FieldMetadataType.TS_VECTOR>[] =
    [];

  for (const [
    objectMetadataId,
    deletedIdsForObject,
  ] of deletedFieldMetadataIdsByObjectMetadataId) {
    const flatObjectMetadata = findFlatEntityByIdInFlatEntityMaps({
      flatEntityId: objectMetadataId,
      flatEntityMaps: flatObjectMetadataMaps,
    });

    if (!isDefined(flatObjectMetadata)) {
      continue;
    }

    const objectFlatFieldMetadatas =
      findManyFlatEntityByIdInFlatEntityMapsOrThrow({
        flatEntityMaps: flatFieldMetadataMaps,
        flatEntityIds: flatObjectMetadata.fieldIds,
      });

    const searchVectorFlatFieldMetadata = objectFlatFieldMetadatas.find(
      (flatFieldMetadata) =>
        flatFieldMetadata.name === SEARCH_VECTOR_FIELD.name,
    ) as FlatFieldMetadata<FieldMetadataType.TS_VECTOR> | undefined;

    if (!isDefined(searchVectorFlatFieldMetadata)) {
      continue;
    }

    const searchFieldMetadataIds =
      getSearchFieldMetadataIdsFromSearchVectorField({
        searchVectorFlatFieldMetadata,
        objectFlatFieldMetadatas,
      });

    const remainingSearchFieldMetadataIds = searchFieldMetadataIds.filter(
      (fieldMetadataId) => !deletedIdsForObject.has(fieldMetadataId),
    );

    if (
      remainingSearchFieldMetadataIds.length === searchFieldMetadataIds.length
    ) {
      continue;
    }

    const remainingSearchFlatFieldMetadatas = remainingSearchFieldMetadataIds
      .map((fieldMetadataId) =>
        findFlatEntityByIdInFlatEntityMaps({
          flatEntityId: fieldMetadataId,
          flatEntityMaps: flatFieldMetadataMaps,
        }),
      )
      .filter(isDefined);

    const newSearchVectorSettings =
      buildSearchVectorSettingsFromFlatFieldMetadatas(
        remainingSearchFlatFieldMetadatas,
      );

    searchVectorFieldUpdates.push({
      ...searchVectorFlatFieldMetadata,
      settings: newSearchVectorSettings,
      universalSettings: newSearchVectorSettings,
    });
  }

  return searchVectorFieldUpdates;
};
