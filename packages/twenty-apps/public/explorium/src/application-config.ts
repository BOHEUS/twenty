import { defineApplication, FieldType } from 'twenty-sdk/define';

import { EXPLORIUM_CONTACT_DETAILS_VARIABLE_NAME } from 'src/constants/application-variable-names';
import { CONTACT_DETAIL_OPTIONS } from 'src/constants/contact-detail-options';
import { DEFAULT_CONTACT_DETAILS } from 'src/constants/default-contact-details';
import {
  EXPLORIUM_API_KEY_VARIABLE_NAME,
  EXPLORIUM_CREDIT_COST_DOLLARS_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  EXPLORIUM_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Explorium',
  description: 'Enrich People and Companies with Explorium data.',
  category: 'Enrichment',
  author: 'Twenty',
  billing: {
    description:
      'Billed to your Twenty credits from the Explorium credits each enrichment actually uses. Records Explorium cannot match are free.',
  },
  applicationVariables: {
    [EXPLORIUM_CONTACT_DETAILS_VARIABLE_NAME]: {
      universalIdentifier:
        EXPLORIUM_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.contactDetails,
      label: 'Contact details',
      description:
        'Contact details fetched on person enrichment. Professional email alone costs 2 Explorium credits per person; phone numbers, alone or with email, cost 5. Leave empty to fetch the profile only.',
      type: FieldType.MULTI_SELECT,
      isSecret: false,
      options: CONTACT_DETAIL_OPTIONS,
      value: DEFAULT_CONTACT_DETAILS,
    },
  },
  serverVariables: {
    [EXPLORIUM_API_KEY_VARIABLE_NAME]: {
      description: 'Explorium API key',
      isSecret: true,
      isRequired: true,
    },
    [EXPLORIUM_CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one Explorium credit on your contract, used to bill workspace credits from the credits each call reports. Explorium does not publish this rate.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: true,
    },
  },
});
