import { defineIndex, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from "twenty-sdk/define";
import {
  WHATSAPP_ID_PEOPLE_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_ID_PEOPLE_INDEX_FIELD_UNIVERSAL_IDENTIFIER,
  WHATSAPP_ID_PEOPLE_INDEX_UNIVERSAL_IDENTIFIER
} from "src/constants/universal-identifiers";

export default defineIndex({
  universalIdentifier: WHATSAPP_ID_PEOPLE_INDEX_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  isUnique: true,
  fields: [
    {
      universalIdentifier: WHATSAPP_ID_PEOPLE_INDEX_FIELD_UNIVERSAL_IDENTIFIER,
      fieldUniversalIdentifier: WHATSAPP_ID_PEOPLE_FIELD_UNIVERSAL_IDENTIFIER,
    }
  ]
})