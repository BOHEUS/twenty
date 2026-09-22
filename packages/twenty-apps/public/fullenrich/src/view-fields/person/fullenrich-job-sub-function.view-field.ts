import { defineViewField } from 'twenty-sdk/define';

import {
  APP_VIEW_FIELD_START_POSITION,
  PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';
import { PERSON_JOB_SUB_FUNCTION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineViewField({
  universalIdentifier: 'd2b51081-939d-470d-9484-122ee2db9f8c',
  viewUniversalIdentifier: PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  fieldMetadataUniversalIdentifier: PERSON_JOB_SUB_FUNCTION_FIELD_UNIVERSAL_IDENTIFIER,
  position: APP_VIEW_FIELD_START_POSITION + 5,
  // Available in the view's field picker without widening the default table
  isVisible: false,
});
