import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { PERSON_FULLENRICH_ID_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: '7ad3e2f7-a59f-4886-a472-b1654ce9c6bd',
  viewUniversalIdentifier: PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: PERSON_FULLENRICH_ID_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 13,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
