import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovRawPayload,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'snovRawPayload',
  label: 'Raw Payload',
  description: 'Full Snov.io response from the latest enrichment.',
  icon: 'IconCode',
  isNullable: true,
});
