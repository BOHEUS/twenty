import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { COMPANY_DESCRIPTION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: '42dd8f83-2a83-44de-a878-e8988a48fa1c',
  viewUniversalIdentifier: COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: COMPANY_DESCRIPTION_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 0,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
