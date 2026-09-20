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
    ROCKETREACH_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  availabilityObjectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  frontComponentUniversalIdentifier:
    ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  label: 'Enrich companies',
  availabilityType: 'RECORD_SELECTION',
  conditionalAvailabilityExpression: !isSelectAll,
});
