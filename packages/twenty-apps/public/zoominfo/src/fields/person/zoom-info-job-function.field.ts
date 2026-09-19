import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoJobFunction,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'zoomInfoJobFunction',
  label: 'Job Function',
  description: 'Job function returned by ZoomInfo.',
  icon: 'IconBriefcase',
  isNullable: true,
});
