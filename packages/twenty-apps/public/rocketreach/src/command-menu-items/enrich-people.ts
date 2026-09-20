import {
  defineCommandMenuItem,
  isSelectAll,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  ROCKETREACH_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
  ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier:
    ROCKETREACH_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.enrichPeople,
  availabilityObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  frontComponentUniversalIdentifier:
    ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  label: 'Enrich people',
  availabilityType: 'RECORD_SELECTION',
  conditionalAvailabilityExpression: !isSelectAll,
});
