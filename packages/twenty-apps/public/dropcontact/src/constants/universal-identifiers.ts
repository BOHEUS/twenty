export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '0bfd97c2-b90b-40d2-9c0f-ab6ebac941eb';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '17c96a9f-5aed-420a-aeee-b89a9d89567e';

export const DROPCONTACT_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS = {
  frenchRegistry: 'd7b07457-a702-4275-8d6e-9fa5dcc7385d',
} as const;

export const DROPCONTACT_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: 'd1c596ad-78f5-44d1-b7e1-22a7f5da7d97',
    path: '/dropcontact/enrich-people',
  },
  enrichPerson: {
    universalIdentifier: '1a703091-309a-4bde-a7d7-b82501170d97',
    path: '/dropcontact/enrich-person',
  },
} as const;

export const DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    dropcontactCivility: 'd2ae786c-b771-42d5-adff-f1e790db8dd4',
    dropcontactJobLevel: 'c25b4bea-1167-48b8-82ab-f828339f15c9',
    dropcontactJobFunction: 'a2824ea8-8cb2-4fd0-8092-c6bd70611842',
    dropcontactEmailQualification: 'f4d1b512-4c2d-4ae0-9eb5-e21c52215445',
    dropcontactCountry: '867de1ed-077e-4a01-a5ab-6cc2546b19d1',
    dropcontactRequestId: '3c5fc442-9375-42f2-a0c9-843b279cc25a',
    dropcontactRawPayload: '8ca4b1f7-e63e-4076-a54d-7717537c4394',
    dropcontactLastEnrichedAt: 'f1f68fec-67b3-45f3-ac29-7bee8eb0167b',
    dropcontactEnrichmentStatus: '4c920c33-5815-4a02-98c2-b68257373e02',
  },
  company: {
    dropcontactIndustry: 'c22a2c2e-ceb4-456c-8324-944c514be6e9',
    dropcontactEmployeeRange: 'a6e5c87b-57d7-4123-b094-d3ede3383dca',
    dropcontactEmployeeCount: '3132211e-8209-4a75-8c10-3827e59e7c2a',
    dropcontactSiren: 'fc172bec-b30e-4552-9efc-9d54ca90a928',
    dropcontactSiret: 'cf2a7547-88e8-4a1e-8da8-4620f420404f',
    dropcontactVat: '9e7f6c58-98e9-4785-a9ff-f6c95275d009',
    dropcontactNafCode: 'a0b5c7fa-073e-40b8-a43b-01594b0ce5ab',
    dropcontactNafDescription: 'bb7adefd-c2bf-497c-9276-17aaf86b5e29',
    dropcontactTurnover: '7dddbcf0-8802-495c-82b7-eacfd2af02a3',
    dropcontactNetIncome: 'c331fe70-5ded-40b1-bcdb-014f761d1c37',
    dropcontactLastEnrichedAt: '7e7a1fb4-9370-45a2-827e-ba4789595f03',
  },
} as const;

export const DROPCONTACT_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedPeople: 'a11e4a8d-3a7c-4ea5-adb3-fd699f3fcb13',
} as const;

export const DROPCONTACT_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: '968ab936-e820-4fe9-bfa2-42e482cc1575',
} as const;

export const DROPCONTACT_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: '4d743fa5-4087-46f3-85ba-8827572be309',
} as const;

export const DROPCONTACT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: 'c8cf8fb7-e252-4d05-b528-4e68520cabc9',
    pending: '6ffc2091-bf29-4ae1-a263-a54e7e410d39',
    notFound: 'c4abc42f-e716-40c0-83d7-3ae17673024b',
    error: '688ca2ce-6aec-4bd5-9bfe-447406a323e0',
  },
} as const;
