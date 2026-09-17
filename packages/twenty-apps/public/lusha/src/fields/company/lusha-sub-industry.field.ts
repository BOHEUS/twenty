import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaSubIndustry,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'lushaSubIndustry',
  label: 'Lusha Sub-Industry',
  description: 'Sub-industry returned by Lusha.',
  icon: 'IconBuildingFactory',
  isNullable: true,
});
