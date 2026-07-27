import { defineField, FieldType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '51e8733e-09b4-4b90-8923-edae357d9c5f',
  name: 'googleContactsId',
  label: 'Google Contacts ID',
  type: FieldType.TEXT,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  isUnique: true,
  isNullable: true,
  isUIEditable: false,
});
