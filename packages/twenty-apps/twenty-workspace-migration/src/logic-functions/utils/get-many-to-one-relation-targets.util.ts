import { FieldMetadataType } from "src/logic-functions/types/field-metadata-type.enum";
import { FieldsListType, RelationType } from "src/logic-functions/types/find-objects-fields.type";
import { capitalize } from "src/logic-functions/utils/capitalize.util";

export type ManyToOneRelationTarget = {
  fieldName: string;
  foreignKeyName: string;
  targetNameSingular: string;
};

// The metadata API collapses a morph relation into a single field named after its group
// (`target`), while records expose one join column per target object (`targetPersonId`), named
// the way the server names morph fields: group name + capitalized target nameSingular.
export const getManyToOneRelationTargets = (field: FieldsListType): ManyToOneRelationTarget[] => {
  if (field.type === FieldMetadataType.RELATION) {
    if (field.relation?.type !== RelationType.MANY_TO_ONE) {
      return [];
    }
    return [{
      fieldName: field.name,
      foreignKeyName: `${field.name}Id`,
      targetNameSingular: field.relation.targetObjectMetadata.nameSingular,
    }];
  }

  if (field.type === FieldMetadataType.MORPH_RELATION) {
    return (field.morphRelations ?? [])
      .filter((relation) => relation.type === RelationType.MANY_TO_ONE)
      .map((relation) => {
        const fieldName = `${field.name}${capitalize(relation.targetObjectMetadata.nameSingular)}`;
        return {
          fieldName,
          foreignKeyName: `${fieldName}Id`,
          targetNameSingular: relation.targetObjectMetadata.nameSingular,
        };
      });
  }

  return [];
};
