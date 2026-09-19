import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataXLink,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.LINKS,
  name: 'crustdataXLink',
  label: 'X',
  description: 'X profile built from the handle returned by Crustdata.',
  icon: 'IconBrandX',
  isNullable: true,
});
