import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  applicationVariables: {
    TWENTY_API_URL: {
      universalIdentifier: '',
      isSecret: false,
      description: 'Required for webhooks',
    },
    FULLENRICH_API_KEY: {
      universalIdentifier: '8977420d-6a54-48e7-9d64-348e90b2bb5f',
      isSecret: true,
      description: 'Required to send a request to FullEnrich',
    },
    FULLENRICH_DATA_REQUIREMENTS: {
      universalIdentifier: '0824497a-8115-487a-9eb6-d4a47e8ac0bb',
      isSecret: false,
      type: FieldType.MULTI_SELECT,
      options: [
        {
          label: 'Work emails',
          value: 'contact.work_emails',
        },
        {
          label: 'Personal emails',
          value: 'contact.personal_emails',
        },
        {
          label: 'Phones',
          value: 'contact.phones',
        }
      ],
      description: 'Set a value to change depending how much data is needed',
      value: 'contact.work_emails',
    },
    FULLENRICH_REQUEST_CONSTRAINTS: {
      universalIdentifier: 'a4891a13-7904-4d4e-8fea-3a95fe8cea96',
      isSecret: false,
      description: 'Set a value to change requirements for sending request to FullEnrich',
    },
  },
  author: 'Twenty',
  emailSupport: 'contact@twenty.com',
  category: 'Enrichment',
});
