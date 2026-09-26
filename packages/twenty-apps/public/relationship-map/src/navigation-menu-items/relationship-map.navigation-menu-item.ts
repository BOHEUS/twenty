import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  RELATIONSHIP_MAP_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_MAP_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: RELATIONSHIP_MAP_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Relationship map',
  icon: 'IconAffiliate',
  position: 0,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: RELATIONSHIP_MAP_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
