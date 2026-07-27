import { defineObject, FieldType } from 'twenty-sdk/define';
import {
  NAME_FIELD_UNIVERSAL_IDENTIFIER,
  SYNC_TOKEN_STORE_OBJECT_UNIVERSAL_IDENTIFIER
} from "src/constants/universal-identifiers";

export default defineObject({
  universalIdentifier: SYNC_TOKEN_STORE_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'syncTokenStore',
  namePlural: 'syncTokenStores',
  labelSingular: 'Sync token store',
  labelPlural: 'Sync token stores',
  icon: 'IconBox',
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'syncToken',
      label: 'Sync token',
      description: 'Sync token',
      icon: 'IconAbc',
    },
  ],
});
