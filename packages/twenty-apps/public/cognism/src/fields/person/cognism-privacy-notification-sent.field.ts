import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismPrivacyNotificationSent,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'cognismPrivacyNotificationSent',
  label: 'GDPR Notice Sent',
  description:
    'Whether Cognism has sent this contact the GDPR privacy notification.',
  icon: 'IconShieldLock',
  isNullable: true,
});
