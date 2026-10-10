import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovId,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'snovId',
  label: 'Snov.io ID',
  description: 'Snov.io profile ID.',
  icon: 'IconId',
  isNullable: true,
});
