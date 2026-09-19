import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataCertifications,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'crustdataCertifications',
  label: 'Certifications',
  description: 'Certifications returned by Crustdata. Requires field-level access on the API key.',
  icon: 'IconCertificate',
  isNullable: true,
});
