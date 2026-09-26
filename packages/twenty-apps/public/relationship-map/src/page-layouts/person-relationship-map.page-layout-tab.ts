import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  PERSON_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  PERSON_RELATIONSHIP_MAP_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  PERSON_RELATIONSHIP_MAP_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayoutTab({
  universalIdentifier:
    PERSON_RELATIONSHIP_MAP_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage
      .universalIdentifier,
  title: 'Relationships',
  position: 1000,
  icon: 'IconAffiliate',
  layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
  widgets: [
    {
      universalIdentifier:
        PERSON_RELATIONSHIP_MAP_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIER,
      title: 'Relationships',
      type: 'FRONT_COMPONENT',
      heightBehavior: 'TAB_VIEWPORT',
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier:
          PERSON_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
