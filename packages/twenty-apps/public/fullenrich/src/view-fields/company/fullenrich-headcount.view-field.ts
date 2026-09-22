import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { COMPANY_HEADCOUNT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: 'a184a982-e131-43bc-af5e-3716a91b6a08',
  viewUniversalIdentifier: COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: COMPANY_HEADCOUNT_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 2,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
