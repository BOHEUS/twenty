import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataRevenueLowerBound,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.CURRENCY,
  name: 'crustdataRevenueLowerBound',
  label: 'Revenue Estimate (Low)',
  description: 'Lower bound of the Crustdata revenue estimate. Crustdata returns a range, so the two bounds are kept instead of a single annual revenue figure.',
  icon: 'IconMoneybag',
  isNullable: true,
});
