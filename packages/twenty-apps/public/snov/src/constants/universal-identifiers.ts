export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'ef06513a-893a-47ea-b3aa-559548fc6b45';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '03311b64-0c20-4d95-b10d-d83dc81a288f';

export const SNOV_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS = {
  findMissingEmails: '6b6f74f7-8c90-45b1-9d01-d21fb753eed7',
} as const;

export const SNOV_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: '5042b1f3-78df-46ed-a129-cb627aec41d0',
    path: '/snov/enrich-people',
  },
  enrichPerson: {
    universalIdentifier: '00cdf19e-6c17-4472-abea-dc8837c6c282',
    path: '/snov/enrich-person',
  },
  enrichCompanies: {
    universalIdentifier: '7b8d8d6f-6108-4868-b834-f3ffdf856032',
    path: '/snov/enrich-companies',
  },
  enrichCompany: {
    universalIdentifier: '1c881396-e110-44d9-8652-7e4a82484621',
    path: '/snov/enrich-company',
  },
} as const;

export const SNOV_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    snovId: '830e6909-a008-4544-ae57-8a60579dcaf8',
    snovIndustry: 'b5519c9f-cb14-4257-acbb-ae1d636adc2a',
    snovLocation: '2dc3c790-abf2-4792-85c4-664f06faef75',
    snovJobStartDate: 'b486c1c3-9c6e-4a39-b6ff-5d71b169c602',
    snovPreviousJobs: 'b7df8449-42ae-4e07-8808-4aa145e1dfb0',
    snovSocialProfiles: '00ff4f30-447c-49cf-974d-9b43fd1fe6a0',
    snovSkills: 'b2466d36-4c41-4d7a-82da-2fd9108bfb88',
    snovFoundEmail: '4c467ca1-7ba7-4599-ae85-afab37c4b280',
    snovEmailStatus: '1763ea30-a3cc-4d56-aaf1-46cdda735f73',
    snovLastUpdatedAt: '8b95bb4d-2deb-4888-b93f-a1d0c99c1f12',
    snovRawPayload: '109a287a-c01f-48ca-ac90-e873c43143f2',
    snovLastEnrichedAt: '85c83c4e-94c6-4c30-bcad-66ce704e7773',
    snovEnrichmentStatus: 'd9adfc91-3984-4a6a-8ac6-1fac5c329e91',
  },
  company: {
    snovIndustry: '44e4cfb4-6d11-4963-ba2b-a300cda3098c',
    snovSize: 'f7a342db-1c6a-450c-aa25-be36299aea7e',
    snovFoundedYear: 'fe236b8b-dd13-4812-89f2-3b48f6e36a23',
    snovPhone: '95215488-9358-4a9b-9c71-7b6e6bda6c61',
    snovRelatedDomains: '25aeeb49-cc61-462d-a39a-0af4cc776186',
    snovRawPayload: '7d552370-7ab2-4a4c-b6b4-44dee2fba36f',
    snovLastEnrichedAt: '5f2c8192-ecb1-42f1-8565-e645342dfcb0',
    snovEnrichmentStatus: 'ebac83ec-cbba-4972-bc20-83a5bb7d6d21',
  },
} as const;

export const SNOV_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedCompanies: 'ee670221-d806-458d-9c2f-4ef75a4f92d4',
  enrichedPeople: 'd6f84226-c754-4a77-9a1a-4b8fb69ddf73',
} as const;

export const SNOV_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: '048b9de8-5a28-4865-8975-c70f61b7bb8f',
  enrichPeople: '25f876f6-818e-4270-8bdb-ae9ac0a1a728',
} as const;

export const SNOV_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: 'b008d16f-72ba-461d-b204-5240a5a4df49',
  enrichPeople: '5a27e8c2-2a53-4980-a003-053f4479f6bd',
} as const;

export const SNOV_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: '9c10a825-e29d-40f2-b44b-46a6c94ed5fe',
    notFound: 'e1fb13b9-4554-494d-9e4a-7ec6a1b8bd3b',
    error: 'c11aee22-fd70-4ab4-9924-46b03c1e0e1d',
  },
  companyEnrichmentStatus: {
    matched: 'c2e06186-7193-4307-aee6-ff5a4d69d903',
    notFound: 'c5f52b30-0a21-4c76-9216-82e4f80e01eb',
    error: '25151460-cddf-4d73-963f-b6b7b171540c',
  },
} as const;
