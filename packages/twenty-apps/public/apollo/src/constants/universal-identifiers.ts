export const APP_DISPLAY_NAME = 'Apollo';

export const APP_DESCRIPTION =
  'Enrich People and Companies with Apollo data, and keep the fields Apollo returns that the standard objects have no home for.';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'ac1d2ed1-8835-4bd4-9043-28b46fdda465';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  'b8faae3f-e174-43fa-ab94-715712ae26cb';

export const MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '31b57683-bf40-4a0e-8985-791d1b58872e';

export const MAIN_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER =
  '3b4e4b5c-bca2-4cfc-afa8-919fad91b95f';

export const MAIN_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER =
  '87a7ec9f-4252-4653-970a-78fce26227ce';

export const MAIN_PAGE_WIDGET_UNIVERSAL_IDENTIFIER =
  'c6098b11-d125-4ddf-9d75-1e78f02340b4';

export const MAIN_PAGE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER =
  'c48a6a4a-4849-4625-94e0-3bf5c75e355b';

// Matches defineConnectionProvider({ name }); listConnections filters on it.
export const APOLLO_CONNECTION_PROVIDER_NAME = 'apollo-connection';

export const APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS = {
  enrichCompany: '46acb0ad-ddec-405a-b50e-34b6e5ab1135',
  enrichPerson: '6c2563ec-e4df-4098-a5e6-c9796af30d05',
  enrichCompanies: 'e78113e5-7983-45c4-a32b-5feb2f4edc51',
  enrichPeople: '1e6e06ca-6f7f-46b2-a145-ea1915f39422',
  onCompanyUpdated: '6248b3fe-a8af-404a-8e38-19df98f73d81',
} as const;

// The front components that back the record-selection commands reach the bulk
// logic functions through these routes, served under the /s prefix.
export const APOLLO_LOGIC_FUNCTION_ROUTE_PATHS = {
  enrichCompanies: '/apollo/enrich-companies',
  enrichPeople: '/apollo/enrich-people',
} as const;

export const APOLLO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: 'aa2cadff-e0ad-40af-929b-0dd527da221d',
  enrichPeople: '37c5fe66-020e-44ad-ba38-5afb5d9f34c9',
} as const;

export const APOLLO_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: '964ff042-3806-45b9-836e-f1a0fedfbfb9',
  enrichPeople: '74ea311b-0fa5-4c8f-a2ee-4332098491a5',
} as const;

