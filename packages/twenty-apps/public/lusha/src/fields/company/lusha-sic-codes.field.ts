import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaSicCodes,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'lushaSicCodes',
  label: 'Lusha SIC Codes',
  description: 'SIC industry codes returned by Lusha.',
  icon: 'IconHash',
  isNullable: true,
});
