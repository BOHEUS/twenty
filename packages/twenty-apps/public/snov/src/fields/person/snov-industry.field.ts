import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovIndustry,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'snovIndustry',
  label: 'Industry',
  description: 'Industry returned by Snov.io.',
  icon: 'IconBuildingFactory2',
  isNullable: true,
});
