import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.company.estimatedRevenueMax,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'estimatedRevenueMax',
  label: 'Estimated Revenue Max',
  description:
    'Upper bound of the estimated annual revenue, in USD. Equal to the lower bound when the provider returns one figure.',
  icon: 'IconCoin',
  isNullable: true,
});
