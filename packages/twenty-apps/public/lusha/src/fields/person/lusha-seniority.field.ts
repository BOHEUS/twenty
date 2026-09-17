import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_SENIORITY_OPTIONS } from 'src/constants/seniority-options.constant';
import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaSeniority,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'lushaSeniority',
  label: 'Lusha Seniority',
  description: 'Seniority level returned by Lusha.',
  icon: 'IconStairsUp',
  isNullable: true,
  options: [...LUSHA_SENIORITY_OPTIONS],
});
