import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumIndustry,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'exploriumIndustry',
  label: 'Industry',
  description: 'LinkedIn industry category returned by Explorium.',
  icon: 'IconBuildingFactory2',
  isNullable: true,
});
