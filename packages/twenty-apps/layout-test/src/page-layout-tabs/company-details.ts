import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_DETAILS_TAB_UNIVERSAL_IDENTIFIER,
  COMPANY_DETAILS_LEFT_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER,
  COMPANY_DETAILS_RIGHT_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default definePageLayoutTab({
  universalIdentifier: COMPANY_DETAILS_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage
      .universalIdentifier,
  title: 'Details',
  position: 1000,
  icon: 'IconLayout',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    {
      universalIdentifier: COMPANY_DETAILS_LEFT_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER,
      title: 'Company Information',
      type: 'FIELDS',
      objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 6 },
      configuration: {
        configurationType: 'FIELDS',
        newFieldDefaultVisibility: true,
      },
    },
    {
      universalIdentifier: COMPANY_DETAILS_RIGHT_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER,
      title: 'Additional Information',
      type: 'FIELDS',
      objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      gridPosition: { row: 0, column: 6, rowSpan: 12, columnSpan: 6 },
      configuration: {
        configurationType: 'FIELDS',
        newFieldDefaultVisibility: true,
      },
    },
  ],
});
