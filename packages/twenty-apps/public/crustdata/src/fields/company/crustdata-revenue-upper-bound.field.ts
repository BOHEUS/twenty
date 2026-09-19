import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataRevenueUpperBound,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.CURRENCY,
  name: 'crustdataRevenueUpperBound',
  label: 'Revenue Estimate (High)',
  description: 'Upper bound of the Crustdata revenue estimate.',
  icon: 'IconMoneybag',
  isNullable: true,
});
