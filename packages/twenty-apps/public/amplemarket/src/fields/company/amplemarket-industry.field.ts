import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketIndustry,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'amplemarketIndustry',
  label: 'Industry',
  description: 'Industry returned by Amplemarket.',
  icon: 'IconBuildingFactory2',
  isNullable: true,
});
