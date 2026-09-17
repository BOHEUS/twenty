import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  LUSHA_API_KEY_VARIABLE_NAME,
  LUSHA_REVEAL_PHONES_VARIABLE_NAME,
} from 'src/constants/application-variable-names.constant';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  LUSHA_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER,
  LUSHA_REVEAL_PHONES_VARIABLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  logo: 'public/logo.png',
  author: 'Twenty',
  category: 'Enrichment',
  applicationVariables: {
    [LUSHA_API_KEY_VARIABLE_NAME]: {
      universalIdentifier: LUSHA_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER,
      label: 'Lusha API key',
      description:
        'API key from the Lusha dashboard (Enrich > API). Enrichment spends the Lusha credits of this account.',
      isSecret: true,
    },
    [LUSHA_REVEAL_PHONES_VARIABLE_NAME]: {
      universalIdentifier: LUSHA_REVEAL_PHONES_VARIABLE_UNIVERSAL_IDENTIFIER,
      label: 'Reveal phone numbers',
      description:
        'Also reveal phone numbers when enriching people. Phone numbers cost more Lusha credits than emails.',
      type: FieldType.BOOLEAN,
      value: false,
    },
  },
});
