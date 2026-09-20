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
    APOLLO_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  availabilityObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  frontComponentUniversalIdentifier:
    APOLLO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  label: 'Enrich with Apollo',
  availabilityType: 'RECORD_SELECTION',
  conditionalAvailabilityExpression: !isSelectAll,
});
