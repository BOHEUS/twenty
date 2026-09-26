import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_POWER_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  COMPANY_POWER_MAP_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  COMPANY_POWER_MAP_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayoutTab({
  universalIdentifier: COMPANY_POWER_MAP_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage
      .universalIdentifier,
  title: 'Power map',
  position: 1000,
  icon: 'IconAffiliate',
  layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
  widgets: [
    {
      universalIdentifier:
        COMPANY_POWER_MAP_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIER,
      title: 'Power map',
      type: 'FRONT_COMPONENT',
      heightBehavior: 'TAB_VIEWPORT',
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier:
          COMPANY_POWER_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
