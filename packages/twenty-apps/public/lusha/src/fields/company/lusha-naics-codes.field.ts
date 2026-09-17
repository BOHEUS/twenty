import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaNaicsCodes,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'lushaNaicsCodes',
  label: 'Lusha NAICS Codes',
  description: 'NAICS industry codes returned by Lusha.',
  icon: 'IconHash',
  isNullable: true,
});
