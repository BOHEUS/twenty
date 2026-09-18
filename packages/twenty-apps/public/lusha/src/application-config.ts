import { defineApplication, FieldType } from 'twenty-sdk/define';

import { ENRICHMENT_BILLABLE_OPERATION_NAME } from 'src/constants/billing.constant';
import {
  LUSHA_API_KEY_VARIABLE_NAME,
  LUSHA_REVEAL_PHONES_VARIABLE_NAME,
} from 'src/constants/application-variable-names.constant';
import { LUSHA_DEFAULT_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names.constant';
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
  billing: {
    description:
      'Enriching with the Lusha API key of this Twenty instance spends credits. A workspace that sets its own Lusha API key in the app settings is not charged.',
    operations: {
      [ENRICHMENT_BILLABLE_OPERATION_NAME]: {
        operationType: 'CODE_EXECUTION',
        label: 'Lusha credits spent on enrichment',
      },
    },
  },
  serverVariables: {
    [LUSHA_DEFAULT_API_KEY_VARIABLE_NAME]: {
      description:
        'Lusha API key every workspace that has not set its own in the app settings enriches with. Enriching then spends the credits of that Lusha account.',
      type: FieldType.TEXT,
      isSecret: true,
    },
  },
});
