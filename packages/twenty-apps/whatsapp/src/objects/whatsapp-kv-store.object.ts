import { defineObject, FieldType } from 'twenty-sdk/define';
import {
  KV_STORE_KEY_FIELD_UNIVERSAL_IDENTIFIER,
  KV_STORE_UNIVERSAL_IDENTIFIER,
  KV_STORE_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineObject({
  universalIdentifier: KV_STORE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'whatsappKVStore',
  namePlural: 'whatsappKVStores',
  labelSingular: 'WhatsApp KV Store',
  labelPlural: 'WhatsApp KV Store',
  description: 'Key-value storage for logic functions used by WhatsApp integration',
  icon: 'IconDatabase',
  fields: [
    {
      universalIdentifier: KV_STORE_KEY_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'key',
      type: FieldType.TEXT,
      label: 'Key',
      description: 'Unique lookup key',
      icon: 'IconKey',
    },
    {
      universalIdentifier: KV_STORE_VALUE_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'value',
      type: FieldType.RAW_JSON,
      label: 'Value',
      description: 'Stored JSON payload',
      icon: 'IconJson',
    },
  ],
});
