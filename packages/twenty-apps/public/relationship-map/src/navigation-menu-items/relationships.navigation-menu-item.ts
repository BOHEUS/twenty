import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
  RELATIONSHIPS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: RELATIONSHIPS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  position: 1,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: RELATIONSHIP_OBJECT_UNIVERSAL_IDENTIFIER,
});
