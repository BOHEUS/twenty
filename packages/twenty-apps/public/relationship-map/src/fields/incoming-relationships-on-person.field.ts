import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  INCOMING_RELATIONSHIPS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: INCOMING_RELATIONSHIPS_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'incomingRelationships',
  label: 'Relationships from',
  description: 'People who report to, influence or work with this person',
  icon: 'IconAffiliate',
  relationTargetObjectMetadataUniversalIdentifier:
    RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    RELATIONSHIP_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
    junctionTargetFieldUniversalIdentifier:
      RELATIONSHIP_SOURCE_FIELD_UNIVERSAL_IDENTIFIER,
  },
});
