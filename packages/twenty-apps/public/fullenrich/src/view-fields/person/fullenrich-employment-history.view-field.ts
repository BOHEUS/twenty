import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { PERSON_EMPLOYMENT_HISTORY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: '56c53ec6-e2e5-4007-9d10-1bd3dcc418f1',
  viewUniversalIdentifier: PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: PERSON_EMPLOYMENT_HISTORY_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 7,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
