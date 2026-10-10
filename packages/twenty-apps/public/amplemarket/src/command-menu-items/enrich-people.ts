import {
  defineCommandMenuItem,
  isSelectAll,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  AMPLEMARKET_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
  AMPLEMARKET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier:
    AMPLEMARKET_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.enrichPeople,
  availabilityObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  frontComponentUniversalIdentifier:
    AMPLEMARKET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  label: 'Enrich people',
  availabilityType: 'RECORD_SELECTION',
  conditionalAvailabilityExpression: !isSelectAll,
});