export const APOLLO_FIELD_UNIVERSAL_IDENTIFIERS = {
  company: {
    apolloOrganizationId: '00aaa5b6-2573-4de8-a1ef-2fcc4c189804',
    apolloIndustry: '505532f5-1fc5-4a58-8074-ba9b48650dbc',
    apolloSecondaryIndustries: 'bb7618f9-f3c7-47a1-9d54-c4f42655bbf8',
    apolloKeywords: '158205ae-2228-4948-a51c-9b1fe953a4d3',
    apolloShortDescription: 'be15e062-b065-48b4-979c-65b9a50e0cb1',
    apolloSeoDescription: '9d92dd6e-5a71-48ca-a659-5212f78f3563',
    apolloFoundedYear: 'da15cfc6-3657-457d-8757-4ba11b5bb6e1',
    apolloTotalFunding: 'c90ae72d-4ddf-4f22-882f-eef98c91e40e',
    apolloLatestFundingStage: 'e8ee83cd-4856-481f-abeb-311bbb5c79f6',
    apolloLatestFundingRoundDate: '47a8f9e6-7abc-41fb-8735-94ef9a34496f',
    apolloFundingEvents: 'ded7ce69-90e2-48e2-b87b-925cc43321d6',
    apolloEstimatedNumEmployees: '29f78795-092b-4180-8384-c7d3bc01a016',
    apolloDepartmentalHeadCount: '7e8d8e96-46d2-4a55-9c80-e0a83c2e03a6',
    apolloHeadcountGrowthSixMonths: '947dbd66-7948-476e-9dd8-1e48804df369',
    apolloHeadcountGrowthTwelveMonths: '7be36b3f-947c-426c-a307-76d3236c0ae6',
    apolloHeadcountGrowthTwentyFourMonths:
      '70090c5e-31ce-49b3-b09b-a4329298f373',
    apolloXLink: 'f9712c90-14ce-4db8-8312-e78629234023',
    apolloFacebookLink: 'f6dcee15-b6f6-416e-9e23-3c08d0319561',
    apolloCrunchbaseLink: 'fc5374f5-e75a-4261-b480-4a2469f7439f',
    apolloAngellistLink: '5124df8c-0d76-4f2a-934d-ec022ca83a05',
    apolloBlogLink: '75e1d015-1b23-40f0-b819-be34dd475b4f',
    apolloLogoLink: '0df50176-5e99-45ab-be30-ffa57ce98003',
    apolloPhones: 'acf399d2-93ad-4cb9-a676-d9920c97a3db',
    apolloPubliclyTradedSymbol: 'f0dfd03c-b490-47b7-9dc5-e262b420b95c',
    apolloPubliclyTradedExchange: 'cd55640f-4370-4d76-aea7-220f9deb9f7d',
    apolloLinkedinUid: '84f5b9c0-94f3-47b1-8ecb-b1fa54a9c95f',
    apolloAlexaRanking: '4b9a1409-a50a-45f9-b80b-16ff81af1e19',
    apolloLanguages: '35be2fd8-7ab0-45e4-b43e-8691cf24a3c8',
    apolloTechnologyNames: 'bfe81b32-f1b8-426c-9724-8b710e16cd9c',
    apolloCurrentTechnologies: '6d46f4b4-3e55-4563-ac74-d3f3827644be',
    apolloRetailLocationCount: 'd57b0ac9-9e4a-42f7-a0af-5e0f643420bf',
    apolloCorporateHierarchy: 'fe5629fd-746f-4c06-aa4a-e901f4fa3c70',
    apolloAccountId: '5799711f-5fdf-4a5e-b1e5-49d8b320d50d',
    apolloLastEnrichedAt: 'd2c7770a-66d2-4f3b-97f1-294f1a90da59',
    apolloEnrichmentStatus: '5a45e8db-0ec4-415c-9cd5-ea7c55c3ef06',
    apolloRawPayload: '18cde9b3-9c05-4eae-b593-320608c97578',
  },
  person: {
    apolloId: 'ff3eb880-3831-479c-9bc8-b63effef69fe',
    apolloHeadline: '9788ad78-ac20-47b4-9b2a-8e9e10c07a66',
    apolloXLink: '8627b025-6b47-40bb-9156-1098636fd4b2',
    apolloGithubLink: '1d49940b-7707-42c8-856f-b5950cd4c12b',
    apolloFacebookLink: '8e5aece4-b258-403b-be4b-b3d952ff4b9f',
    apolloPhotoLink: '479b90a0-4c43-49ca-9ecd-42b775d33bcd',
    apolloLocation: '993492ee-f8e8-4637-af2a-3d31ed51e987',
    apolloSeniority: '7a781723-13f2-4478-a5e3-eced92dd88d4',
    apolloDepartments: '50403c12-af02-4f1d-a596-fb967906ac18',
    apolloSubdepartments: '7b941881-1eb6-4846-b825-ab6943a3ed3d',
    apolloFunctions: 'ea56d3fd-fe3e-4f4d-b1e2-a817d6d9c4a8',
    apolloEmailStatus: '0e0b3faf-f811-4f68-943d-b3ab561cf54d',
    apolloEmailConfidence: '265ae84e-12d7-4d77-a0c9-eb335417c7e4',
    apolloPersonalEmails: '4e985717-8c4a-48dd-80f7-78729e260936',
    apolloPhoneNumbers: '2fd37fa5-f272-453e-801e-6cbf05218355',
    apolloEmploymentHistory: 'bbcf8748-d35d-4731-ba2b-a85628d6f6de',
    apolloMatchConfidence: '058a6404-8922-41de-bfd5-1e998492cbe7',
    apolloIsLikelyToEngage: '927030d5-6716-46dc-8bc7-be47804c4364',
    apolloShowIntent: '238f3ce7-333d-490d-b600-4eac7c1c1451',
    apolloRevealedForCurrentTeam: 'a8215d26-c98f-4ab5-8c1e-ff9a9133ea88',
    apolloContactId: 'b507d88f-652b-486d-843d-35908c36abcc',
    apolloAccountId: '79180d60-a82f-4bff-bad2-a13d5560187b',
    apolloOrganizationId: '46b20e0d-469a-4273-a15b-a5db4b980ed2',
    apolloLastEnrichedAt: '40ed7f41-7be3-45ab-b29f-087cf7154592',
    apolloEnrichmentStatus: '44ee65f1-0da5-4744-95f9-819ed36617e0',
    apolloRawPayload: '8f7ed7d7-7dbe-438e-a3b7-eb37b1b66b5a',
  },
} as const;
