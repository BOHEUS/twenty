import { defineApplication } from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Cognism',
  description: 'Enrich People and Companies with Cognism data.',
  category: 'Enrichment',
  author: 'Twenty',
  logo: 'public/cognism-icon.png',
  websiteUrl: 'https://www.cognism.com',
  serverVariables: {
    COGNISM_API_KEY: {
      description: 'Cognism API key',
      isSecret: true,
      isRequired: true,
    },
  },
});
