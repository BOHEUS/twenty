import { compositeTypeDefinitions, RelationType } from 'twenty-shared/types';

import { isCompositeFieldMetadataType } from 'src/engine/metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util';
import { isMorphOrRelationUniversalFlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util';
import { type UniversalFlatFieldMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-field-metadata.type';

export const countUniversalFlatFieldMetadataColumns = (
  universalFlatFieldMetadata: UniversalFlatFieldMetadata,
): number => {
  if (isCompositeFieldMetadataType(universalFlatFieldMetadata.type)) {
    return (
      compositeTypeDefinitions.get(universalFlatFieldMetadata.type)?.properties
        .length ?? 0
    );
  }

  if (isMorphOrRelationUniversalFlatFieldMetadata(universalFlatFieldMetadata)) {
    return universalFlatFieldMetadata.universalSettings.relationType ===
      RelationType.MANY_TO_ONE
      ? 1
      : 0;
  }

  return 1;
};
