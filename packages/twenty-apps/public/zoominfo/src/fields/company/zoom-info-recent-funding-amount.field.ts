import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoRecentFundingAmount,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.CURRENCY,
  name: 'zoomInfoRecentFundingAmount',
  label: 'Recent Funding Amount',
  description: 'Most recent funding amount returned by ZoomInfo.',
  icon: 'IconCash',
  isNullable: true,
});
