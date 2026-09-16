import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloRawPayload,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'apolloRawPayload',
  label: 'Apollo Raw Payload',
  description:
    'Unmapped person payload from the last Apollo response, kept so no returned data is lost.',
  icon: 'IconCode',
  isNullable: true,
});
