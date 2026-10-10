import { defineApplication, FieldType } from 'twenty-sdk/define';

import { HUNTER_FIND_MISSING_EMAILS_VARIABLE_NAME } from 'src/constants/application-variable-names';
import {
  HUNTER_API_KEY_VARIABLE_NAME,
  HUNTER_CREDIT_COST_DOLLARS_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  HUNTER_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Hunter',
  description:
    'Enrich People and Companies with Hunter emails, profiles and company data.',
  category: 'Enrichment',
  author: 'Twenty',
  billing: {
    description:
      'Billed to your Twenty credits for the Hunter credits each enrichment uses: one per email found and 0.2 per person or company enriched. Records Hunter cannot find are free.',
  },
  applicationVariables: {
    [HUNTER_FIND_MISSING_EMAILS_VARIABLE_NAME]: {
      universalIdentifier:
        HUNTER_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.findMissingEmails,
      label: 'Find missing emails',
      description:
        'For people without an email, find one from their name and company or LinkedIn. Costs one Hunter credit for each email found.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
  },
  serverVariables: {
    [HUNTER_API_KEY_VARIABLE_NAME]: {
      description: 'Hunter API key, sent in the X-API-KEY header',
      isSecret: true,
      isRequired: true,
    },
    [HUNTER_CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one Hunter credit on your plan, used to bill workspace credits for the Hunter credits each call uses.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: true,
    },
  },
});
