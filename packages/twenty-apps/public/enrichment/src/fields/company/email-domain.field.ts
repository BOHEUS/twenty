import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.company.emailDomain,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'emailDomain',
  label: 'Email Domain',
  description: 'Domain used in employee email addresses.',
  icon: 'IconAt',
  isNullable: true,
});
