import { defineApplication } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  logoUrl: 'public/logo.svg',
  author: 'Twenty',
  serverVariables: {
    WEBHOOK_VALIDATION_SECRET: {
      isSecret: true,
      isRequired: true,
      description: 'Secret required to validate webhooks from WhatsApp',
    }
  },
  category: 'Messaging',
  emailSupport: 'contact@twenty.com'
});
