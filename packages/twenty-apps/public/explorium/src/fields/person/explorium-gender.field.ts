import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { GENDER_OPTIONS } from 'src/constants/gender-options';
import {
  EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS,
  EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumGender,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'exploriumGender',
  label: 'Gender',
  description: 'Gender returned by Explorium.',
  icon: 'IconUser',
  isNullable: true,
  options: buildSelectOptions({
    meta: GENDER_OPTIONS,
    ids: EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.gender,
  }),
});
