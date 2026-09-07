import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { REVENUE_STANDALONE_PAGE_UNIVERSAL_IDENTIFIER } from 'src/page-layouts/revenue-standalone-page.page-layout';

// Pointing this at the DASHBOARD layout instead fails app sync with
// "PAGE_LAYOUT navigation menu item must reference a STANDALONE_PAGE page layout".
export default defineNavigationMenuItem({
  universalIdentifier: '2880f334-a9a8-4256-a165-5c20c994ec7e',
  name: 'Revenue Overview',
  icon: 'IconChartBar',
  position: 0,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: REVENUE_STANDALONE_PAGE_UNIVERSAL_IDENTIFIER,
});
