import { defineApplication } from 'twenty-sdk';
import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/default-role';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '5f53aece-9771-461d-9bac-8569b7af730c';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'FullEnrich contact enrichment',
  description: 'Enrich contact with FullEnrich',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  icon: 'IconEyeglass',
  applicationVariables: {
    TWENTY_URL: {
      universalIdentifier: '3f35fc28-72a4-4166-9d7b-8057600423c8',
      isSecret: false,
      description:
        "Required to let know FullEnrich where enrichment must be sent once it's done",
    },
    FULLENRICH_API_KEY: {
      universalIdentifier: '8977420d-6a54-48e7-9d64-348e90b2bb5f',
      isSecret: true,
      description: 'Required to send a request to FullEnrich',
    },
    FULLENRICH_DATA_REQUIREMENTS: {
      universalIdentifier: '0824497a-8115-487a-9eb6-d4a47e8ac0bb',
      isSecret: false,
      description: 'Set a value to change depending how much data is needed',
    },
    FULLENRICH_REQUEST_CONSTRAINTS: {
      universalIdentifier: 'a4891a13-7904-4d4e-8fea-3a95fe8cea96',
      isSecret: false,
      description:
        'Set a value to change requirements for sending request to FullEnrich',
    },
  },
});
