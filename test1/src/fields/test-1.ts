import { defineField, FieldType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '14a19f82-970e-4e9d-bea2-4d5e80ed1845',
  name: 'test1',
  label: 'Test 1',
  type: FieldType.TEXT,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
});
