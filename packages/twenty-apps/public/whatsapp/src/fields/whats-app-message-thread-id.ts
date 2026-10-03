import { defineField, FieldType, RelationType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';
import {
  MESSAGE_THREAD_RELATION_WHATSAPP_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_MESSAGE_THREAD_RELATION_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_MESSAGE_THREAD_UNIVERSAL_IDENTIFIER
} from "src/constants/universal-identifiers";

export default defineField({
  universalIdentifier: MESSAGE_THREAD_RELATION_WHATSAPP_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
  name: 'whatsAppMessageThreadId',
  label: 'WhatsApp Message Thread',
  type: FieldType.RELATION,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThread.universalIdentifier,
  relationTargetObjectMetadataUniversalIdentifier: WHATSAPP_MESSAGE_THREAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: WHATSAPP_MESSAGE_THREAD_RELATION_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
