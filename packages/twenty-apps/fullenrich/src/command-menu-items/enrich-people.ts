import { defineCommandMenuItem, isSelectAll, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';
import {
  COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER
} from "src/constants/universal-identifiers";

export default defineCommandMenuItem({
  universalIdentifier: COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  label: 'Enrich with FullEnrich',
  availabilityObjectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  frontComponentUniversalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  availabilityType: 'RECORD_SELECTION',
  conditionalAvailabilityExpression: !isSelectAll,
});
