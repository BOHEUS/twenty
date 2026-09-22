import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { COMPANY_SPECIALTIES_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: 'c609a1d1-045a-4bc4-9c58-aba36adf263f',
  viewUniversalIdentifier: COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: COMPANY_SPECIALTIES_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 5,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
