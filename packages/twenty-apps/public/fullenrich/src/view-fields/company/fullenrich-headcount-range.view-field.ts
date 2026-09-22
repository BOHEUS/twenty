import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { COMPANY_HEADCOUNT_RANGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: '263eebb6-6b5e-455a-82c7-07b4b1097dea',
  viewUniversalIdentifier: COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: COMPANY_HEADCOUNT_RANGE_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 3,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
