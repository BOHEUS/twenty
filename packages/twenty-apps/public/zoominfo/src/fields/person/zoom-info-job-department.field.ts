import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoJobDepartment,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'zoomInfoJobDepartment',
  label: 'Job Department',
  description: 'Department returned by ZoomInfo alongside the job function.',
  icon: 'IconUsersGroup',
  isNullable: true,
});
