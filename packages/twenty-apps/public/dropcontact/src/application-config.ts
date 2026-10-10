import { defineApplication, FieldType } from 'twenty-sdk/define';

import { DROPCONTACT_FRENCH_REGISTRY_VARIABLE_NAME } from 'src/constants/application-variable-names';
import {
  DROPCONTACT_API_KEY_VARIABLE_NAME,
  DROPCONTACT_CREDIT_COST_DOLLARS_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DROPCONTACT_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Dropcontact',
  description:
    'Enrich People with Dropcontact emails, phones and job data, and their Companies with French registry data.',
  category: 'Enrichment',
  author: 'Twenty',
  billing: {
    description:
      'Billed to your Twenty credits for each contact Dropcontact returns a qualified email for, the same rule Dropcontact uses for its own credits. Contacts with no email found are free.',
  },
  applicationVariables: {
    [DROPCONTACT_FRENCH_REGISTRY_VARIABLE_NAME]: {
      universalIdentifier:
        DROPCONTACT_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.frenchRegistry,
      label: 'French company registry data',
      description:
        'Fetch SIREN, SIRET, VAT, NAF code, registered address, turnover and net income for French companies.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
  },
  serverVariables: {
    [DROPCONTACT_API_KEY_VARIABLE_NAME]: {
      description: 'Dropcontact API key, sent in the X-Access-Token header',
      isSecret: true,
      isRequired: true,
    },
    [DROPCONTACT_CREDIT_COST_DOLLARS_VARIABLE_NAME]: {
      description:
        'Dollar cost of one Dropcontact credit on your plan, used to bill workspace credits for each contact Dropcontact charges a credit for.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: true,
    },
  },
});
