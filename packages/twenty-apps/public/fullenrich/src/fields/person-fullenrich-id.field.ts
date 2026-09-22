import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_FULLENRICH_ID_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_FULLENRICH_ID_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'fullEnrichPersonId',
  type: FieldType.UUID,
  label: 'FullEnrich ID',
  description:
    'FullEnrich profile id, used to correlate re-enrichments with an earlier result.',
  icon: 'IconFingerprint',
  isNullable: true,
  isUIEditable: false,
});
