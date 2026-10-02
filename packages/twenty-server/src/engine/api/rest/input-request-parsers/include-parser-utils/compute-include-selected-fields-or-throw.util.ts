import { type ObjectsPermissions } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { STANDARD_ERROR_MESSAGE } from 'src/engine/api/common/common-query-runners/errors/standard-error-message.constant';
import { getAllSelectableFields } from 'src/engine/api/common/common-select-fields/utils/get-all-selectable-fields.util';
import { getReadableRelationTargetFlatObjectMetadata } from 'src/engine/api/common/common-select-fields/utils/get-readable-relation-target-flat-object-metadata.util';
import { type CommonSelectedFields } from 'src/engine/api/common/types/common-selected-fields-result.type';
import {
  RestInputRequestParserException,
  RestInputRequestParserExceptionCode,
} from 'src/engine/api/rest/input-request-parsers/rest-input-request-parser.exception';
import { type RelationIncludeTree } from 'src/engine/api/rest/input-request-parsers/types/relation-include-tree.type';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type OrmFlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/orm-flat-field-metadata.type';
import { buildFieldMapsFromFlatObjectMetadata } from 'src/engine/metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

export const computeIncludeSelectedFieldsOrThrow = ({
  includeTree,
  flatObjectMetadata,
  flatObjectMetadataMaps,
  flatFieldMetadataMaps,
  objectsPermissions,
}: {
  includeTree: RelationIncludeTree;
  flatObjectMetadata: FlatObjectMetadata;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  flatFieldMetadataMaps: FlatEntityMaps<OrmFlatFieldMetadata>;
  objectsPermissions: ObjectsPermissions;
}): CommonSelectedFields => {
  const selectedFields: CommonSelectedFields = {};

  const { fieldIdByName } = buildFieldMapsFromFlatObjectMetadata(
    flatFieldMetadataMaps,
    flatObjectMetadata,
  );

  for (const [relationFieldName, nestedIncludeTree] of Object.entries(
    includeTree,
  )) {
    const flatField = findFlatEntityByIdInFlatEntityMaps({
      flatEntityMaps: flatFieldMetadataMaps,
      flatEntityId: fieldIdByName[relationFieldName],
    });

    const relationTargetObjectMetadata = isDefined(flatField)
      ? getReadableRelationTargetFlatObjectMetadata({
          flatField,
          flatObjectMetadata,
          flatObjectMetadataMaps,
          objectsPermissions,
        })
      : undefined;

    // Unknown and unreadable relations share one error so the response does
    // not reveal fields hidden by permissions
    if (!isDefined(relationTargetObjectMetadata)) {
      throw new RestInputRequestParserException(
        `'include' parameter invalid. '${relationFieldName}' is not a readable relation of '${flatObjectMetadata.nameSingular}'`,
        RestInputRequestParserExceptionCode.INVALID_INCLUDE_QUERY_PARAM,
        { userFriendlyMessage: STANDARD_ERROR_MESSAGE },
      );
    }

    selectedFields[relationFieldName] = {
      ...getAllSelectableFields({
        restrictedFields:
          objectsPermissions[relationTargetObjectMetadata.id].restrictedFields,
        flatObjectMetadata: relationTargetObjectMetadata,
        flatFieldMetadataMaps,
      }),
      ...computeIncludeSelectedFieldsOrThrow({
        includeTree: nestedIncludeTree,
        flatObjectMetadata: relationTargetObjectMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        objectsPermissions,
      }),
    };
  }

  return selectedFields;
};
