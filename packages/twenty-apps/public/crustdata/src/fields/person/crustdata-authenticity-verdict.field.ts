import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { AUTHENTICITY_VERDICT_OPTIONS } from 'src/constants/authenticity-verdict-options';
import {
  CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS,
  CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataAuthenticityVerdict,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'crustdataAuthenticityVerdict',
  label: 'Authenticity',
  description: 'How well the profile stands up to verification. A sparse profile is expected to read as Cannot verify.',
  icon: 'IconShieldCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: AUTHENTICITY_VERDICT_OPTIONS,
    ids: CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.authenticityVerdict,
  }),
});
