import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { PERSON_SENIORITY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: '1855bdf4-60a2-4235-9d89-666db816aa35',
  viewUniversalIdentifier: PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: PERSON_SENIORITY_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 3,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
