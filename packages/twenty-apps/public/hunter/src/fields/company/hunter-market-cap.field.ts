import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterMarketCap,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.CURRENCY,
  name: 'hunterMarketCap',
  label: 'Market Cap',
  description: 'Market capitalization returned by Hunter.',
  icon: 'IconChartLine',
  isNullable: true,
});
