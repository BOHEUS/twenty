import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactRequestId,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'dropcontactRequestId',
  label: 'Dropcontact Request ID',
  description: 'Dropcontact batch still being processed for this person.',
  icon: 'IconHourglass',
  isNullable: true,
});
