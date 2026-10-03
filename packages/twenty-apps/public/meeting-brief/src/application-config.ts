import { defineApplication } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  logo: 'public/logo.svg',
  author: 'Twenty',
  category: 'Productivity',
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
});
