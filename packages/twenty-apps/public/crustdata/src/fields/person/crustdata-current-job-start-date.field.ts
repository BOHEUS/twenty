import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataCurrentJobStartDate,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.DATE,
  name: 'crustdataCurrentJobStartDate',
  label: 'Current Job Start Date',
  description: 'Start date of the current role.',
  icon: 'IconCalendar',
  isNullable: true,
});
