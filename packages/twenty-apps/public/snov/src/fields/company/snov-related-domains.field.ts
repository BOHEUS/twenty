import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovRelatedDomains,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'snovRelatedDomains',
  label: 'Related Domains',
  description: 'Other domains Snov.io links to the company.',
  icon: 'IconWorld',
  isNullable: true,
});
