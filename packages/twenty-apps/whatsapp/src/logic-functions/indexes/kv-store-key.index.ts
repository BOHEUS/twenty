import { defineIndex } from 'twenty-sdk/define';
import {
  KV_INDEX_FIELD_UNIVERSAL_IDENTIFIER,
  KV_INDEX_UNIVERSAL_IDENTIFIER,
  KV_STORE_KEY_FIELD_UNIVERSAL_IDENTIFIER,
  KV_STORE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineIndex({
  universalIdentifier: KV_INDEX_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: KV_STORE_UNIVERSAL_IDENTIFIER,
  isUnique: true,
  fields: [
    {
      universalIdentifier: KV_INDEX_FIELD_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: KV_STORE_KEY_FIELD_UNIVERSAL_IDENTIFIER,
    },
  ],
});
