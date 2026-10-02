import {
  FieldMetadataType,
  type ObjectsPermissions,
} from 'twenty-shared/types';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util';
import { type OrmFlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/orm-flat-field-metadata.type';
import { isFlatFieldMetadataOfType } from 'src/engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

export const getReadableRelationTargetFlatObjectMetadata = ({
  flatField,
  flatObjectMetadata,
  flatObjectMetadataMaps,
  objectsPermissions,
}: {
  flatField: OrmFlatFieldMetadata;
  flatObjectMetadata: FlatObjectMetadata;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  objectsPermissions: ObjectsPermissions;
}): FlatObjectMetadata | undefined => {
  if (
    !isFlatFieldMetadataOfType(flatField, FieldMetadataType.RELATION) &&
    !isFlatFieldMetadataOfType(flatField, FieldMetadataType.MORPH_RELATION)
  ) {
    return undefined;
  }

  if (
    objectsPermissions[flatObjectMetadata.id]?.restrictedFields[flatField.id]
      ?.canRead === false
  ) {
    return undefined;
  }

  const relationTargetObjectMetadata =
    findFlatEntityByIdInFlatEntityMapsOrThrow({
      flatEntityMaps: flatObjectMetadataMaps,
      flatEntityId: flatField.relationTargetObjectMetadataId,
    });

  if (
    !objectsPermissions[relationTargetObjectMetadata.id]?.canReadObjectRecords
  ) {
    return undefined;
  }

  return relationTargetObjectMetadata;
};
