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
    WHATSAPP_CLIENT_ID: {
      description: "OAuth client ID issued by the third-party provider. Filled in once by the server admin on the application registration.",
      isSecret: false,
      isRequired: true,
    },
    WHATSAPP_CLIENT_SECRET: {
      description: "OAuth client secret issued by the third-party provider. Stored encrypted; never echoed in API responses.",
      isSecret: true,
      isRequired: true,
    },
  },
  applicationVariables: {
    VERIFY_TOKEN: {
      universalIdentifier: "",
      isSecret: true,
      description: 'Secret token used to validate webhooks',
    },
    WEBHOOK_VALIDATION_SECRET: {
      universalIdentifier: "",
      isSecret: true,
      description: 'Secret required to validate webhooks from WhatsApp',
    },
    ACCESS_TOKEN: {
      universalIdentifier: "",
      isSecret: true,
      description: 'Access token required to download files sent in chats',
    }
  },
  category: 'Messaging',
  emailSupport: 'contact@twenty.com'
});
