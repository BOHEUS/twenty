import { type FieldMetadataType } from 'twenty-shared/types';
import { findOrThrow } from 'twenty-shared/utils';

import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { findManyFlatEntityByIdInFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { isSearchableFieldType } from 'src/engine/workspace-manager/utils/is-searchable-field.util';
import {
  ObjectMetadataException,
  ObjectMetadataExceptionCode,
} from 'src/engine/metadata-modules/object-metadata/object-metadata.exception';

type recomputeSearchVectorFieldAfterLabelIdentifierUpdateArgs = {
  existingFlatObjectMetadata: FlatObjectMetadata;
} & Pick<AllFlatEntityMaps, 'flatFieldMetadataMaps'>;

export const recomputeSearchVectorField = ({
  existingFlatObjectMetadata,
  flatFieldMetadataMaps,
}: recomputeSearchVectorFieldAfterLabelIdentifierUpdateArgs):
  | FlatFieldMetadata<FieldMetadataType.TS_VECTOR>
  | undefined => {
  const objectFlatFieldMetadatas =
    findManyFlatEntityByIdInFlatEntityMapsOrThrow({
      flatEntityMaps: flatFieldMetadataMaps,
      flatEntityIds: existingFlatObjectMetadata.fieldIds,
    });

  const searchVectorField = findOrThrow(
    objectFlatFieldMetadatas,
    (field) => field.name === SEARCH_VECTOR_FIELD.name,
  ) as FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;

  const searchableFields = objectFlatFieldMetadatas
    .filter(
      (objectFlatFieldMetadata) =>
        objectFlatFieldMetadata.isSearchable === true &&
        isSearchableFieldType(objectFlatFieldMetadata.type),
    )
    .map(
      (field) =>
        ({
          name: field.name,
          type: field.type,
        }) as FieldTypeAndNameMetadata,
    );

  try {
    const newAsExpression =
      getTsVectorColumnExpressionFromFields(searchableFields);

    return {
      ...searchVectorField,
      universalSettings: {
        ...searchVectorField.universalSettings,
        asExpression: newAsExpression,
        generatedType: 'STORED',
      },
    };
  } catch {
    throw new ObjectMetadataException(
      `Failed to compute search vector column expression for field`,
      ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT,
    );
  }
};
