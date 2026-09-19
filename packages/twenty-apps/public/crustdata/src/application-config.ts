import { defineApplication, FieldType } from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Crustdata',
  description: 'Enrich People and Companies with Crustdata data.',
  logo: 'public/logo.png',
  category: 'Enrichment',
  author: 'Twenty',
  serverVariables: {
    CRUSTDATA_API_KEY: {
      description: 'Crustdata API key',
      isSecret: true,
      isRequired: true,
    },
    CRUSTDATA_CONTACT_ENRICHMENT_ENABLED: {
      description:
        'Set to true to also fetch emails and phone numbers through Crustdata contact enrichment. This is a separate billed call (up to 5 Crustdata credits per matched person) and is only available on Enterprise plans, so it is off by default.',
      type: FieldType.BOOLEAN,
      isSecret: false,
    },
    CRUSTDATA_CREDIT_COST_DOLLARS: {
      description:
        'Dollar cost of one Crustdata credit on your contract, used to bill workspace credits from the credits each call actually reports. Defaults to 0.01.',
      type: FieldType.NUMBER,
      isSecret: false,
    },
  },
});
