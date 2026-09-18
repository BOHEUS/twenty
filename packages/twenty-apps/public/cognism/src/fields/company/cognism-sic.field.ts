import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismSic,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'cognismSic',
  label: 'SIC Codes',
  description: 'SIC classification codes returned by Cognism.',
  icon: 'IconHash',
  isNullable: true,
});
