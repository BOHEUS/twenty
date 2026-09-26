import {
  defineObject,
  FieldType,
  getFieldUniversalIdentifier,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { RELATIONSHIP_TYPES } from 'src/constants/relationship-types';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  INCOMING_RELATIONSHIPS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  OUTGOING_RELATIONSHIPS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const PERSON_OBJECT_UNIVERSAL_IDENTIFIER =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier;

export default defineObject({
  universalIdentifier: RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'relationship',
  namePlural: 'relationships',
  labelSingular: 'Relationship',
  labelPlural: 'Relationships',
  description:
    'Junction object linking two people, such as who reports to or influences whom',
  icon: 'IconAffiliate',
  // Labelling by the engine-derived id keeps the SDK from adding a name field a junction has no use for
  labelIdentifierFieldMetadataUniversalIdentifier: getFieldUniversalIdentifier({
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
    name: 'id',
  }),
  fields: [
    {
      universalIdentifier: RELATIONSHIP_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'relationshipType',
      label: 'Type',
      icon: 'IconTag',
      isNullable: true,
      defaultValue: null,
      options: RELATIONSHIP_TYPES.map(({ value, label, color }, position) => ({
        value,
        label,
        color,
        position,
      })),
    },
    {
      universalIdentifier: RELATIONSHIP_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.RELATION,
      name: 'source',
      label: 'From',
      icon: 'IconUser',
      relationTargetObjectMetadataUniversalIdentifier:
        PERSON_OBJECT_UNIVERSAL_IDENTIFIER,
      relationTargetFieldMetadataUniversalIdentifier:
        OUTGOING_RELATIONSHIPS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.CASCADE,
        joinColumnName: 'sourceId',
      },
    },
    {
      universalIdentifier: RELATIONSHIP_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.RELATION,
      name: 'target',
      label: 'To',
      icon: 'IconUser',
      relationTargetObjectMetadataUniversalIdentifier:
        PERSON_OBJECT_UNIVERSAL_IDENTIFIER,
      relationTargetFieldMetadataUniversalIdentifier:
        INCOMING_RELATIONSHIPS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.CASCADE,
        joinColumnName: 'targetId',
      },
    },
  ],
});
