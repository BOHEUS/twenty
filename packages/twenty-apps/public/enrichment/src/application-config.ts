import { defineApplication } from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Enrichment',
  description:
    'Shared Person and Company fields that enrichment provider apps fill in, so every provider writes to the same place.',
  category: 'Enrichment',
  author: 'Twenty',
});
