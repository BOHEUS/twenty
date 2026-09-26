import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

import {
  RELATIONSHIP_MAP_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_MAP_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  RELATIONSHIP_MAP_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIER,
  WORKSPACE_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayout({
  universalIdentifier: RELATIONSHIP_MAP_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Relationship map',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: RELATIONSHIP_MAP_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Relationship map',
      position: 0,
      icon: 'IconAffiliate',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier:
            RELATIONSHIP_MAP_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIER,
          title: 'Relationship map',
          type: 'FRONT_COMPONENT',
          heightBehavior: 'TAB_VIEWPORT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier:
              WORKSPACE_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
