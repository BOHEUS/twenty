import { defineField, FieldType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'bd71e912-3d3d-491f-8d60-d575189a6d54',
  name: 'whatsapp-id',
  label: 'WhatsApp ID',
  description: 'WhatsApp ID used to find people in group conversations',
  type: FieldType.NUMBER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
});
