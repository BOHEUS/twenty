import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EMAIL_QUALITY_OPTIONS } from 'src/constants/email-quality-options';
import {
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/logic-functions/data/build-select-options';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismEmailQuality,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'cognismEmailQuality',
  label: 'Email Quality',
  description: 'Deliverability rating Cognism assigns to the work email.',
  icon: 'IconMailCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: EMAIL_QUALITY_OPTIONS,
    ids: COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.emailQuality,
  }),
});
