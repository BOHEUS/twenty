import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { COMPANY_LINKEDIN_FOLLOWER_COUNT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: '442c4968-ea85-4fa3-b554-48600b2d74ec',
  viewUniversalIdentifier: COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: COMPANY_LINKEDIN_FOLLOWER_COUNT_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 9,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
