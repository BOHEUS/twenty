export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'da0ef2ee-22d7-4e79-8842-a5781f2e59fd';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '4dfde995-048d-49a9-8bd5-a98b65e2e51c';

export const COGNISM_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: '07e007fe-763e-4334-a5fa-54d708267d87',
    path: '/cognism/enrich-people',
  },
  enrichPerson: {
    universalIdentifier: '2ec5b0ed-1f9d-44c5-9448-5f70ef19ab6b',
    path: '/cognism/enrich-person',
  },
  enrichCompanies: {
    universalIdentifier: 'edf1d8dc-d2f8-48e4-a8d0-50e3e71204e8',
    path: '/cognism/enrich-companies',
  },
  enrichCompany: {
    universalIdentifier: '1c1363dd-b9e7-4e93-bc33-5cae31af08a2',
    path: '/cognism/enrich-company',
  },
  postInstall: { universalIdentifier: '94a6a7ff-4e20-4fe7-9eff-dcab25f8fcc1' },
} as const;

export const COGNISM_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    cognismId: 'aa0acee8-f324-40d5-867a-a748912a8ac9',
    cognismRedeemId: '44c9adf4-1b07-4f90-bcf8-6af04dcbe345',
    cognismLocation: 'a9b976da-cd44-4058-8b9b-b62d06f55236',
    cognismManagementLevel: 'f196265b-59cb-41d8-bfd0-296c75a375f2',
    cognismJobFunction: 'cda3b512-e54f-46e7-959c-f7814d25a7be',
    cognismPositionStartDate: '6bb38e15-efaf-4bf5-a117-f64d42bb2851',
    cognismPreviousAccounts: '0dd77337-ecfd-4d9c-b724-c6e58f51966a',
    cognismEducation: '29a4d31e-296f-47b1-abc1-e7902de16070',
    cognismSkills: 'f28b5bc0-0780-4a38-9d6a-7c8581b82940',
    cognismEmailQuality: 'b414bf6b-44a4-4e41-bb1b-b70ce1750914',
    cognismPhoneNumbers: 'fa79f823-f6a4-4c3a-9f9d-4a6b9baa42ab',
    cognismLastConfirmed: '032d3052-7e53-43cc-a1ff-91cb87aba514',
    cognismPrivacyNotificationSent: '7f16f027-e2b3-48ad-a897-608ec9084f1f',
    cognismJobJoinEvent: '874357bf-0a41-448e-8a1c-e3d15389adc0',
    cognismJobLeaveEvent: '4a1459fd-4238-4c9b-8ff4-7e40c2b901b4',
    cognismEnrichmentStatus: 'e0bd8893-7e14-4dd5-b879-4a80a7f5e840',
    cognismMatchScore: '5ef6d9dc-739c-4c51-b71e-36d94808a839',
    cognismLastEnrichedAt: '90c2ada7-7edc-4d89-9f47-9b8ac270c6d1',
    cognismRawPayload: '35bcead9-888e-496a-b554-cfb66494f008',
  },
  company: {
    cognismId: 'e0bb6342-8188-497e-8627-b8cd4244a025',
    cognismRedeemId: '38370663-9a36-4baa-b7aa-286fcb274009',
    cognismIndustries: '1caa1d0c-3b55-4963-b470-79ac64aa13e5',
    cognismDescription: 'c0985bea-768e-49b8-b997-425d2da4dedc',
    cognismShortDescription: '454e7856-e189-418f-b1b3-a778015797cf',
    cognismFoundedYear: '18862cdc-43a5-4104-8fdc-36e586dba160',
    cognismCompanyType: 'de7b2f1a-d2e3-4cf3-b378-32bec88c9903',
    cognismSizeRange: '6ccd0209-b2fc-4dc1-a809-257b9198b837',
    cognismHeadcount: '225adab7-db5f-439e-a126-52b0c7c22bf9',
    cognismLocations: '2bcef156-091e-41db-b0f1-343c2894ae32',
    cognismNaics: 'de2fdfa6-1260-44e3-a870-a14818678587',
    cognismSic: '0c1b5ca0-4537-453f-97b4-080de1e03521',
    cognismOfficePhones: '15622af3-7feb-4d78-8c84-5aee748d9aff',
    cognismTechnologies: '0535efd9-0d4e-42e1-9f7c-06ff0d111478',
    cognismHiringEvent: '7ad6ccda-934e-440d-878b-d47db79eb5c3',
    cognismLastConfirmed: '505a7b39-c672-4757-a452-56d6260c54c1',
    cognismEnrichmentStatus: 'ff58598c-f5d2-46ae-80e9-aa2ea77e308c',
    cognismMatchScore: '578c3ead-48fa-4e7a-8384-9c73eea2b239',
    cognismLastEnrichedAt: '6f566d81-9179-492c-b207-7b2ace217ecb',
    cognismRawPayload: '808d010c-64cc-467a-9c65-f8f7d693d625',
  },
} as const;

export const COGNISM_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedPeople: '6d202191-9cec-4fa2-8608-48116bc983cf',
  enrichedCompanies: '3b20c6ee-4eae-42da-afaf-65e55a369b30',
} as const;

export const COGNISM_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: '9bbdada2-0ad0-4b32-9f43-bd6ae73d3139',
  enrichCompanies: '004e9908-20a5-4fc2-988a-c4087ed669a1',
} as const;

export const COGNISM_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'dd813177-7cc3-44fc-a6e9-3e78418be69c',
  enrichCompanies: '07acf805-edc6-41ce-a8e4-0f082ee3e706',
} as const;

