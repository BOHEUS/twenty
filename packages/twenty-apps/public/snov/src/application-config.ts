import { defineApplication, FieldType } from 'twenty-sdk/define';

import { SNOV_FIND_MISSING_EMAILS_VARIABLE_NAME } from 'src/constants/application-variable-names';
import {
  SNOV_CLIENT_ID_VARIABLE_NAME,
  SNOV_CLIENT_SECRET_VARIABLE_NAME,
  SNOV_CREDIT_COST_DOLLARS_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  SNOV_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Snov.io',
  description:
    'Enrich People and Companies with Snov.io profiles, emails and company data.',
  category: 'Enrichment',
  author: 'Twenty',
  billing: {
    description:
      'Billed to your Twenty credits for the Snov.io credits each enrichment uses: one per profile or company found and one per email found. Records Snov.io cannot find are free.',
  },
  applicationVariables: {
    [SNOV_FIND_MISSING_EMAILS_VARIABLE_NAME]: {
      universalIdentifier:
        SNOV_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.findMissingEmails,
      label: 'Find missing emails',
      description:
        'For people without an email, find one from their name and company domain. Costs one Snov.io credit for each email found.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
  },
  serverVariables: {
    [SNOV_CLIENT_ID_VARIABLE_NAME]: {
      description: 'Snov.io API user ID (client_id)',
      isSecret: true,
      isRequired: true,
    },
    [SNOV_CLIENT_SECRET_VARIABLE_NAME]: {
      description: 'Snov.io API secret (client_secret)',
      isSecret: true,
      isRequired: true,
    },
    [SNOV_CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one Snov.io credit on your plan, used to bill workspace credits for the Snov.io credits each call uses.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: true,
    },
  },
});
