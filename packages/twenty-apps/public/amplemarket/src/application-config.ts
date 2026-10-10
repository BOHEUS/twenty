import { defineApplication, FieldType } from 'twenty-sdk/define';

import { AMPLEMARKET_CONTACT_DETAILS_VARIABLE_NAME } from 'src/constants/application-variable-names';
import { CONTACT_DETAIL_OPTIONS } from 'src/constants/contact-detail-options';
import { DEFAULT_CONTACT_DETAILS } from 'src/constants/default-contact-details';
import {
  AMPLEMARKET_API_KEY_VARIABLE_NAME,
  AMPLEMARKET_EMAIL_CREDIT_COST_DOLLARS_VARIABLE_NAME,
  AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import {
  AMPLEMARKET_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Amplemarket',
  description:
    'Enrich People and Companies with Amplemarket profiles, contact details and company data.',
  category: 'Enrichment',
  author: 'Twenty',
  billing: {
    description:
      'Billed to your Twenty credits for the Amplemarket credits each enrichment uses: half an email credit per person found, one email credit per email revealed and one phone credit per phone number revealed. Company lookups and records Amplemarket cannot find are free.',
  },
  applicationVariables: {
    [AMPLEMARKET_CONTACT_DETAILS_VARIABLE_NAME]: {
      universalIdentifier:
        AMPLEMARKET_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.contactDetails,
      label: 'Contact details',
      description:
        'Contact details to reveal for people who are missing them. An email costs one Amplemarket email credit and phone numbers one phone credit. Leave empty to only fetch profiles.',
      type: FieldType.MULTI_SELECT,
      isSecret: false,
      options: CONTACT_DETAIL_OPTIONS,
      value: DEFAULT_CONTACT_DETAILS,
    },
  },
  serverVariables: {
    [AMPLEMARKET_API_KEY_VARIABLE_NAME]: {
      description: 'Amplemarket API key, sent as a bearer token',
      isSecret: true,
      isRequired: true,
    },
    [AMPLEMARKET_EMAIL_CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one Amplemarket email credit on your plan, used to bill workspace credits for people found and emails revealed.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: true,
    },
    [AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one Amplemarket phone credit on your plan, used to bill workspace credits for phone numbers revealed.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: true,
    },
  },
});
