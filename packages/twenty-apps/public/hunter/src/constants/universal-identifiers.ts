export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'b76ec7c3-9d49-46a9-bbac-7c110cb4bd45';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '05fcf1c2-bc3a-4708-bdfb-ae998fed4058';

export const HUNTER_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS = {
  findMissingEmails: '60ce18e3-a9c7-43c8-9d44-97665e698df2',
} as const;

export const HUNTER_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: '79cd20bb-3e2b-4556-85f7-df31d6335009',
    path: '/hunter/enrich-people',
  },
  enrichPerson: {
    universalIdentifier: '537851ea-27ad-4487-a3dd-70b5fdf944b9',
    path: '/hunter/enrich-person',
  },
  enrichCompanies: {
    universalIdentifier: '5bb83b60-acd3-47da-ae41-3744fa36af53',
    path: '/hunter/enrich-companies',
  },
  enrichCompany: {
    universalIdentifier: '4abc3174-1da0-41cd-9206-00ef562f2cb3',
    path: '/hunter/enrich-company',
  },
} as const;

export const HUNTER_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    hunterId: '6b664962-56b3-4653-b378-71f7ee487578',
    hunterBio: 'e78cfd1c-d89d-4fb7-b31c-85eee37cabd1',
    hunterSite: 'e03402b6-aa00-4205-89a7-273dfe8fec72',
    hunterTimeZone: 'c3d726d5-9106-4309-af74-af3c12e2d11f',
    hunterLocation: 'f5fbc1ec-5f92-43b3-8ee6-0d458aef92de',
    hunterRole: 'ea4a051a-80ba-4cc1-b4de-9e88afac82c4',
    hunterSubRole: 'c9d5485a-f276-4d95-9e2e-fdffbb929607',
    hunterSeniority: '2d0bf2f4-99bc-425e-a7c3-a6e645c195a4',
    hunterXLink: '5425acd8-a1fc-467d-8212-c4e1a2349462',
    hunterXFollowers: '844b3db2-c9c4-4a70-9e18-0225ffbaf087',
    hunterGithubLink: '6029f185-141a-4e25-8bc8-aca74dd99755',
    hunterGithubFollowers: 'e8749b85-2367-4434-9f36-21d0a4ae74cb',
    hunterFacebookLink: '1af0fb42-f4bf-4dcd-bb6f-a3ac2227615c',
    hunterEmailProvider: '2a3a438e-4c8b-4515-bcad-222c9f8e9654',
    hunterFoundEmail: 'd4e7e440-49fc-4544-86de-6518bdd58bf2',
    hunterEmailStatus: '25514884-67b5-48c2-a84e-ae840e6cbae4',
    hunterEmailScore: 'dd485e2e-f1ca-4c29-938e-b9c061283fe3',
    hunterEmailSources: '242ed566-9663-42b5-8f3a-21f2bdb56b58',
    hunterRawPayload: 'c04bd34a-7af8-4bab-8219-2242f8dda945',
    hunterLastEnrichedAt: 'ffd41961-6eb6-4b60-9fd3-1af316c8d0fe',
    hunterEnrichmentStatus: 'ee521bc2-2116-4b25-ba97-f890d94f1cf8',
  },
  company: {
    hunterId: 'f9413095-451b-443a-b92e-934b69241e8b',
    hunterLegalName: '81d582d5-9585-4c50-adc4-a100a5c55f1b',
    hunterDescription: 'a39ab1c5-1009-4e6c-bc9e-e082a022cc9e',
    hunterSector: 'e27f7382-4201-497f-a1d6-91ee53a9d1c8',
    hunterIndustry: '689a4abe-006d-4f28-a0b5-9a3bec7ca8a9',
    hunterSicCode: '8748e50b-7961-4061-81fd-dbfe9a34cf8a',
    hunterNaicsCode: 'abe13935-ae36-4d46-84a3-a3752fb8a17e',
    hunterGicsCode: '9afc272b-54d9-46e8-ad47-7386bcd64273',
    hunterTags: '13e6447b-b069-4bc4-930f-4ebe98f09fe0',
    hunterType: '5d97f0ff-3412-4755-b7d6-bbb8de966aef',
    hunterFoundedYear: '70ae6213-bc08-4cc7-b688-ec7d3c0bde36',
    hunterEmployeeRange: 'd97933b1-ef9e-4356-a19d-789da7301b7f',
    hunterEmployeeCount: 'f271274e-87d1-4131-b36f-397168727458',
    hunterEstimatedRevenue: 'fde2d504-957d-4199-9aa4-e25325a80686',
    hunterTotalFunding: '618091d9-4910-4dde-9230-b1550df2cc85',
    hunterMarketCap: '9ee1af7c-cd8a-4f0a-8baa-e54a40859993',
    hunterTrafficRank: '715b1b41-2414-4504-a81a-76a79364e408',
    hunterTicker: '0be435a6-1b1b-4ba8-9c1e-7f70ec6102ae',
    hunterPhone: 'd6f03bdf-6b8a-4638-93c7-6f92ab2602cb',
    hunterTimeZone: '5ef46673-a02a-4ef7-99b0-8ce002895212',
    hunterDomainAliases: '22eebf8b-b3f4-4507-a966-34d5eb5f1ad8',
    hunterTech: 'f32bc5c7-d440-4bf8-8977-6e842d0955c4',
    hunterTechCategories: '11078790-adb5-498a-aa6a-2dcd6494fdc4',
    hunterFundingRounds: '80bceefe-e1d2-46cd-be1a-a88e4cfbd49d',
    hunterXLink: 'e31f2e0b-1652-4c4c-bb94-5c922fe72c1e',
    hunterFacebookLink: '5ca88cf9-576e-4251-9ca7-e963bef20fd0',
    hunterCrunchbaseLink: 'da519ebc-4a5e-48ff-80d4-7cc10a54bcce',
    hunterInstagramLink: '979521be-217a-4713-9458-39d652c503cb',
    hunterParentDomain: 'af213709-fd02-4b1b-b347-bcd91ec76e2a',
    hunterUltimateParentDomain: '71248322-e8e7-4d14-b726-a4307ca2aa2f',
    hunterRawPayload: '33d8f77d-2e67-4c69-994e-1c22b3492a0d',
    hunterLastEnrichedAt: 'e2b36513-4db0-44eb-bc21-4cad5ce6d438',
    hunterEnrichmentStatus: 'b75bab82-0de1-4b6a-b0c6-d35fa2151e88',
  },
} as const;

export const HUNTER_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedCompanies: 'c781f715-d671-4345-bf7f-b7215fe30ce3',
  enrichedPeople: '9ab9e867-0138-4f86-9f0c-bed8e7c6eb3c',
} as const;

export const HUNTER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: '55f28a0a-a401-4ef2-99ee-757856e0b727',
  enrichPeople: '068c3303-b52b-41d8-82b0-f659a9ab14fa',
} as const;

export const HUNTER_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: 'ce54fae0-6902-4ea5-be38-b714bea27134',
  enrichPeople: 'ee7b4d32-23ae-450a-97c3-3b6e8532fce3',
} as const;

export const HUNTER_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: '927637b4-fee1-4cae-82ad-2240c1e64a45',
    notFound: 'dca29be1-5ef5-4735-a513-3f53ca110aab',
    error: '77af5cfe-53ef-4169-abfd-023e7d8a1727',
  },
  companyEnrichmentStatus: {
    matched: '983b30cd-4c7b-4542-a817-21a9f007fcd4',
    notFound: 'b7d41830-dbea-409d-810f-64d3715ca4db',
    error: '52f92b42-bb77-48d1-bc03-3ca1531093d0',
  },
} as const;