export const COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: '05ce989c-a7bd-48fb-a2df-754a0e82d50e',
    notFound: '85db2b17-2bc8-4462-9bb3-ce1d57772f84',
    error: '82579862-2de4-4ed6-90d7-a4ca48dfb29f',
  },
  companyEnrichmentStatus: {
    matched: '7d315c90-12f7-4f17-85e3-0682bc066760',
    notFound: 'b7cb46b3-8007-4c5d-8088-b9d6fe47ee8a',
    error: 'bd47d9fc-736d-457b-96d2-1a060a84d523',
  },
  managementLevel: {
    boardMember: 'ae786eda-fbd5-4904-acd3-5d5704b6e5ac',
    cLevel: '4673dbc4-9f48-4f0c-9431-06ef6603abd5',
    vpLevel: '0faa7810-d0c5-4621-aeed-4459e967f610',
    directorLevel: '248cdc0f-5b0c-41c4-998d-5569993a2e12',
    managerLevel: 'ffe988c0-8ca9-4131-bde8-cadde050a3ce',
    senior: '6450c972-d82f-44ca-9110-d46cb980a8b4',
    entry: '55380cdf-c41e-4f1a-a920-c59d0846e48f',
    owner: 'a9a2bb96-24c1-4d2b-9bcf-2ac364abe4ed',
    partner: 'a7269b75-5fcb-457a-9dff-53f4031fc5b8',
    intern: '45f42022-50d4-47cb-a430-b1d9cae6bc0a',
  },
  jobFunction: {
    sales: '9484016a-b01e-4fcb-8d57-516a0741239f',
    marketing: '5eb237d5-8f63-42ad-b7ce-62cc0abb0b02',
    finance: '68a5da6f-1ee6-4af4-a4cf-dd67cf558d04',
    humanResources: '3beebae3-a312-450e-9bde-b67b695b39d7',
    informationTechnology: '42d90524-8e96-4fb4-b89b-804330790c4b',
    engineering: '452a63a8-c115-4757-976e-e881abbcd5d1',
    operations: 'b425355b-73de-44e0-a813-46270455da6d',
    legal: '4f3e9c55-e0fc-48ed-a75a-464a86557ca7',
    consulting: '1c916f8c-67ff-40b7-a131-08b7722a9711',
    customerService: '1b6ddc37-171d-4bb7-911f-c782e1996e0d',
    productManagement: '7a4dc075-6744-4300-aa18-5c667d30413e',
    researchDevelopment: 'edf1f923-0be7-4a70-8c16-229eba7d2d7a',
    administrative: '092464f5-8113-4584-8289-511b8ffb9c7b',
    procurement: '8f4e56ee-2640-4f0e-815c-d406a14d619e',
    education: 'e698b6aa-3cfc-4732-9ed1-a0408a911ebc',
    healthcare: '0d8a990b-49c6-4eca-bedb-edce96cf59dd',
    design: 'a742f88a-dbfb-47f5-9c5d-e55120ccea23',
    publicRelations: '09993651-9a59-4d43-8564-95b9bfee3093',
    qualityAssurance: '7b59114c-a56f-4fcc-ba9c-2171521539cd',
    security: '72160852-8e8f-45d2-82b2-81c6450e6f30',
    realEstate: '8334d64f-bba9-4a46-92f7-8df59d33aabb',
    media: 'd6b5d045-a246-4258-a138-0381dc1199eb',
    other: '50dd1df5-b763-4513-b126-fc319207e563',
  },
  emailQuality: {
    verified: '8f43ddda-5d4b-4b94-bff3-75879626bf06',
    valid: 'd5cddc92-a160-424e-8e94-2df9aa79d135',
    catchAll: 'bb3fc219-a4b5-4d44-9868-8c18a38a2029',
    unverified: 'cd7e55e2-1f8f-466c-89ae-e4b35c5efbc5',
    invalid: '4b941bb7-b515-4e13-8eee-1f6464744b9c',
  },
  companyType: {
    publicCompany: '9e189a77-7fe6-4dd9-b669-6e2320196d74',
    privateCompany: 'be99c20f-b604-467f-8ac1-c8ce13a7247c',
    nonProfit: 'b005c9c2-4908-4a7f-bea0-c91038ea75f7',
    government: '79c23046-91de-44cb-b6e3-1a4e286e4347',
    educational: 'b6a63288-c7ab-48d1-9014-4cea1d3cf357',
    subsidiary: 'c5daea59-0827-4e86-a499-87e130d6f4f4',
    partnership: '71e51ef5-ab03-4764-bc7f-efee2c4d3ad4',
    selfEmployed: 'd417ea65-80e0-46a8-8bdd-dcf71e194df6',
  },
  sizeRange: {
    size1To10: '7357c459-a66b-493a-9a4e-951e52d0357e',
    size11To50: '99b004ae-1d2e-4ae0-905f-ec587274acd3',
    size51To200: 'd9906a07-8d86-4bba-8915-382543e9366b',
    size201To500: '84083b25-faba-4ecc-9b10-b96a6b249ba9',
    size501To1000: '99234f99-1d13-489a-a98f-5d4bb01b30f8',
    size1001To5000: '648f3edf-781f-42be-ac0a-4e3e137f245e',
    size5001To10000: 'c6e10eed-e204-49c6-8ab7-60b3e665db71',
    size10001Plus: '16825476-6482-455a-b897-eebff0c4648d',
  },
} as const;
