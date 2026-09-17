import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaRevenueRange,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'lushaRevenueRange',
  label: 'Lusha Revenue Range',
  description: 'Annual revenue range returned by Lusha, such as $10M-$50M.',
  icon: 'IconReportMoney',
  isNullable: true,
});
