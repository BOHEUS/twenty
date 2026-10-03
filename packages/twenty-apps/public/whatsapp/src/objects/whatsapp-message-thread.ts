import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS
} from 'twenty-sdk/define';
import {
  MESSAGE_THREAD_RELATION_WHATSAPP_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_MESSAGE_THREAD_PERSON_WHATSAPP_ID_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_MESSAGE_THREAD_RELATION_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_MESSAGE_THREAD_UNIVERSAL_IDENTIFIER
} from "src/constants/universal-identifiers";

export default defineObject({
  universalIdentifier: WHATSAPP_MESSAGE_THREAD_UNIVERSAL_IDENTIFIER,
  nameSingular: 'whatsAppMessageThread',
  namePlural: 'whatsAppMessageThreads',
  labelSingular: 'WhatsApp message thread',
  labelPlural: 'WhatsApp message threads',
  description: 'Lookup table for WhatsApp message threads linked to People by WhatsApp ID',
  icon: 'IconBox',
  fields: [
    {
      universalIdentifier: WHATSAPP_MESSAGE_THREAD_PERSON_WHATSAPP_ID_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'whatsAppId',
      label: 'WhatsApp ID',
      description: 'WhatsApp ID of related Person',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: WHATSAPP_MESSAGE_THREAD_RELATION_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.RELATION,
      name: 'messageThread',
      label: 'Message thread',
      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThread.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: MESSAGE_THREAD_RELATION_WHATSAPP_MESSAGE_THREAD_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'whatsAppMessageThread',
      }
    }
  ],
});
