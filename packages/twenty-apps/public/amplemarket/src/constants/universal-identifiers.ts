export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'c7f04e19-8521-48e5-9320-bd975fd7f21b';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  'c8e28f9f-5196-4403-9057-e8bba8222a55';

export const AMPLEMARKET_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS = {
  contactDetails: '85f1d929-96f0-4fe9-b712-c87796505368',
} as const;

export const AMPLEMARKET_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: '93318ad5-1717-42b3-b164-a8f94330dd79',
    path: '/amplemarket/enrich-people',
  },
  enrichPerson: {
    universalIdentifier: '3abc6958-5dd0-4872-bbc7-49598be959fb',
    path: '/amplemarket/enrich-person',
  },
  enrichCompanies: {
    universalIdentifier: '86c1a5c3-7ccb-41df-b40e-4c4068aa5ad1',
    path: '/amplemarket/enrich-companies',
  },
  enrichCompany: {
    universalIdentifier: '8344beff-09c8-4e6c-928d-450a88800623',
    path: '/amplemarket/enrich-company',
  },
} as const;

export const AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    amplemarketId: 'cbe2b6fc-e43c-4375-baca-4f0672cbdb9b',
    amplemarketHeadline: '35ef3153-647d-4560-ab57-9f278571dd6f',
    amplemarketAbout: '4b6ae22f-218a-4dea-9c70-aab6a2255168',
    amplemarketGender: 'eba0f8aa-1539-4e08-9bb0-c6da98cc5216',
    amplemarketLocation: '02d512b1-c82d-48b1-b95b-86b0d7e4a993',
    amplemarketJobStartDate: '98f37c33-00d1-4c0a-89f4-49deb9b4bfce',
    amplemarketJobDescription: '9d7fe580-e224-4e68-911c-a2853e178258',
    amplemarketExperiences: 'eab7670f-62cf-4cd2-ae5a-b27f8a83a17f',
    amplemarketEducations: '48d5ed3f-6d03-425e-8abe-2a9eb1830f2d',
    amplemarketLanguages: 'aca3b21d-79a4-4109-9780-dc8e50d49caf',
    amplemarketPhoneDetails: '8c525c92-49bf-40bc-a306-4e015bd016b8',
    amplemarketRawPayload: '48887621-d8cf-4fe5-91c2-5b995c441abf',
    amplemarketLastEnrichedAt: '4318043d-b139-4a19-b040-7fe6ee8a28ce',
    amplemarketEnrichmentStatus: '072c32ce-9703-4ddc-82aa-972b528dd819',
  },
  company: {
    amplemarketId: 'd3357e9b-8137-4b3b-832b-94ad86356159',
    amplemarketOverview: 'c32e6af3-57b3-43ca-b410-5c26c8df03ae',
    amplemarketIndustry: '3758d670-c72f-48c8-9457-3a6108b7d8b6',
    amplemarketType: '16dec46b-c5d3-4229-9576-78aca956c271',
    amplemarketSize: '0251906a-0502-4f63-b1e5-8cb899a82b53',
    amplemarketEmployeeCount: '70f3e97a-b431-4ff5-ab5b-382a3207daf7',
    amplemarketFoundedYear: '598a95ba-e57c-4cbb-80ce-1a4282e25d98',
    amplemarketKeywords: 'e0823055-5906-46dc-a1e8-144b0658ef7c',
    amplemarketIsB2b: '9218787d-18e9-42fe-b3cc-1667bd292986',
    amplemarketIsB2c: '67f669c0-c096-4e35-872a-bce2bd1fbe47',
    amplemarketSicCodes: '16ca40b9-5a7c-4a76-ac2d-4354f3837d70',
    amplemarketNaicsCodes: '5856077b-0b9a-4ad5-9f2b-56f6532dbb34',
    amplemarketEstimatedRevenue: '6db860f8-b81c-4e05-9328-7d77a5848d6a',
    amplemarketRevenue: '603f3ca2-efc1-4c02-beba-049a4f45c333',
    amplemarketTotalFunding: 'a4e73900-5844-4794-aa07-3888cdefaf48',
    amplemarketLatestFundingStage: 'd8169751-579f-46b6-9033-3bd40d3c1652',
    amplemarketLatestFundingDate: '545e1aac-afb2-4040-a8a5-55ed6e5e4731',
    amplemarketFundingEvents: '119afea7-c177-47dc-aa6b-3cfacadb25e0',
    amplemarketTechnologies: '28f0e09e-8e4b-444a-b960-1ccae9568735',
    amplemarketDepartmentHeadcount: 'e229276e-831e-43ce-991b-8a09c1c9f275',
    amplemarketJobFunctionHeadcount: '8b793606-e749-410b-afb5-e28e92805597',
    amplemarketTrafficRank: '55db1087-a423-4104-89e7-23578d59ea10',
    amplemarketFollowers: '6f4a02ee-a6a1-4f77-91bb-02078ae1aef4',
    amplemarketLocations: 'f3150028-42d2-4b6f-91d8-a1b3692b4086',
    amplemarketRawPayload: 'edea4e4f-ccd9-48c9-b153-5a2621d29626',
    amplemarketLastEnrichedAt: 'a2d0a148-18af-4893-82e7-d71a237099ec',
    amplemarketEnrichmentStatus: '9fb343da-827f-4845-9588-31a04b40c3a0',
  },
} as const;

export const AMPLEMARKET_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedCompanies: '892e89a3-53cf-4c6a-b926-fa20666890a0',
  enrichedPeople: '43105e92-dc64-46bd-9cbb-14a1ede5b671',
} as const;

export const AMPLEMARKET_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: 'ffbe2cc2-b0a3-438e-9c0c-e43b304cbcfd',
  enrichPeople: '5c75a6fe-b539-44e8-9f1f-5af0839f9173',
} as const;

export const AMPLEMARKET_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: '41a84720-0af7-4171-b926-c1c1f0ee1e6d',
  enrichPeople: 'dd605d56-b200-4577-87ab-7b66dd316fbe',
} as const;

export const AMPLEMARKET_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: 'e8f8cb63-7eee-43f4-8005-f80469c6f876',
    notFound: '2a581137-1dd8-49ac-b48d-77596ebc2935',
    error: '9df54156-ea7b-461b-8c3e-d43462eb9a16',
  },
  companyEnrichmentStatus: {
    matched: '1a6831f0-6eaa-409a-b06a-c40509099962',
    notFound: '92958dc4-8ee3-4f71-98c0-17f5491b7cc5',
    error: '35e5852d-cd51-45ab-a42b-6a9e9a426eae',
  },
} as const;
