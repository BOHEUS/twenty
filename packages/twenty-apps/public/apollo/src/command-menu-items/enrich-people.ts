import {
  defineCommandMenuItem,
  isSelectAll,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  APOLLO_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
  APOLLO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier:
    APOLLO_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.enrichPeople,
  availabilityObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  frontComponentUniversalIdentifier:
    APOLLO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  label: 'Enrich with Apollo',
  availabilityType: 'RECORD_SELECTION',
  // Select-all hands over no ids, so the command would have nothing to enrich.
  conditionalAvailabilityExpression: !isSelectAll,
});
