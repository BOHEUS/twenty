import { defineField, FieldType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '17726d08-1523-429c-9bf0-654b1691a451',
  name: 'whatsapp-id',
  label: 'WhatsApp ID',
  type: FieldType.TEXT,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.message.universalIdentifier,
});
