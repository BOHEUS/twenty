import {
  FieldMetadataType,
  type ObjectsPermissions,
} from 'twenty-shared/types';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type OrmFlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/orm-flat-field-metadata.type';
import { findAllOthersMorphRelationFlatFieldMetadatasOrThrow } from 'src/engine/metadata-modules/flat-field-metadata/utils/find-all-others-morph-relation-flat-field-metadatas-or-throw.util';
import { isFlatFieldMetadataOfType } from 'src/engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

// Clients see one field per morph group, but each target has its own join column.
// Targets the requester cannot read are dropped, as the record views do, instead of
// failing the whole export on a restricted column.
export const expandMorphRelationExportFields = ({
  fields,
  flatObjectMetadata,
  flatObjectMetadataMaps,
  flatFieldMetadataMaps,
  objectsPermissions,
}: {
  fields: FlatFieldMetadata[];
  flatObjectMetadata: FlatObjectMetadata;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  flatFieldMetadataMaps: FlatEntityMaps<OrmFlatFieldMetadata>;
  objectsPermissions: ObjectsPermissions;
}): FlatFieldMetadata[] => {
  const restrictedFields =
    objectsPermissions[flatObjectMetadata.id]?.restrictedFields ?? {};

  const isReadableMorphTarget = (
    field: FlatFieldMetadata<FieldMetadataType.MORPH_RELATION>,
  ) =>
    field.isActive &&
    restrictedFields[field.id]?.canRead !== false &&
    findFlatEntityByIdInFlatEntityMaps({
      flatEntityMaps: flatObjectMetadataMaps,
      flatEntityId: field.relationTargetObjectMetadataId,
    })?.isActive === true &&
    objectsPermissions[field.relationTargetObjectMetadataId]
      ?.canReadObjectRecords === true;

  const expandedFields = fields.flatMap((field) =>
    isFlatFieldMetadataOfType(field, FieldMetadataType.MORPH_RELATION)
      ? [
          field,
          ...findAllOthersMorphRelationFlatFieldMetadatasOrThrow({
            flatFieldMetadataMaps,
            flatObjectMetadata,
            flatFieldMetadata: field,
          }),
        ]
          .filter(isReadableMorphTarget)
          .sort((left, right) => left.name.localeCompare(right.name))
      : [field],
  );

  return [
    ...new Map(expandedFields.map((field) => [field.id, field])).values(),
  ];
};
