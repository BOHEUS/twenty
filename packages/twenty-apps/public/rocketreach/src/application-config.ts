import { defineApplication, FieldType } from 'twenty-sdk/define';

import { MAX_LOOKUP_CONCURRENCY } from 'src/constants/lookup-concurrency';
import {
  CREDIT_COST_DOLLARS_VARIABLE_NAME,
  LOOKUP_CONCURRENCY_VARIABLE_NAME,
  REVEAL_HEALTHCARE_VARIABLE_NAME,
  REVEAL_PERSONAL_EMAIL_VARIABLE_NAME,
  REVEAL_PHONE_VARIABLE_NAME,
  ROCKETREACH_API_KEY_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  logo: 'public/logo.svg',
  category: 'Enrichment',
  author: 'Twenty',
  serverVariables: {
    [ROCKETREACH_API_KEY_VARIABLE_NAME]: {
      description: 'RocketReach API key',
      isSecret: true,
      isRequired: true,
    },
    [REVEAL_PERSONAL_EMAIL_VARIABLE_NAME]: {
      description:
        'Reveal verified personal emails on person lookups. Costs 3 RocketReach credits per matched profile. Defaults to false.',
      type: FieldType.BOOLEAN,
      isSecret: false,
    },
    [REVEAL_PHONE_VARIABLE_NAME]: {
      description:
        'Reveal verified phone numbers on person lookups. Costs 6 RocketReach credits per matched profile. Defaults to false.',
      type: FieldType.BOOLEAN,
      isSecret: false,
    },
    [REVEAL_HEALTHCARE_VARIABLE_NAME]: {
      description:
        'Reveal NPI number, license number, credentials and specialization for US healthcare professionals. Costs 1 RocketReach credit per matched profile. Defaults to false.',
      type: FieldType.BOOLEAN,
      isSecret: false,
    },
    [LOOKUP_CONCURRENCY_VARIABLE_NAME]: {
      description: `How many RocketReach lookups run at once. RocketReach allows 10 requests per second across all APIs and far fewer per minute on the lower plans, so keep this between 1 and ${MAX_LOOKUP_CONCURRENCY}.`,
      type: FieldType.NUMBER,
      isSecret: false,
    },
    [CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one RocketReach credit under your contract, used to bill enrichment runs. RocketReach does not publish this rate.',
      type: FieldType.NUMBER,
      isSecret: false,
    },
  },
});
