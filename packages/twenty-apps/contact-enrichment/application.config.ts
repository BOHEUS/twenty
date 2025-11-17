import { type ApplicationConfig } from 'twenty-sdk/application';

const config: ApplicationConfig = {
  universalIdentifier: 'b79d2b84-0092-4125-9d63-0d8e4c96462c',
  displayName: 'Contact enrichment',
  description: 'Contact enrichment with Fullenrich',
  icon: "IconEyeglass",
  applicationVariables: {
    TWENTY_API_KEY: {
      universalIdentifier: "f7855fb2-9a4d-4574-8103-e160f2ef3195",
      isSecret: true,
      description: 'Required to send a request to Twenty',
    },
    TWENTY_API_URL: {
      universalIdentifier: "384bd73c-34ed-42e5-bc1c-29b564ee0d4b",
      isSecret: false,
      description: 'Optional, defaults to cloud API URL',
    },
    TWENTY_URL: {
      universalIdentifier: "3f35fc28-72a4-4166-9d7b-8057600423c8",
      isSecret: false,
      description: 'Required to let know Fullenrich where enrichment must be sent once it\'s done',
    },
    FULLENRICH_API_KEY: {
      universalIdentifier: "8977420d-6a54-48e7-9d64-348e90b2bb5f",
      isSecret: true,
      description: 'Required to send a request to Twenty',
    },
    FULLENRICH_DATA_REQUIREMENTS: {
      universalIdentifier: "0824497a-8115-487a-9eb6-d4a47e8ac0bb",
      isSecret: false,
      description: 'Set a value to change depending how much data is needed',
    },
    FULLENRICH_REQUEST_CONSTRAINTS: {
      universalIdentifier: "a4891a13-7904-4d4e-8fea-3a95fe8cea96",
      isSecret: false,
      description: 'Set a value to change requirements for sending request to FullEnrich',
    }
  },
};

export default config;
