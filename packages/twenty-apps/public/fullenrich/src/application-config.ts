import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  COMPANY_REQUEST_CONSTRAINTS,
  DEFAULT_ENRICH_FIELDS,
  FULLENRICH_API_KEY_VARIABLE,
  FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE,
  FULLENRICH_DATA_REQUIREMENTS_VARIABLE,
  FULLENRICH_ENRICH_FIELDS,
  FULLENRICH_REQUEST_CONSTRAINTS_VARIABLE,
  PERSON_REQUEST_CONSTRAINTS,
} from 'src/constants/application-variables';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const ENRICH_FIELD_LABELS: Record<
  (typeof FULLENRICH_ENRICH_FIELDS)[number],
  string
> = {
  'contact.work_emails': 'Work emails',
  'contact.personal_emails': 'Personal emails',
  'contact.phones': 'Phones',
};

const REQUEST_CONSTRAINT_LABELS: Record<string, string> = {
  'person.email': 'Person has an email',
  'person.phones': 'Person has a phone number',
  'person.location': 'Person has a location',
  'person.about': 'Person has an about',
  'person.jobTitle': 'Person has a job title',
  'company.headcount': 'Company has a headcount',
  'company.address': 'Company has an address',
};

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  applicationVariables: {
    [FULLENRICH_API_KEY_VARIABLE]: {
      universalIdentifier: '8977420d-6a54-48e7-9d64-348e90b2bb5f',
      isSecret: true,
      description:
        "FullEnrich API key for this workspace. Falls back to the instance's key when left empty. Also verifies the signature of incoming FullEnrich webhooks.",
    },
    [FULLENRICH_DATA_REQUIREMENTS_VARIABLE]: {
      universalIdentifier: '0824497a-8115-487a-9eb6-d4a47e8ac0bb',
      isSecret: false,
      type: FieldType.MULTI_SELECT,
      options: FULLENRICH_ENRICH_FIELDS.map((value) => ({
        label: ENRICH_FIELD_LABELS[value],
        value,
      })),
      description:
        'Which contact data to ask FullEnrich for. Each selection is billed separately.',
      value: DEFAULT_ENRICH_FIELDS,
    },
    [FULLENRICH_REQUEST_CONSTRAINTS_VARIABLE]: {
      universalIdentifier: 'a4891a13-7904-4d4e-8fea-3a95fe8cea96',
      isSecret: false,
      type: FieldType.MULTI_SELECT,
      options: [
        ...PERSON_REQUEST_CONSTRAINTS,
        ...COMPANY_REQUEST_CONSTRAINTS,
      ].map((value) => ({
        label: REQUEST_CONSTRAINT_LABELS[value],
        value,
      })),
      description:
        'Skip a record when it already holds all of the selected data. Leave empty to always enrich.',
      value: [],
    },
  },
  serverVariables: {
    [FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE]: {
      isSecret: true,
      isRequired: false,
      type: FieldType.TEXT,
      description:
        'FullEnrich API key shared by every workspace on this instance. Used only where a workspace has not set its own key.',
    },
  },
  author: 'Twenty',
  emailSupport: 'contact@twenty.com',
  category: 'Enrichment',
  logo: 'public/logo.png',
});
