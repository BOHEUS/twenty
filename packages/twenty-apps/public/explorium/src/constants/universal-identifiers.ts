export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '8d8b630b-5c84-4b64-b87d-40668c67e970';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '9426d1ef-ac63-4735-8bf8-720b3fc56e74';

export const EXPLORIUM_APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS = {
  contactDetails: '19c63e87-905d-4110-a4b1-a5039b0f2a31',
} as const;

export const EXPLORIUM_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: 'cf69c671-d8e4-4ec6-8502-dc037bbb1b01',
    path: '/explorium/enrich-people',
  },
  enrichPerson: {
    universalIdentifier: 'd556926d-7613-438e-8cf3-2fc9635e7a8d',
    path: '/explorium/enrich-person',
  },
  enrichCompanies: {
    universalIdentifier: '4a44a1b5-0358-4905-9c60-4a545881fc92',
    path: '/explorium/enrich-companies',
  },
  enrichCompany: {
    universalIdentifier: '952fbc21-7216-485f-8f46-a529263b71c9',
    path: '/explorium/enrich-company',
  },
} as const;

export const EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    exploriumId: 'd02d3160-2a93-47c2-85b4-272b756dcf0e',
    exploriumGender: '4f7f5ab8-579e-4df7-b4ee-0c1eecf59eb3',
    exploriumAgeGroup: '1906fcc9-d134-43ab-8fb0-445bde1be598',
    exploriumInterests: 'b0e438da-5ef9-401a-9cb6-851dcfe80594',
    exploriumLinkedinUrls: 'fd349b26-a04d-4042-8497-74e07f3cbfdb',
    exploriumLocation: '3de3957c-b700-4752-b660-4bea29264d76',
    exploriumJobLevels: '7983f3e3-405b-4b8d-b3f3-da8c6d6e6e43',
    exploriumJobDepartments: '752c2c82-fc0b-4b2b-b935-4901f60350a8',
    exploriumExperience: '278e4958-fce5-4d92-a3ed-e789a00574c3',
    exploriumEducation: 'a63f4c14-87b7-4459-bd66-519ad5fc41d3',
    exploriumSkills: 'f6134f6c-5d41-4db8-8b09-e43b36cff445',
    exploriumEmailStatus: 'a178d6f6-185f-40e1-956f-4606a0f227a7',
    exploriumRawPayload: '4ad7391e-e61b-4afe-880f-0407ffdbbdfc',
    exploriumLastEnrichedAt: 'e784d337-5bb9-41b5-a9ae-0e65f49b958c',
    exploriumEnrichmentStatus: '05d3185b-af0b-46a3-ae30-0b7893e8cd27',
  },
  company: {
    exploriumId: '3ca0f645-bcb8-4b59-96b5-cbe9238c0d9e',
    exploriumDescription: '9d2ea59a-2883-49d0-a43f-700bdaab55f3',
    exploriumIndustry: '26ec6eca-1dce-44da-b9fc-03f9cdde43b5',
    exploriumEmployeeRange: 'd28a4144-bf0a-4363-b8f8-f4c845a68676',
    exploriumRevenueRange: 'bef22a29-84e0-46c4-972a-fe34a5147893',
    exploriumTicker: 'ce17471c-dad1-4770-95b7-8b11ad935b04',
    exploriumNaics: '78d882e1-8f9c-43c9-9711-2bf8c7ccd8f9',
    exploriumNaicsDescription: '1220abc4-f31b-4529-ba58-e05ada3bacdb',
    exploriumSic: '0bd3a775-9011-4bd5-8290-0353fdfb651c',
    exploriumSicDescription: '304ec86e-b731-4f2b-be2d-7869b0028e3e',
    exploriumLocationsDistribution: 'dbd4a98d-b540-4577-9aa5-f34b69ba1815',
    exploriumRawPayload: '1557b592-f54b-4008-9445-5ff36c3b0019',
    exploriumLastEnrichedAt: 'ceed8605-3f92-49e4-8f5a-5d0e330b6648',
    exploriumEnrichmentStatus: 'f4dfee76-7c8c-471e-83bd-e3b5b1a66873',
  },
} as const;

