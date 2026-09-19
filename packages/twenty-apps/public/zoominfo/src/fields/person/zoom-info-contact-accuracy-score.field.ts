import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoContactAccuracyScore,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'zoomInfoContactAccuracyScore',
  label: 'Accuracy Score',
  description: 'ZoomInfo contact accuracy score (0-100).',
  icon: 'IconGauge',
  isNullable: true,
});