export const EXPLORIUM_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedCompanies: '9509b0ca-59e1-4680-8adb-edb3b6813090',
  enrichedPeople: 'a8812f53-d657-4b35-b36f-e791db5a579c',
} as const;

export const EXPLORIUM_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: '4d4b101b-7294-434b-9a21-e69b19c34a71',
  enrichPeople: 'fa96eeb7-91cc-4803-afa1-a144f0c45071',
} as const;

export const EXPLORIUM_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichCompanies: '63c00ce3-f9de-4ac5-b6e0-d9ddd445641b',
  enrichPeople: 'f420f931-8177-4863-b79d-484ec8625b60',
} as const;

export const EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: 'c3716711-af6b-428e-a96a-70c70ab46f0d',
    notFound: 'd9d10970-949e-467c-bd96-d1f807ec1d87',
    error: '9a4532de-2956-4db3-92ba-ad3b18ad32c5',
  },
  companyEnrichmentStatus: {
    matched: 'd1ea88b7-0532-4729-a4fa-ff1ebe5ec001',
    notFound: 'aa5a743f-76dd-498c-a414-7dabf871b5cf',
    error: '7e3a64a3-7fff-4ff1-99fb-291228735a01',
  },
  gender: {
    male: '470810a8-5714-446c-93ed-3e412eb7c12e',
    female: '866b3058-d3b6-42ef-b7cd-dea9c20f8c62',
  },
  emailStatus: {
    valid: '54c59da7-4f54-4a07-b6db-3104b97052c2',
    catchAll: 'fb0b76a8-60fd-479c-9b11-fb3c78c44fbc',
    invalid: 'a7e093c0-cfc2-46e9-938e-fb2ab52ea61a',
  },
  jobLevel: {
    owner: 'd4211043-ba6e-478c-afe8-63c318a33381',
    cSuite: '43af113a-8087-47a3-aab5-7f03f01a4091',
    vicePresident: 'dae3fbef-e563-4b9a-9b7f-97ecdce4385b',
    director: 'b66b417a-6375-4b10-932f-dd75997f8a72',
    seniorNonManagerial: '66f34cdb-fd0b-4b9e-8332-01d8481e7cfd',
    manager: '9b23e3bc-afed-439d-86f2-eae2ebd32033',
    partner: 'e1bdff06-16a3-4836-864b-14a3ca2fe7d6',
    nonManagerial: 'f750fcf2-0144-4674-8653-8975f3da831f',
    junior: '4786ca8b-0942-4c85-86c0-c114fb08db15',
    president: 'd3db92dc-9b72-4af6-8db7-d7cfec706b36',
    seniorManager: 'b24d0b32-5e7b-40d7-869f-30f9040f87ec',
    advisor: '13e94d6d-e261-43df-9226-ba8e7cb762c4',
    freelancer: '49c2abd2-b2da-4c58-b186-f77a8cba7c82',
    boardMember: '751fd00c-2935-4848-852b-fbe1f2b154be',
    founder: '7bdc6312-135a-47dc-a672-a745d9d35308',
    training: '4f801b19-3198-4782-b2ba-28fd090766ee',
    unpaid: 'd4e841fa-eb2c-44f8-84a6-5740869143cd',
  },
  jobDepartment: {
    administration: 'fb03c65d-d319-4371-8c42-04de040301c2',
    realEstate: '275e4091-f89e-4081-ad70-41e0d1795a10',
    healthcare: 'b16f21c7-7364-4659-8071-0d3222505f07',
    partnerships: 'e793877c-f293-43e9-99c7-ea78f969c3c3',
    cSuite: '7dd58a04-2256-4ee6-8812-210e45d828c5',
    design: '2d1b1dbb-2376-4596-add7-e1add581eb40',
    humanResources: 'b4e58eca-747d-4101-ac75-6fef3390aeb6',
    engineering: 'fe956d2b-1abe-4f09-a341-e53cbeed9336',
    education: '9b1b4839-f27f-4d3d-98cf-5238ca463d2c',
    strategy: 'd066cfd1-1ce4-44b8-a3de-5695cb135582',
    product: '409bea73-5887-4ba1-a9fa-41794fc910c3',
    sales: '77e440f9-805f-4686-acf7-93b01d97f8cb',
    rAndD: '1d0bf12d-4605-4955-b055-e919d1e34ecd',
    retail: '70c0972a-ed7c-4b13-aa7f-d606aff21563',
    customerSuccess: '3724691a-af51-4805-93eb-01f91393cdb4',
    security: '04f6e60b-12f5-4e6b-a852-5ca57bbafc57',
    publicService: '80241cfb-2102-472e-8f68-e694ec19229a',
    creative: '3ab2784d-8f00-4ec0-a5ac-b63adc2c05b2',
    it: 'ddc5de50-6c9c-4914-9530-a808889db95a',
    support: '3b71ed51-aeb1-4961-a306-97464e4710ef',
    marketing: 'c520a7a4-6f2f-4842-8a9d-56064a7a4abb',
    trade: '7cddb325-0fbe-4404-b690-5e5498219c61',
    legal: '7de02750-b2d6-4e9e-ad97-8fa924d3def0',
    operations: '54aa7d29-d872-4801-b4ff-8f87d55865b8',
    procurement: 'f0b27b2d-b91a-4de3-b362-c1913e1d6d8b',
    data: '31ccbd1b-f656-49b9-af8e-24e46426d3f4',
    manufacturing: '0c7947ca-5e3d-44b8-b3b4-6b1b11262497',
    logistics: 'b0faebd3-5496-4ba2-938b-08465b956540',
    finance: '8cca2288-a2f3-4b1e-a997-842ec1463308',
  },
  employeeRange: {
    range110: '58385b6f-2e81-47f8-ab8b-2bac505443e8',
    range1150: 'db28ca6f-dd5d-4778-9a9c-0f714d5f4d40',
    range51200: 'b3bd9426-9fbc-4883-a3f7-592d5542188d',
    range201500: '0cf96806-0b02-4326-9f23-a860b80693e8',
    range5011000: 'd9cc163d-9f02-49c9-9c33-15eeb6feafcb',
    range10015000: '4868e9f5-f9cf-48b0-8ed7-991e671e76f1',
    range500110000: 'f9ee3832-4d06-4077-b2bd-e0adcf02b2f4',
    range10001Plus: '2ec0bff2-db0b-4478-bfe9-06a7da220b98',
  },
  revenueRange: {
    range0500k: '28cbd01f-b42c-49fa-ab45-118c51898c06',
    range500k1m: '30e87725-e638-44b7-a677-61545ecb6155',
    range1m5m: '205c30d5-9b3d-4c37-93f2-09108474b0e0',
    range5m10m: '7f989d70-87cf-41db-86a5-f6093d7d5470',
    range10m25m: '8981291e-1467-4aca-86b3-cade8795ff6e',
    range25m75m: '993dd136-abb8-4385-a7e0-b3efb535e742',
    range75m200m: 'a5284dcb-b3f8-4ade-aa75-a32fcc83a47d',
    range200m500m: 'f79d183a-faa8-492b-96bb-2c4eec12f2ef',
    range500m1b: 'e9aa7d92-3e27-4677-a317-3d8ed8a83015',
    range1b10b: '3d260f19-ba8a-419a-b771-c24a3bab288e',
    range10b100b: 'afb6e6ed-80d5-4ac8-a934-46bdbcad2aa0',
    range100b1t: '12d7c982-d1d0-406c-b447-e422e8cf7c9d',
    range1t10t: '2b04b74e-3d3b-44e2-854f-f617704332aa',
    range10tPlus: '1d23803d-53a1-464d-8566-f5a5d4361aab',
  },
} as const;
